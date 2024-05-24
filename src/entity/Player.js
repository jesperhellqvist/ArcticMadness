//--------------------------------
// Constructor scope
//--------------------------------

/**
 * Creates a new instance of the Player class.
 *
 * @constructor
 * @param {number} x The x position of the player.
 * @param {number} y The y position of the player.
 * @param {string} penguin The penguin texture.
 * @param {Object} color The color of the player.
 * @param {rune.input.Gamepad} gamepad The gamepad object.
 * @param {number} id The player id.
 * @returns {undefined}
 * @extends {rune.display.Sprite}
 * @class
 * @public
 */

ArcticMadness.entity.Player = function (x, y, penguin, color, gamepad, id) {
  this.health = 250; // Player health
  this.x = x; // Player x position
  this.y = y; // Player y position
  this.angle = 0; // Player angle
  this.gamepad = gamepad; // Player gamepad
  this.color = color; // Player color
  this.gun = null; // Reference to the gun object
  this.isInWater = false; // Player is in water
  this.isRepairing = false; // Player is repairing ice
  this.isAlive = true; // Player is alive
  this.isAttacked = false; // Player is attacked
  this.moveable = true;
  this.falling = false;
  this.id = id; // Player id
  this.animationBlock = null; // Player animation block objekt
  this.inWaterTile = null; // Index of the tile the player is in
  this.isRevivable = false; // Player is revivable
  this.revivingTileSet = false; // Player is reviving tile set

  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  rune.display.Sprite.call(this, this.x, this.y, 64, 64, penguin);
};

//--------------------------------------------------------------------------
// Inheritance
//--------------------------------------------------------------------------

ArcticMadness.entity.Player.prototype = Object.create(
  rune.display.Sprite.prototype
);
ArcticMadness.entity.Player.prototype.constructor = ArcticMadness.entity.Player;

//--------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//--------------------------------------------------------------------------

/**
 * This method initializes the player object.
 *
 * @returns {undefined}
 * @public
 */

ArcticMadness.entity.Player.prototype.init = function () {
  rune.display.Sprite.prototype.init.call(this);
  this.m_initColor();
  this.m_initAnimation();
  this.m_createGun();
  this.m_setPhysics();
};

/**
 * This method runs every frame and is used to update game logic about the player.
 *
 * @param {number} step The time between frames.
 * @returns {undefined}
 * @public
 */

ArcticMadness.entity.Player.prototype.update = function (step) {
  rune.display.Sprite.prototype.update.call(this, step);

  if(this.isAttacked){
    return;
  }

  if (
    !this.isInWater &&
    this.isAlive &&
    !this.isRepairing &&
    this.moveable
  ) {
    this.m_handleInputGamepad();
    this.m_handleHitBox();
  }
};

/**
 * This method disposes the player object.
 *
 * @returns {undefined}
 * @public
 */

ArcticMadness.entity.Player.prototype.dispose = function () {
  this.animationBlock = null;
  this.color = null;
  this.gamepad = null;
  this.gun = null;
  rune.display.Sprite.prototype.dispose.call(this);
};

//--------------------------------------------------------------------------
// Private methods
//--------------------------------------------------------------------------

/**
 * This method initializes the color of the player.
 * @returns {undefined}
 * @private
 */

ArcticMadness.entity.Player.prototype.m_initColor = function () {
  this.texture.replaceColor(
    new rune.color.Color24(133, 144, 255),
    new rune.color.Color24(this.color.r, this.color.g, this.color.b)
  );
};

/**
 * This method initializes the animations of the player.
 * @returns {undefined}
 * @private
 */

ArcticMadness.entity.Player.prototype.m_initAnimation = function () {
  //Moving animations
  this.animation.create("idle", [0, 1, 2, 3], 8, true);
  this.animation.create("walk", [5, 6, 7, 8], 10, true);
  this.animation.create("down", [10, 11, 12, 13, 14], 10, true);
  this.animation.create("up", [15, 16, 17, 18], 10, true);
  //Looking animations, standing still, different directions
  this.animation.create("lookup", [15], 10, true);
  this.animation.create("lookdown", [10], 10, true); //delete this if not used
  this.animation.create("lookside", [5, 9], 10, true); //test for idle when looking sideways
  //Action animations

  this.animation.create("repair", [20, 21, 22, 23], 8, true);
  //Water animations
  this.animation.create("falling", [25, 26, 27, 28, 29], 9, true);
  this.animation.create("drown", [30, 31], 8, true);
  this.animation.create(
    "death",
    [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 40, 41, 42, 43],
    8,
    false
  );
  //Attacked animation, injured
  this.animation.create("dragy", [45, 46], 4, true);
  this.animation.create("dragx", [47, 48], 4, true);
};

/**
 * This method handles the player input from the gamepad.
 *
 * @returns {undefined}
 * @private
 */

ArcticMadness.entity.Player.prototype.m_handleInputGamepad = function () {
  var stickLeftX = this.gamepad.stickLeft.x;
  var stickLeftY = this.gamepad.stickLeft.y;

  // If the joystick is in its original position, don't move the player
  if (stickLeftX === 0 && stickLeftY === 0) {
    return;
  }

  var radian = Math.atan2(stickLeftY, stickLeftX);
  var angle = (rune.util.Math.radiansToDegrees(radian) + 360) % 360;

  //Right
  if ((angle < 45 && angle >= 0) || (angle > 315 && angle < 360)) {
    this.x += 3;
    this.velocity.x += 0.15;
    this.flippedX = false;
    this.gun.flippedX = false;
    this.animation.gotoAndPlay("walk");
  }

  //Down
  if (angle > 45 && angle < 135) {
    this.y += 3;
    this.velocity.y += 0.15;
    this.flippedX = false;
    this.animation.gotoAndPlay("down");
  }

  //Left
  if (angle > 135 && angle < 225) {
    this.x -= 3;
    this.velocity.x -= 0.15;
    this.flippedX = true;
    this.animation.gotoAndPlay("walk");
  }

  //Up
  if (angle > 225 && angle < 315) {
    this.y -= 3;
    this.velocity.y -= 0.15;
    this.flippedX = false;
    this.animation.gotoAndPlay("up");
  }
};

/**
 * This method creates the gun object and adds it to the stage.
 *
 * @returns {undefined}
 * @private
 */

ArcticMadness.entity.Player.prototype.m_createGun = function () {
  this.gun = new ArcticMadness.entity.Gun(
    this.x,
    this.y,
    this.color,
    this.gamepad,
    this
  );
  this.stage.addChild(this.gun);
};

/**
 * This method sets the physics properties of the player.
 *
 * @returns {undefined}
 * @private
 */

ArcticMadness.entity.Player.prototype.m_setPhysics = function () {
  this.velocity.drag.x = 0.04;
  this.velocity.drag.y = 0.04;
  this.velocity.max.y = 2.5;
  this.velocity.max.x = 2.5;
};

/**
 * This method sets the hitbox of the player.
 *
 * @returns {undefined}
 * @private
 */

ArcticMadness.entity.Player.prototype.m_handleHitBox = function () {
  this.hitbox.set(16, 8, 32, 46);
};
