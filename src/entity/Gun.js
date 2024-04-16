//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.Gun = function (x, y, gamepad, player) {
  this.x = x;
  this.y = y;
  this.gamepad = gamepad;
  this.angle = 0;
  this.player = player;
  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  /**
   * Calls the constructor method of the super class.
   */
  rune.display.Sprite.call(this, this.x, this.y, 32, 32, "guntest");
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.entity.Gun.prototype = Object.create(
  rune.display.Sprite.prototype
);
ArcticMadness.entity.Gun.prototype.constructor = ArcticMadness.entity.Gun;

//------------------------------------------------------------------------------

ArcticMadness.entity.Gun.prototype.init = function () {
  rune.display.Sprite.prototype.init.call(this);

  this.player.animation.create("walk", [5, 6, 7, 8], 10, true);
  this.player.animation.create("down", [10, 11, 12, 13, 14], 10, true);
  this.player.animation.create("up", [15, 16, 17, 18], 10, true);
};

ArcticMadness.entity.Gun.prototype.update = function (step) {
  rune.display.Sprite.prototype.update.call(this, step);
  this.m_handleInputStickRight();
  this.m_handleButton7();
};

ArcticMadness.entity.Gun.prototype.m_handleInputStickRight = function () {
  var stickRightX = this.gamepad.stickRight.x;
  var stickRightY = this.gamepad.stickRight.y;

  var radian = Math.atan2(stickRightY, stickRightX);
  var angle = rune.util.Math.radiansToDegrees(radian);

  if (angle < 0) {
    angle += 360;
  }
  if ((angle < 45 && angle < 90) || (angle > 315 && angle < 360)) {
    this.player.flippedX = false;
    this.flippedX = false;
    this.player.animation.gotoAndPlay("walk");
  }
  if (angle > 45 && angle < 135) {
    this.player.animation.gotoAndPlay("down");
  }
  if (angle > 135 && angle < 225) {
    this.player.flippedX = true;
    this.flippedX = true;
    this.player.animation.gotoAndPlay("walk");
  }
  if (angle > 225 && angle < 315) {
    this.player.animation.gotoAndPlay("up");
  }

  this.pivotX = 12;
  this.pivotY = 22;

  console.log(this.pivotX, this.pivotY);
  this.angle = angle;
  this.rotation = angle;
};

ArcticMadness.entity.Gun.prototype.m_handleButton7 = function () {
  if (this.gamepad.justPressed(7)) {
    this.m_handleShoot(this.angle);
  }
};

ArcticMadness.entity.Gun.prototype.m_handleShoot = function (angle) {
  var bullet = new ArcticMadness.entity.Bullet(this.x, this.y, angle);
  this.stage.addChild(bullet);
};
