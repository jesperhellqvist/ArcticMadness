//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Creates a new object.
 *
 * @constructor
 * @extends rune.scene.Scene
 *
 * @class
 * @classdesc
 *
 * Game scene.
 */
ArcticMadness.scene.Game = function () {
  this.map = null;
  this.player = null;
  this.enemies = null;
  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  /**
   * Calls the constructor method of the super class.
   */
  rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
ArcticMadness.scene.Game.prototype.constructor = ArcticMadness.scene.Game;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated.
 * The method is used to create objects to be used within the scene.
 *
 * @returns {undefined}
 */
ArcticMadness.scene.Game.prototype.init = function () {
  rune.scene.Scene.prototype.init.call(this);

  this.stage.map.load("map");

  this.player = new ArcticMadness.entity.Player(
    700,
    100,
    "64_penguin_nogun",
    {
      r: "250",
      g: "0",
      b: "0",
    },
    {
      left: "A",
      right: "D",
      up: "W",
      down: "S",
      shoot: "SPACE",
    },
    this.gamepads.get(0)
  );
  
  this.enemies = new ArcticMadness.entity.Enemies(this);

  // var player2 = new ArcticMadness.entity.Player(
  //   700,
  //   100,
  //   "64_penguin_nogun",{
  //     r:"0",
  //     g:"0",
  //     b:"250",
  //   },
  //   {
  //     left: "A",
  //     right: "D",
  //     up: "W",
  //     down: "S",
  //     shoot: "SPACE",
  //   },
  //   this.gamepads.get(1)
  // );

  //var players = new ArcticMadness.entity.Players(this);

  //this.stage.addChild(players);

  //var enemy = new ArcticMadness.entity.Enemy(200, 200, this.player, this.stage.map, this);

  //this.player.hitTestEnemy(enemies);
  this.map = new ArcticMadness.map.Map(
    this.stage.map,
    this.player,
    this,
    this.gamepads.get(0)
  );
  // var timer = this.timers.create({
  //   duration: 1000,
  //   onTick: function () {
  //     map.changeRandomTile();
  //   },
  //   repeat: 10,
  //   scope: this,
  // });

  this.stage.addChild(this.player);
  //this.stage.addChild(player2);
  //this.stage.addChild(enemy);
};

/**
 * This method is automatically executed once per "tick". The method is used for
 * calculations such as application logic.
 *
 * @param {number} step Fixed time step.
 *
 * @returns {undefined}
 */
ArcticMadness.scene.Game.prototype.update = function (step) {
  rune.scene.Scene.prototype.update.call(this, step);
  this.m_checkBulletCollision();
  this.map.update(step);
};

/**
 * This method is automatically called once just before the scene ends. Use
 * the method to reset references and remove objects that no longer need to
 * exist when the scene is destroyed. The process is performed in order to
 * avoid memory leaks.
 *
 * @returns {undefined}
 */
ArcticMadness.scene.Game.prototype.dispose = function () {
  rune.scene.Scene.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Private prototype methods
//------------------------------------------------------------------------------

ArcticMadness.scene.Game.prototype.m_checkBulletCollision = function () {
  console.log("Bullet collision")
  console.log(this.player.gun.bullet);

  if (this.player.gun.bullet != null) {
    for (var i = 0; i < this.enemies.enemies.length; i++) {
      if (this.player.gun.bullet.hitTestObject(this.enemies.enemies[i])) {
        console.log("Hit enemy");
        this.enemies.enemies[i].dispose();
        this.player.gun.bullet.dispose();
      }
    }
  }
};
