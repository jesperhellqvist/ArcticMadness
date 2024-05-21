//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.Player = function (
  x,
  y,
  penguin,
  color,
  gamepad,
  id
) {
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
  this.diagonalMovement = false;
  this.moveable = true;
  this.falling = false;
  this.id = id; // Player id
  this.animationBlock = null;
  this.inWaterTile = null; // Index of the tile the player is in
  this.isRevivable = false; // Player is revivable
  this.revivingTileSet = false; 

  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  /**
   * Calls the constructor method of the super class.
   */
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

ArcticMadness.entity.Player.prototype.init = function () {
  rune.display.Sprite.prototype.init.call(this);
  this.texture.replaceColor(
    new rune.color.Color24(133, 144, 255),
    new rune.color.Color24(this.color.r, this.color.g, this.color.b)
  );

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
  this.animation.create("death", [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 40, 41, 42, 43], 8, false);
  //Attacked animation, injured
  this.animation.create("dragy", [45, 46], 4, true);
  this.animation.create("dragx", [47, 48], 4, true);
  this.m_createGun();
  this.m_setPhysics();
};

ArcticMadness.entity.Player.prototype.update = function (step) {
  rune.display.Sprite.prototype.update.call(this, step);

  if (!this.isInWater && this.isAlive && !this.isAttacked && !this.isRepairing && this.moveable) {
    this.m_handleInputGamepad();
    this.m_handleHitBox();
  }
};


ArcticMadness.entity.Player.prototype.dispose = function () {
  rune.display.Sprite.prototype.dispose.call(this);
};

//--------------------------------------------------------------------------
// Private methods
//--------------------------------------------------------------------------


ArcticMadness.entity.Player.prototype.m_handleInputGamepad = function () {
  var stickLeftX = this.gamepad.stickLeft.x;
  var stickLeftY = this.gamepad.stickLeft.y;

    // If the joystick is in its original position, don't move the player
    if (stickLeftX === 0 && stickLeftY === 0) {
      return;
    }

  var radian = Math.atan2(stickLeftY, stickLeftX);
  var angle = (rune.util.Math.radiansToDegrees(radian) + 360) % 360;

  var speed = this.diagonalMovement ? 3 / Math.sqrt(2) : 3;
  var velocityChange = this.diagonalMovement ? 0.15 / Math.sqrt(2) : 0.15;

  //Right
  if ((angle < 45 && angle >= 0 ) || (angle > 315 && angle < 360)) {
    this.x += speed;
    this.velocity.x += velocityChange;
    this.flippedX = false;
    this.gun.flippedX = false;
    this.animation.gotoAndPlay("walk");
  }

  //Down
  if (angle > 45 && angle < 135) {
    this.y += speed;
    this.velocity.y += velocityChange;
    this.flippedX = false;
    this.animation.gotoAndPlay("down");
  }

  //Left
  if (angle > 135 && angle < 225) {
    this.x -= speed;
    this.velocity.x -= velocityChange;
    this.flippedX = true;
    this.animation.gotoAndPlay("walk");
  }

  //Up
  if (angle > 225 && angle < 315) {
    this.y -= speed;
    this.velocity.y -= velocityChange;
    this.flippedX = false;
    this.animation.gotoAndPlay("up");
  }
};

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


ArcticMadness.entity.Player.prototype.m_setPhysics = function () {
  this.velocity.drag.x = 0.04;
  this.velocity.drag.y = 0.04;
  this.velocity.max.y = 2.5;
  this.velocity.max.x = 2.5;
};

ArcticMadness.entity.Player.prototype.m_handleHitBox = function () {
this.hitbox.set(16, 8, 32, 46);
   this.hitbox.debug = false;
   
};