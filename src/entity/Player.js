//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.Player = function (x, y, penguin, color, controls, gamepad) {
  this.health = 100; // Player health
  this.controls = controls; // Player controls on keyboard
  this.x = x; // Player x position
  this.y = y; // Player y position
  this.angle = 0; // Player angle
  this.gamepad = gamepad; // Player gamepad
  this.enemy = null; // Reference to the enemy object
  this.color = color; // Player color

  //this.topSpeed = 3; // Player top speed

  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  /**
   * Calls the constructor method of the super class.
   */
  rune.display.Sprite.call(this, this.x, this.y, 64, 64, penguin);
};

//--------------------------------------------------------------------------
// Inheritance
//--------------------------------------------------------------------------

ArcticMadness.entity.Player.prototype = Object.create(
  rune.display.Sprite.prototype
);
ArcticMadness.entity.Player.prototype.constructor = ArcticMadness.entity.Player;

//--------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//--------------------------------------------------------------------------

ArcticMadness.entity.Player.prototype.init = function () {
  rune.display.Sprite.prototype.init.call(this);
  this.texture.replaceColor(
    new rune.color.Color24(133, 144, 255),
    new rune.color.Color24(this.color.r, this.color.g, this.color.b)
  );
  // this.animation.create("idle", [0, 1, 2, 3], 8, true);
  // this.animation.create("walk", [5, 6, 7, 8], 10, true);
  // this.animation.create("down", [10, 11, 12, 13, 14], 10, true);
  // this.animation.create("up", [15, 16, 17,18], 10, true);
  this.m_createGun(this.enemy);
  this.m_setPhysics();
};

ArcticMadness.entity.Player.prototype.update = function (step) {
  rune.display.Sprite.prototype.update.call(this, step);
  //this.m_handleInput(this.controls);
  this.m_handleInputGamepad();
  // this.m_handleRightStick();
  // this.m_handleButton7();
  this.m_setGunPosition();
  this.m_handleHitBox();
};

ArcticMadness.entity.Player.prototype.hitTestEnemy = function (enemy) {
  this.enemy = enemy;
};

ArcticMadness.entity.Player.prototype.dispose = function () {
  rune.display.Sprite.prototype.dispose.call(this);
};

//--------------------------------------------------------------------------
// Private methods
//--------------------------------------------------------------------------

ArcticMadness.entity.Player.prototype.m_handleInput = function (controls) {
  if (this.keyboard.pressed(controls.left)) {
    if (this.x <= 0) {
      this.x = 0;
    } else {
      this.x -= 5;
      this.velocity.x -= 0.15;
      this.flippedX = true;
      this.angle = 270;
      this.animation.gotoAndPlay("walk");
    }
  }
  if (this.keyboard.pressed(controls.right)) {
    if (this.x >= 1250) {
      this.x = 1250;
    } else {
      this.x += 5;
      this.velocity.x += 0.15;
      this.flippedX = false;
      this.angle = 90;
      this.animation.gotoAndPlay("walk");
    }
  }
  if (this.keyboard.pressed(controls.up)) {
    if (this.y <= 0) {
      this.y = 0;
    } else {
      this.y -= 5;
      this.velocity.y -= 0.15;
      this.angle = 0;
      this.animation.gotoAndPlay("up");
    }
  }
  if (this.keyboard.pressed(controls.down)) {
    if (this.y >= 700) {
      this.y = 700;
    } else {
      this.y += 5;
      this.velocity.y += 0.15;
      this.angle = 180;
      this.animation.gotoAndPlay("down");
    }
  }

  if (this.keyboard.justPressed(controls.shoot)) {
    console.log("shoot");
  }

  if (
    !this.keyboard.pressed(controls.left) &&
    !this.keyboard.pressed(controls.right) &&
    !this.keyboard.pressed(controls.up) &&
    !this.keyboard.pressed(controls.down)
  ) {
    this.flippedX = false;
    this.animation.gotoAndPlay("idle");
  }
};

ArcticMadness.entity.Player.prototype.m_handleInputGamepad = function () {
  if (this.gamepad.stickLeftLeft) {
    if (this.x <= 0) {
      this.x = 0;
    } else {
      this.x -= 3;
      this.velocity.x -= 0.15;
      // this.flippedX = false;
    }
  }

  if (this.gamepad.stickLeftRight) {
    if (this.x >= 1250) {
      this.x = 1250;
    } else {
      this.x += 3;
      this.velocity.x += 0.15;
      // this.flippedX = false;
    }
  }

  if (this.gamepad.stickLeftUp) {
    if (this.y <= 0) {
      this.y = 0;
    } else {
      this.y -= 3;
      this.velocity.y -= 0.15;
      // this.flippedX = false;
    }
  }

  if (this.gamepad.stickLeftDown) {
    if (this.y >= 700) {
      this.y = 700;
    } else {
      this.y += 3;
      this.velocity.y += 0.15;
      // this.flippedX = false;
    }
  }
};

ArcticMadness.entity.Player.prototype.m_createGun = function (enemy) {
  this.gun = new ArcticMadness.entity.Gun(
    this.x,
    this.y,
    this.color,
    this.gamepad,
    enemy,
    this
  );
  this.stage.addChild(this.gun);
};

ArcticMadness.entity.Player.prototype.m_setGunPosition = function () {
  this.gun.x = this.x + 26;
  this.gun.y = this.y + 20;

  // if (this.gamepad.stickRightLeft) {
  //   this.gun.x = this.x + 10;
  //   this.gun.y = this.y + 20;
  // }
  // if (this.gamepad.stickRightRight) {
  //   this.gun.x = this.x + 26;
  //   this.gun.y = this.y + 20;
  // }
  // if (this.gamepad.stickRightUp) {
  //   this.gun.x = this.x + 26;
  //   this.gun.y = this.y + 10;
  // }
};

ArcticMadness.entity.Player.prototype.m_setPhysics = function () {
  this.velocity.drag.x = 0.04;
  this.velocity.drag.y = 0.04;
  this.velocity.max.y = 2.5;
  this.velocity.max.x = 2.5;
};

ArcticMadness.entity.Player.prototype.m_handleHitBox = function () {
  // if (this.hitTestObject(this.enemy)) {
  // }

  this.debug = true;
  this.debugColor = "#FF0000";
};
