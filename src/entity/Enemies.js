//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.Enemies = function (game, players) {
  this.game = game;
  this.enemies = [];
  this.newEnemyTimer = null;
  this.players = players; // Array of player objects

  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  /**
   * Calls the constructor method of the super class.
   */
  rune.display.DisplayGroup.call(this);
  this.init();
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.entity.Enemies.prototype = Object.create(
  rune.display.DisplayGroup.prototype
);
ArcticMadness.entity.Enemies.prototype.constructor =
  ArcticMadness.entity.Enemies;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated.
 * The method is used to create objects to be used within the scene.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Enemies.prototype.init = function () {
  rune.display.DisplayGroup.prototype.init.call(this);
  this.startNewEnemyTimer();
};

/**
 * This method is automatically executed once after the scene is instantiated.
 * The method is used to create objects to be used within the scene.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Enemies.prototype.update = function (step) {
  rune.display.DisplayGroup.prototype.update.call(this, step);
  this.m_checkIfPlayerAlive();
  if (this.enemies.length > 0) {
    for (var i = 0; i < this.enemies.length; i++) {
      var enemy = this.enemies[i];
      if (this.game.map.checkIfEnemyInWater(enemy)) {
        enemy.animation.gotoAndPlay("water");
      } else {
        enemy.animation.gotoAndPlay("walk");
      }
    }
  }
};

/**
 * Disposes the enemies.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Enemies.prototype.dispose = function () {
  rune.display.DisplayGroup.prototype.dispose.call(this);
  this.disposeEnemies();
};

/**
 * Disposes the enemies.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Enemies.prototype.disposeEnemies = function () {
  for (var i = 0; i < this.enemies.length; i++) {
    this.game.stage.removeChild(this.enemies[i], true);
  }

  this.enemies = [];
};

//------------------------------------------------------------------------------

ArcticMadness.entity.Enemies.prototype.startNewEnemyTimer = function () {
  this.newEnemyTimer = this.game.timers.create(
    {
      duration: 500,
      onTick: function () {
        this.m_createEnemy();
      },
      repeat: Infinity,
      scope: this,
    },
    true
  );
};

/**
 * Creates the enemies.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Enemies.prototype.m_createEnemy = function () {
  var randomWaterTile = this.game.map.getRandomWaterTile();
  var randomX = randomWaterTile.x;
  var randomY = randomWaterTile.y;

  var enemy = new ArcticMadness.entity.Enemy(
    randomX,
    randomY,
    this.players,
    this.game.map,
    this.game
  );
  this.enemies.push(enemy);
  this.game.stage.addChild(enemy);
};

/**
 * Updates the enemies.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Enemies.prototype.m_checkIfPlayerAlive = function () {
  var allPlayersInWater = true;
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].isAlive) {
      allPlayersInWater = false;
      break;
    }
  }

  if (allPlayersInWater && this.newEnemyTimer != null) {
    console.log("Game over");
    this.newEnemyTimer.stop();
    this.newEnemyTimer = null;
  }
};
