//--------------------------------
// Constructor scope
//--------------------------------

/**
 * Creates a new instance of the Enemy class.
 * @constructor
 * @param {number} x The x position of the enemy.
 * @param {number} y The y position of the enemy.
 * @param {Array} players The players array.
 * @param {ArcticMadness.map.Map} map The map object.
 * @param {ArcticMadness.scene.Game} game The game object.
 * @returns {undefined}
 * @extends {rune.display.Sprite}
 * @class
 * @public
 */

ArcticMadness.entity.Enemy = function (x, y, players, map, game) {
  this.x = x;
  this.y = y;
  this.players = players; // Reference to the player object.
  this.map = map; // Reference to the map object.
  this.game = game; // Reference to the game object.
  this.isInWater = false;
  this.isAlive = true;

  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  /**
   * Calls the constructor method of the super class.
   */
  rune.display.Sprite.call(this, this.x, this.y, 64, 64, "64_enemy_lepardseal");
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.entity.Enemy.prototype = Object.create(
  rune.display.Sprite.prototype
);
ArcticMadness.entity.Enemy.prototype.constructor = ArcticMadness.entity.Enemy;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Enemy.prototype.init = function () {
  rune.display.Sprite.prototype.init.call(this);
  this.animation.create("water", [6, 7], 6, true);
  this.animation.create("walk", [0, 1, 2, 3], 5, true);
  this.animation.create("attack", [4], 1, true);
  this.animation.create("dead", [8, 9, 10, 11], 5, false);
  this.m_createSound();
  this.m_setHitbox();
};

/**
 * This method runs every frame and is used to update game logic about the enemy.
 *
 * @param {number} step The time between the frames.
 * @returns {undefined}
 */

ArcticMadness.entity.Enemy.prototype.update = function (step) {
  rune.display.Sprite.prototype.update.call(this, step);
  if (this.isAlive) {
    this.m_followPlayer();
  }

  for (var i = 0; i < this.players.length; i++) {
    var player = this.players[i];
    if (player.isAlive && !player.isInWater) {
      this.m_checkPlayerCollision(player);
    }
  }
};

/**
 * This method disposes the enemy object.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Enemy.prototype.dispose = function () {
  console.log("dispose enemy");
  this.game = null;
  this.map = null;
  this.players = null;
  rune.display.Sprite.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Public prototype methods
//------------------------------------------------------------------------------

/**
 * This method kills the enemy object and removes it from the stage.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Enemy.prototype.killenemy = function () {
  this.isAlive = false;
  this.animation.gotoAndPlay("dead");
  this.hitSound.play();
  this.game.timers
    .create({
      duration: 1000,
      scope: this,
      onComplete: function () {
        this.game.stage.removeChild(this, true);
      },
    })
    .start();
};

//------------------------------------------------------------------------------
// Private prototype methods
//------------------------------------------------------------------------------





/**
 * This method creates the sound for the enemy object.
 *
 * @returns {undefined}
 */
ArcticMadness.entity.Enemy.prototype.m_createSound = function () {
  this.hitSound = this.application.sounds.sound.get("sealhit");
  this.hitSound.loop = false;
}

/**
 * This method makes the enemy follow the player.
 * The enemy will follow the player if the player is not in water.
 * If the player is in water, the enemy will move towards the center of the screen.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Enemy.prototype.m_followPlayer = function () {
  var centerX = this.application.screen.width / 2;
  var centerY = this.application.screen.height / 2;
  var closestPlayer = this.m_getClosestPlayer();
  var proximityThreshold = 2;

  if (closestPlayer !== null) {
    if (closestPlayer.isInWater) {
      if (Math.abs(this.x - centerX) > proximityThreshold) {
        if (this.x < centerX) {
          this.x += 2;
          this.animation.gotoAndPlay("walk");
          this.flippedX = false;
        } else {
          this.x -= 2;
          this.flippedX = true;
        }
      }
      if (Math.abs(this.y - centerY) > proximityThreshold) {
        if (this.y < centerY) {
          this.y += 2;
        } else {
          this.y -= 2;
        }
      }
    }
    if (!closestPlayer.isInWater) {
      if (Math.abs(this.x - closestPlayer.x) > proximityThreshold) {
        if (this.x < closestPlayer.x) {
          this.x += 2;
          this.animation.gotoAndPlay("walk");
          this.flippedX = false;
        } else {
          this.x -= 2;
          this.flippedX = true;
        }
      }
      if (Math.abs(this.y - closestPlayer.y) > proximityThreshold) {
        if (this.y < closestPlayer.y) {
          this.y += 2;
        } else {
          this.y -= 2;
        }
      }
    }
  }
};

/**
 * This method checks if the enemy is colliding with the player.
 * If the enemy is colliding with the player, the player is attacked.
 * The enemy will then move the player towards the nearest water tile.
 *
 * @param {ArcticMadness.entity.Player} player The player object.
 * @returns {undefined}
 */

ArcticMadness.entity.Enemy.prototype.m_checkPlayerCollision = function (
  player
) {
  if (this.isAlive) {
    if (this.hitTestObject(player)) {
      player.isAttacked = true;
      player.gun.alpha = 0;
      this.animation.gotoAndPlay("attack");
      player.animation.gotoAndPlay("dragy");
      this.m_getNearestWater(player.x, player.y, player);
    } else {
      player.isAttacked = false;
      player.gun.alpha = 1;
    }
  }
};

/**
 * This method moves the player and the enemy towards the nearest edge of the screen towards water.
 * The method is used when the player is attacked by the enemy.
 *
 * @param {number} x The x-coordinate of the player.
 * @param {number} y The y-coordinate of the player.
 * @param {ArcticMadness.entity.Player} player The player object.
 * @returns {undefined}
 */

ArcticMadness.entity.Enemy.prototype.m_getNearestWater = function (
  x,
  y,
  player
) {
  var topLeft = this.application.screen.width / 2;
  var bottomLeft = this.application.screen.height / 2;

  if (x <= topLeft && y <= bottomLeft) {
    player.x -= 1;
    player.y -= 4;
    this.x -= 1;
    this.y -= 4;
  }
  if (x <= topLeft && y >= bottomLeft) {
    player.x -= 1;
    player.y += 4;
    this.x -= 1;
    this.y += 4;
  }
  if (x >= topLeft && y <= bottomLeft) {
    player.x += 1;
    player.y -= 4;
    this.x += 1;
    this.y -= 4;
  }
  if (x >= topLeft && y >= bottomLeft) {
    player.x += 1;
    player.y += 4;
    this.x += 1;
    this.y += 4;
  }
};

/**
 * This method sets the hitbox of the enemy object.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Enemy.prototype.m_setHitbox = function () {
  this.hitbox.set(0, 16, 64, 28);
};

/**
 * This method gets the closest player to the enemy.
 * The method will return the closest player that is not in water.
 *
 * @returns {ArcticMadness.entity.Player} The closest player object.
 */

ArcticMadness.entity.Enemy.prototype.m_getClosestPlayer = function () {
  var closestPlayer = null;
  var closestDistance = Infinity;

  for (var i = 0; i < this.players.length; i++) {
    var player = this.players[i];
    var distance = Math.sqrt(
      Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2)
    );

    if (distance < closestDistance && !player.isInWater) {
      closestPlayer = player;
      closestDistance = distance;
    }
  }

  return closestPlayer;
};
