//--------------------------------
// Constructor scope
//--------------------------------

/**
 * Creates a new instance of the Enemies class.
 * @constructor
 * @param {ArcticMadness.scene.Game} game The game object.
 * @param {Array} players The players array.
 * @returns {undefined}
 * @class
 * @public
 */

ArcticMadness.entity.Enemies = function (game, players) {
  this.game = game;
  this.enemies = [];
  this.newEnemyTimer = null;
  this.durations = [2000, 1600, 1400, 1200, 1000, 800, 600];
  this.players = players; // Array of player objects

  this.init();
};

//------------------------------------------------------------------------------
// public prototype methods
//------------------------------------------------------------------------------

/**
 * This method initializes the enemies object.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Enemies.prototype.init = function () {
  this.startNewEnemyTimer(0);
};

/**
 * Updates the enemies.
 *
 * @param {number} step The step time.
 * @returns {undefined}
 */

ArcticMadness.entity.Enemies.prototype.update = function (step) {
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
 * Disposes the enemies and set all komplex propeties to null.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Enemies.prototype.dispose = function () {
  this.players = null;
  this.durations = null;
  this.newEnemyTimer = null;
  this.enemies = null;
  this.game = null;
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

/**
 * Starts the new enemy timer.
 *
 * @param {number} currentWave The current wave.
 * @returns {undefined}
 */

ArcticMadness.entity.Enemies.prototype.startNewEnemyTimer = function (
  currentWave
) {
  if (currentWave >= 7) {
    currentWave = 6;
  }
  if (currentWave < 7) {
    this.newEnemyTimer = this.game.timers.create(
      {
        duration: this.durations[currentWave],
        onTick: function () {
          this.m_createEnemy();
        },
        repeat: Infinity,
        scope: this,
      },
      true
    );
  }
};

/**
 * Creates the enemies. The enemies are spawned on a random water tiles.
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
 * Checks if the player is alive. If all players are dead, the new enemy timer is stopped.
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
    this.newEnemyTimer.stop();
    this.newEnemyTimer = null;
  }
};
