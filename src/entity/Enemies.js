//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.Enemies = function (game) {
  this.game = game;
  this.enemies = [];

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
  console.log("Enemies init");  
  this.m_createEnemies();
};

/**
 * This method is automatically executed once after the scene is instantiated.
 * The method is used to create objects to be used within the scene.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Enemies.prototype.update = function (step) {
  rune.display.DisplayGroup.prototype.update.call(this, step);
  //this.m_updateEnemies(step);
};

//------------------------------------------------------------------------------

/**
 * Creates the enemies.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Enemies.prototype.m_createEnemies = function () {
  for (var i = 0; i < 10; i++) {
    var randomX = Math.floor(Math.random() * this.application.screen.width);
    var randomY = Math.floor(Math.random() * this.application.screen.width);
    console.log(randomX, randomY);
    var enemy = new ArcticMadness.entity.Enemy(
      randomX,
      randomY,
      this.game.player,
      this.game.map,
      this.game
    );
    this.enemies.push(enemy);
    //this.addMember(enemy);
    this.game.stage.addChild(enemy);
  }
};

/**
 * Updates the enemies.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Enemies.prototype.m_updateEnemies = function (step) {
  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i].update(step);
  }
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
