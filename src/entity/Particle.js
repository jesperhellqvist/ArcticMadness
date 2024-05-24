//--------------------------------
// Constructor scope
//--------------------------------

/**
 * Creates a new instance of the Particle class.
 * @constructor
 * @returns {undefined}
 * @extends {rune.display.Sprite}
 * @class
 * @public
 */

ArcticMadness.entity.Particle = function () {
  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  rune.display.Sprite.call(this, 0, 0, 30, 20, "fish");
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.entity.Particle.prototype = Object.create(
  rune.display.Sprite.prototype
);
ArcticMadness.entity.Particle.prototype.constructor =
  ArcticMadness.entity.Particle;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated.
 * @returns {undefined}
 * @public
 */

ArcticMadness.entity.Particle.prototype.init = function () {
  rune.display.Sprite.prototype.init.call(this);
  this.m_initTexture();
};

/**
 * Dispose the object
 * @returns {undefined}
 * @public
 */

ArcticMadness.entity.Particle.prototype.dispose = function () {
  this.texture.dispose();
  rune.display.Sprite.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Private prototype methods
//------------------------------------------------------------------------------

/**
 * Initialize the texture
 * @returns {undefined}
 * @private
 */

ArcticMadness.entity.Particle.prototype.m_initTexture = function () {
  this.texture.replaceColor(
    new rune.color.Color24(133, 144, 255),
    new rune.color.Color24(
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255
    )
  );
};
