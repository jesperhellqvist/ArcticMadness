//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.Bullet = function (x, y, color, angle) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.angle = angle;

  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  /**
   * Calls the constructor method of the super class.
   */
  rune.display.Sprite.call(this, this.x, this.y, 30, 20, "fish");
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.entity.Bullet.prototype = Object.create(
  rune.display.Sprite.prototype
);
ArcticMadness.entity.Bullet.prototype.constructor = ArcticMadness.entity.Bullet;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated.
 * The method is used to create objects to be used within the scene.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Bullet.prototype.init = function () {
  rune.display.Sprite.prototype.init.call(this);
  this.texture.replaceColor(
    new rune.color.Color24(133, 144, 255),
    new rune.color.Color24(this.color.r, this.color.g, this.color.b)
  );
  this.m_setPhysics();
};

/**
 * This method is used to update the object.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Bullet.prototype.update = function (step) {
  rune.display.Sprite.prototype.update.call(this, step);
  this.m_shoot(this.angle);
};

/**
 * This method is used to dispose the object.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Bullet.prototype.dispose = function () {
  this.color = null;
  rune.display.Sprite.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Private prototype methods
//------------------------------------------------------------------------------

/**
 * Fire the bullet in the given angle.
 *
 * @param {number} angle The angle of the bullet.
 * @returns {undefined}
 */

ArcticMadness.entity.Bullet.prototype.m_shoot = function (angle) {
  var radian = rune.util.Math.degreesToRadians(angle);
  var speed = 10;
  this.flippedX = true;
  this.flippedY = true;
  this.rotation = angle;
  this.velocity.x = rune.util.Math.cos(radian) * speed;
  this.velocity.y = rune.util.Math.sin(radian) * speed;
};

/**
 * Set the physics of the bullet.
 *
 * @returns {undefined}
 */

ArcticMadness.entity.Bullet.prototype.m_setPhysics = function () {
  this.velocity.drag.x = 0.05;
  this.velocity.drag.y = 0.05;
};
