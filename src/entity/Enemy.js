//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.Enemy = function (x, y, players, map, game) {
  this.x = x;
  this.y = y;
  this.players = players; // Reference to the player object.
  // this.playerPositionX = this.player.x;
  // this.playerPositionY = this.player.y;
  this.map = map; // Reference to the map object.
  this.game = game; // Reference to the game object.
  this.isInWater = false;

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

// This is the init method, which is called when the object is created.

ArcticMadness.entity.Enemy.prototype.init = function () {
  rune.display.Sprite.prototype.init.call(this);
  this.animation.create("water", [6,7], 6, true);
  this.animation.create("walk", [0, 1, 2, 3], 5, true);
  this.animation.create("attack", [4], 1, true);
 
  this.m_setHitbox();
};

// This is the update method, which is called every frame.

ArcticMadness.entity.Enemy.prototype.update = function (step) {
  rune.display.Sprite.prototype.update.call(this, step);

  this.m_followPlayer();
  for (var i = 0; i < this.players.length; i++) {
    var player = this.players[i];
    if (player.isAlive && !player.isInWater) {
      this.m_checkPlayerCollision(player);
    }
  }
};

// This is the dispose method, which is called when the object is removed.

ArcticMadness.entity.Enemy.prototype.dispose = function () {
  rune.display.Sprite.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Private prototype methods
//------------------------------------------------------------------------------

// This method makes the enemy follow the player.

ArcticMadness.entity.Enemy.prototype.m_followPlayer = function () {
  var centerX = this.application.screen.width / 2;
  var centerY = this.application.screen.width / 2;
  var closestPlayer = this.m_getClosestPlayer();
  var proximityThreshold = 2;

  if (closestPlayer) {
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

// This method checks for collision with the player.

ArcticMadness.entity.Enemy.prototype.m_checkPlayerCollision = function (
  player
) {
  if (this.hitTestObject(player)) {
    player.isAttacked = true;
    player.health -= 1;
    player.gun.alpha = 0;
    this.animation.gotoAndPlay("attack");
    player.animation.gotoAndPlay("dragy");
    this.m_getNearestWater(player.x, player.y, player);
  }
};

// This method gets the nearest water tile.

ArcticMadness.entity.Enemy.prototype.m_getNearestWater = function (
  x,
  y,
  player
) {
  var topLeft = this.application.screen.width / 2;
  var bottomLeft = this.application.screen.height / 2;

  if (x < topLeft && y < bottomLeft) {
    player.x -= 1;
    player.y -= 4;
    this.x -= 1;
    this.y -= 4;
  }
  if (x < topLeft && y > bottomLeft) {
    player.x -= 1;
    player.y += 4;
    this.x -= 1;
    this.y += 4;
  }
  if (x > topLeft && y < bottomLeft) {
    player.x += 1;
    player.y -= 4;
    this.x += 1;
    this.y -= 4;
  }
  if (x > topLeft && y > bottomLeft) {
    player.x += 1;
    player.y += 4;
    this.x += 1;
    this.y += 4;
  }
};

ArcticMadness.entity.Enemy.prototype.m_setHitbox = function () {
  this.hitbox.set(0, 16, 64, 28);
  this.hitbox.debug = false;
};

ArcticMadness.entity.Enemy.prototype.m_getClosestPlayer = function () {
  var closestPlayer = null;
  var closestDistance = Infinity;

  for (var i = 0; i < this.players.length; i++) {
    var player = this.players[i];
    var dx = player.x - this.x;
    var dy = player.y - this.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestPlayer = player;
    }
  }

  return closestPlayer;
};
