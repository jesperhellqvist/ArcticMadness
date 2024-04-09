//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.Bullet = function (x, y, angle) {
  this.x = x;
  this.y = y;
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

ArcticMadness.entity.Bullet.prototype.init = function () {
  rune.display.Sprite.prototype.init.call(this);
  this.m_setPhysics();
};

ArcticMadness.entity.Bullet.prototype.update = function (step) {
  rune.display.Sprite.prototype.update.call(this, step);

  this.shoot(this.angle);
  this.m_handleHitBox();
};

ArcticMadness.entity.Bullet.prototype.dispose = function () {
  rune.display.Sprite.prototype.dispose.call(this);
  console.log("Bullet disposed");
};

ArcticMadness.entity.Bullet.prototype.shoot = function (angle) {
    
  if (angle == 0) {
    this.rotation = 90;
    this.y -= 30;
  } else if (angle == 90) {
    this.rotation = 180;
    this.x += 30;
  } else if (angle == 180) {
    this.rotation = 270;
    this.y += 30;
  } else if (angle == 270) {
    this.rotation = 0;
    this.x -= 30;
  }


};

//------------------------------------------------------------------------------
// Private methods
//------------------------------------------------------------------------------

ArcticMadness.entity.Bullet.prototype.m_setPhysics = function () {
  this.velocity.drag.x = 0.05;
  this.velocity.drag.y = 0.05;
}; 

ArcticMadness.entity.Bullet.prototype.m_handleHitBox = function () {
    this.hitbox.set();
    this.debug = true;
    this.debugColor = "#das ";


  if (this.x >= this.application.screen.width || this.y >= this.application.screen.height || this.x <= 0 || this.y <= 0) {
    this.parent.removeChild(this, true);
  }
};
