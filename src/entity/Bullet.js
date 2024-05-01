//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.Bullet = function (x, y, color, angle, enemies) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.angle = angle;
  this.enemies = enemies;

  //console.log(this.enemies); // Just nu null

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
  this.texture.replaceColor(
    new rune.color.Color24(133,144,255),
    new rune.color.Color24(this.color.r,this.color.g,this.color.b)
  );
  this.animation.create("idle", [0], 8, true);
  this.animation.gotoAndPlay("idle");
  this.animation.create("hit", [2], 10, true);
  this.m_setPhysics();
};

ArcticMadness.entity.Bullet.prototype.update = function (step) {
  rune.display.Sprite.prototype.update.call(this, step);

  this.m_shoot(this.angle);
  //this.m_handleHitBox(this.enemies);
};

ArcticMadness.entity.Bullet.prototype.dispose = function () {
  rune.display.Sprite.prototype.dispose.call(this);
  console.log("Bullet disposed");
};

ArcticMadness.entity.Bullet.prototype.m_shoot = function (angle) {
  var radian = rune.util.Math.degreesToRadians(angle);
  var speed = 10;
  this.flippedX = true;
  this.flippedY = true;
  this.rotation = angle;

  this.velocity.x = rune.util.Math.cos(radian) * speed;
  this.velocity.y = rune.util.Math.sin(radian) * speed;
};

//------------------------------------------------------------------------------
// Private methods
//------------------------------------------------------------------------------

// Function to set the physics of the bullet

ArcticMadness.entity.Bullet.prototype.m_setPhysics = function () {
  this.velocity.drag.x = 0.05;
  this.velocity.drag.y = 0.05;
};

// Function to handle the hitbox of the bullet and check if it hits the enemy

// ArcticMadness.entity.Bullet.prototype.m_handleHitBox = function () {
//   this.debug = true;
//   this.debugColor = "#FF0000";

//   if (this.hitTestObject(this.enemies)) {  // If the bullet hits the enemy, the enemy and the bullet are disposed
//     this.animation.gotoAndPlay("hit");
//     console.log("hit");
//     this.parent.removeChild(this.enemies, true);
//     this.parent.removeChild(this, true);
//   }

//   if ( // If the bullet is out of the screen, it is disposed
//     this.x >= this.application.screen.width ||
//     this.y >= this.application.screen.height ||
//     this.x <= 0 ||
//     this.y <= 0
//   ) {
//     this.parent.removeChild(this, true);
//   }
// };
