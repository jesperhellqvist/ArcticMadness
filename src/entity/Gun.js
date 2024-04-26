//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.Gun = function (x, y, color, gamepad, enemy, player) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.gamepad = gamepad;
  this.angle = 0;
  this.enemy = enemy;
  this.player = player;
  console.log(this.enemy);

  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  /**
   * Calls the constructor method of the super class.
   */
  rune.display.Sprite.call(this, this.x, this.y, 32, 32, "gun_directions2");
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
  //Moving animations
  this.animation.create("gun", [3], 10, true); //Same gun, test version
};

ArcticMadness.entity.Gun.prototype.update = function (step) {
  rune.display.Sprite.prototype.update.call(this, step);
  if (!this.player.isInWater && this.player.isAlive && !this.player.isAttacked) {
    this.m_handleInputStickRight();
    this.m_handleButton7();
  }
};

ArcticMadness.entity.Gun.prototype.dispose = function () {
  rune.display.Sprite.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Private prototype methods
//------------------------------------------------------------------------------

// This method creates the gun object and adds it to the stage.

ArcticMadness.entity.Gun.prototype.m_handleInputStickRight = function () {
  var stickRightX = this.gamepad.stickRight.x;
  var stickRightY = this.gamepad.stickRight.y;

  var radian = Math.atan2(stickRightY, stickRightX);
  var angle = rune.util.Math.radiansToDegrees(radian);

  if (angle < 0) {
    angle += 360;
  }

  //Right
  if ((angle < 45 && angle > 0 ) || (angle > 315 && angle < 360)) { // NOTERA 0 = idle
    this.flippedX = false;
    this.player.flippedX = false;
    this.x = this.player.x + 26;
    this.y = this.player.y + 20;
    this.player.animation.gotoAndPlay("lookside");
    this.animation.gotoAndPlay("gun");
  }

  //Down
  if (angle > 45 && angle < 135) {
    this.player.animation.gotoAndPlay("lookdown");
    this.animation.gotoAndPlay("gun");
  }
  //Left
  if (angle > 135 && angle < 225) {
    this.player.flippedX = true;
    this.x = this.player.x + 10;
    this.y = this.player.y + 20;
    this.player.animation.gotoAndPlay("lookside");
    this.animation.gotoAndPlay("gun");
  }
  //Up
  if (angle > 225 && angle < 315) {
    this.x = this.player.x + 16;
    this.y = this.player.y + 10;
    this.player.animation.gotoAndPlay("lookup");
    this.animation.gotoAndPlay("gun");
    if (this.gamepad.stickLeftUp) {
      this.player.animation.gotoAndPlay("up");
    }
  }

  this.angle = angle;
  this.rotation = angle;
};

// This method handles the shoot button.

ArcticMadness.entity.Gun.prototype.m_handleButton7 = function () {
  if (this.gamepad.justPressed(7)) {
    this.m_handleShoot(this.angle);
  }
};

// This method handles the shoot. It creates a bullet and adds it to the stage.
ArcticMadness.entity.Gun.prototype.m_handleShoot = function (angle) {
  var bullet = new ArcticMadness.entity.Bullet(
    this.x,
    this.y,
    this.color,
    angle,
    this.enemy
  );
  this.stage.addChild(bullet);
};
