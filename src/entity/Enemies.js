//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.Enemies = function (game, player) {
  this.game = game;
  this.enemies = [];
  this.newEnemyTimer = null;
  this.player = player;

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
  this.m_startNewEnemyTimer();
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
};

/**
 * Disposes the enemies.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Enemies.prototype.dispose = function () {
  rune.display.DisplayGroup.prototype.dispose.call(this);
  this.m_disposeEnemies();
};

//------------------------------------------------------------------------------

ArcticMadness.entity.Enemies.prototype.m_startNewEnemyTimer = function () {
  console.log("startNewEnemyTimer");
  this.newEnemyTimer = this.game.timers.create(
    {
      duration: 3000,
      onTick: function () {
        console.log("onComplete");
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
  console.log("createEnemies");
  var randomX = Math.floor(Math.random() * this.application.screen.width);
  var randomY = Math.floor(Math.random() * this.application.screen.width);
  var enemy = new ArcticMadness.entity.Enemy(
    randomX,
    randomY,
    this.game.player,
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
  console.log("checkIfPlayerAlive");
  if (!this.player.isAlive && this.newEnemyTimer != null) {
    console.log("stopNewEnemyTimer");
    this.newEnemyTimer.stop();
    this.newEnemyTimer = null;
    this.dispose();
  }
};

/**
 * Disposes the enemies.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Enemies.prototype.m_disposeEnemies = function () {
  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i].dispose(); 
    this.removeMember(this.enemies[i], true);
  }

  this.enemies = [];
};
