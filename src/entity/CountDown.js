//--------------------------------
// Constructor scope
//--------------------------------

/**
 * Creates a new object.
 * @constructor
 * @extends rune.display.Sprite
 * @class
 *
 * Count down object.
 */

ArcticMadness.entity.CountDown = function () {
  
    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------
    
  rune.display.Sprite.call(this, 500, 100, 12, 16, "thefont");
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.entity.CountDown.prototype = Object.create(
  rune.display.Sprite.prototype
);
ArcticMadness.entity.CountDown.prototype.constructor =
  ArcticMadness.entity.CountDown;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.CountDown.prototype.init = function () {
  rune.display.Sprite.prototype.init.call(this);
  this.animation.create("3-1", [19, 18, 17], 1, false);
  this.animation.create(
    "10-1",
    [25, 24, 23, 22, 21, 20, 19, 18, 17, 16],
    1,
    false
  );

  this.animation.create("5-1", [21, 0, 0, 20, 0, 0, 19, 0, 0, 18, 0, 0, 17], 3, false);

  this.m_setPosition();
};

/**
 * This method runs every frame.
 * @returns {undefined}
 */

ArcticMadness.entity.CountDown.prototype.update = function (step) {
  rune.display.Sprite.prototype.update.call(this, step);
};

/**
 * This method disposes the object.
 * @returns {undefined}
 */

ArcticMadness.entity.CountDown.prototype.dispose = function () {
  rune.display.Sprite.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Public prototype methods
//------------------------------------------------------------------------------

/**
 * Plays the count down 3 animation.
 * @returns {undefined}
 */

ArcticMadness.entity.CountDown.prototype.playCountDown3 = function () {
  this.animation.gotoAndPlay("3-1");
};

/**
 * Plays the count down 10 animation.
 * @returns {undefined}
 */

ArcticMadness.entity.CountDown.prototype.playCountDown10 = function () {
  this.animation.gotoAndPlay("10-1");
};

//------------------------------------------------------------------------------
// Private prototype methods
//------------------------------------------------------------------------------

/**
 * Sets the position of the count down.
 * @returns {undefined}
 * @private
 */

ArcticMadness.entity.CountDown.prototype.m_setPosition = function () {
this.autosize = true;
this.scaleX = 4;
this.scaleY = 4;
this.center = this.application.screen.center;
};
