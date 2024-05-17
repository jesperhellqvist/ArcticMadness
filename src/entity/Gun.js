//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.Gun = function (x, y, color, gamepad, enemies, player) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.gamepad = gamepad;
  this.angle = 0;
  this.enemies = enemies;
  this.player = player;
  this.bullet = null;
  this.bullets = [];
  //console.log(this.enemies); // Just nu null

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
  if (
    !this.player.isInWater &&
    this.player.isAlive &&
    !this.player.isAttacked &&
    !this.player.isRepairing
  ) {
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

 

 

  this.angle = angle;
  this.rotation = angle;
};

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
  }
  else {
    return "idle";
  }
};

// This method handles the shoot button.

ArcticMadness.entity.Gun.prototype.m_handleButton7 = function () {
  if (this.gamepad.justPressed(7)) {
    this.m_handleShoot(this.angle);
  }
};

// This method handles the shoot. It creates a bullet and adds it to the stage.
ArcticMadness.entity.Gun.prototype.m_handleShoot = function (angle) {
  this.bullet = new ArcticMadness.entity.Bullet(
    this.x,
    this.y,
    this.color,
    angle,
    this.enemies
  );
  this.bullets.push(this.bullet);
  this.stage.addChild(this.bullet);
  this.shootSound = this.application.sounds.sound.get(
    "shoot",
    (unique = false)
  );
  this.shootSound.play();
  this.shootSound.loop = false;
};
