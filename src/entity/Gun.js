//--------------------------------
// Constructor scope
//--------------------------------

/**
 * Represents a gun object.
 * @constructor
 * @param {number} x The x position of the gun.
 * @param {number} y The y position of the gun.
 * @param {Object} color The color of the gun.
 * @param {Object} gamepad The gamepad object.
 * @param {ArcticMadness.entity.Player} player The player object.
 * @returns {undefined}
 * @extends {rune.display.Sprite}
 * @class
 * @public
 */

ArcticMadness.entity.Gun = function (x, y, color, gamepad, player) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.gamepad = gamepad;
  this.angle = 0;
  this.player = player;
  this.bullet = null;
  this.bullets = [];
  this.stickRightActive = false;

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
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method initializes the gun object.
 * @returns {undefined}
 */

ArcticMadness.entity.Gun.prototype.init = function () {
  rune.display.Sprite.prototype.init.call(this);
  //Moving animations
  this.animation.create("gun", [3], 10, true); //Same gun, test version
};

/**
 * This method runs every frame and is used to update game logic about the gun.
 * @param {number} step The time between the frames.
 * @returns {undefined}
 */

ArcticMadness.entity.Gun.prototype.update = function (step) {
  rune.display.Sprite.prototype.update.call(this, step);
  if (
    !this.player.isInWater &&
    this.player.isAlive &&
    !this.player.isAttacked &&
    !this.player.isRepairing
  ) {
    this.m_handleInputStickRight();
    this.m_handleButton7();
  }
  this.m_disposeBullets();
};

/**
 * This method disposes the gun object.
 * @returns {undefined}
 */

ArcticMadness.entity.Gun.prototype.dispose = function () {
  this.bullets = null;
  this.bullet = null;
  this.player = null;
  this.gamepad = null;
  this.color = null;
  rune.display.Sprite.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Private prototype methods
//------------------------------------------------------------------------------

/**
 * This method handles the stick right input.
 * @returns {undefined}
 */

ArcticMadness.entity.Gun.prototype.m_handleInputStickRight = function () {
  var currentAnimation = this.m_getPlayerCurrentAnimation();

  if (currentAnimation == "idle") {
    this.x = this.player.x + 28;
    this.y = this.player.y + 20;
  }

  if (currentAnimation == "up") {
    this.x = this.player.x + 28;
    this.y = this.player.y + 20;
  }
  if (currentAnimation == "down") {
    this.x = this.player.x + 28;
    this.y = this.player.y + 20;
  }
  if (currentAnimation == "right") {
    this.x = this.player.x + 28;
    this.y = this.player.y + 20;
    this.flippedX = false;
  }
  if (currentAnimation == "left") {
    this.x = this.player.x + 10;
    this.y = this.player.y + 20;
  }

  if (this.gamepad.stickRight.x != 0 || this.gamepad.stickRight.y != 0) {
    this.stickRightActive = true;

    var stickRightX = this.gamepad.stickRight.x;
    var stickRightY = this.gamepad.stickRight.y;

    var radian = Math.atan2(stickRightY, stickRightX);
    var angle = rune.util.Math.radiansToDegrees(radian);

    if (angle < 0) {
      angle += 360;
    }

    this.angle = angle;
    this.rotation = angle;
  } else {
    this.stickRightActive = false;
  }
};

/**
 * This method gets the current player animation.
 * @returns {string}
 */

ArcticMadness.entity.Gun.prototype.m_getPlayerCurrentAnimation = function () {
  if (this.player.animation.current.name == "up") {
    return "up";
  }
  if (this.player.animation.current.name == "down") {
    return "down";
  }
  if (
    this.player.animation.current.name == "walk" &&
    this.player.flippedX == false
  ) {
    return "right";
  }
  if (
    this.player.animation.current.name == "walk" &&
    this.player.flippedX == true
  ) {
    return "left";
  } else {
    return "idle";
  }
};

/**
 * This method handles the button 7 input. Button 7 is the shoot button.
 * @returns {undefined}
 */

ArcticMadness.entity.Gun.prototype.m_handleButton7 = function () {
  if (this.gamepad.justPressed(7)) {
    this.m_handleShoot(this.angle);
  }
};

/**
 * This method handles the shoot.
 * @param {number} angle The angle of the shot.
 * @returns {undefined}
 */

ArcticMadness.entity.Gun.prototype.m_handleShoot = function (angle) {
  this.bullet = new ArcticMadness.entity.Bullet(
    this.x,
    this.y,
    this.color,
    angle
  );
  this.bullets.push(this.bullet);
  this.stage.addChild(this.bullet);
  this.shootSound = this.application.sounds.sound.get("shoot");
  this.shootSound.play();
  this.shootSound.loop = false;
};

/**
 * This method disposes the bullets that are out of the screen.
 * @returns {undefined}
 */

ArcticMadness.entity.Gun.prototype.m_disposeBullets = function () {
  if (this.bullets.length > 0) {
    for (var i = 0; i < this.bullets.length; i++) {
      if (
        this.bullets[i].x < 0 ||
        this.bullets[i].x > this.application.screen.width ||
        this.bullets[i].y < 0 ||
        this.bullets[i].y > this.application.screen.height
      ) {
        this.stage.removeChild(this.bullets[i], true);
        this.bullets.splice(i, 1);
      }
    }
  }
};
