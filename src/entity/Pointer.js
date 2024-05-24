//--------------------------------
// Constructor scope
//--------------------------------

/**
 * This class represents the pointer entity.
 * @class
 * @extends {rune.display.Graphic}
 * @constructor
 */

ArcticMadness.entity.Pointer = function () {
  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  rune.display.Graphic.call(this, 0, 0, 30, 20, "fish");
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.entity.Pointer.prototype = Object.create(
  rune.display.Graphic.prototype
);
ArcticMadness.entity.Pointer.prototype.constructor =
  ArcticMadness.entity.Pointer;

//------------------------------------------------------------------------------
// Override public prototype methods
//------------------------------------------------------------------------------

/**
 * This method initializes the pointer entity.
 * @returns {undefined}
 * @public
 */

ArcticMadness.entity.Pointer.prototype.init = function () {
  rune.display.Graphic.prototype.init.call(this);
  this.flippedX = true;
  this.m_initTexture();
};

/**
 * This method disposes the pointer entity.
 * @returns {undefined}
 * @public
 */

ArcticMadness.entity.Pointer.prototype.dispose = function () {
  this.texture.dispose();
  rune.display.Graphic.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Private prototype methods
//------------------------------------------------------------------------------

/**
 * This method initializes the pointer entity texture.
 * @returns {undefined}
 * @private
 */

ArcticMadness.entity.Pointer.prototype.m_initTexture = function () {
  this.texture.replaceColor(
    new rune.color.Color24(133, 144, 255),
    new rune.color.Color24(255, 0, 0)
  );
};
