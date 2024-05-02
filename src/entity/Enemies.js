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
  this.newEnemyTimer = this.game.timers.create(
    {
      duration: 3000,
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
  var randomEdge = Math.floor(Math.random() * 4);
  var randomX, randomY;

  switch (randomEdge) {
    case 0: // Övre kant
      randomX = Math.floor(Math.random() * this.application.screen.width);
      randomY = 0;
      break;
    case 1: // Höger kant
      randomX = this.application.screen.width;
      randomY = Math.floor(Math.random() * this.application.screen.height);
      break;
    case 2: // Nedre kant
      randomX = Math.floor(Math.random() * this.application.screen.width);
      randomY = this.application.screen.height;
      break;
    case 3: // Vänster kant
      randomX = 0;
      randomY = Math.floor(Math.random() * this.application.screen.height);
      break;
  }
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
  if (!this.player.isAlive && this.newEnemyTimer != null) {
    this.newEnemyTimer.stop();
    this.newEnemyTimer = null;
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
