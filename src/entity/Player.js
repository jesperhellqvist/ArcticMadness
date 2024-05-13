//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.Player = function (
  x,
  y,
  penguin,
  color,
  controls,
  gamepad,
  id
) {
  this.health = 250; // Player health
  this.controls = controls; // Player controls on keyboard
  this.x = x; // Player x position
  this.y = y; // Player y position
  this.angle = 0; // Player angle
  this.gamepad = gamepad; // Player gamepad
  this.enemies = null; // Player enemy
  this.color = color; // Player color
  this.gun = null; // Reference to the gun object
  this.isInWater = false; // Player is in water
  this.isRepairing = false; // Player is repairing ice
  this.isAlive = true; // Player is alive
  this.isAttacked = false; // Player is attacked
  this.diagonalMovement = false;
  this.falling = false;
  this.id = id; // Player id
  this.animationBlock = null;
  this.inWaterTile = null; // Index of the tile the player is in
  this.isRevivable = false; // Player is revivable
  this.revivingTileSet = false; 
  //console.log(this.enemies); // Just nu null

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

  //Moving animations
  this.animation.create("idle", [0, 1, 2, 3], 8, true);
  this.animation.create("walk", [5, 6, 7, 8], 10, true);
  this.animation.create("down", [10, 11, 12, 13, 14], 10, true);
  this.animation.create("up", [15, 16, 17, 18], 10, true);
  //Looking animations, standing still, different directions
  this.animation.create("lookup", [15], 10, true);
  this.animation.create("lookdown", [10], 10, true);
  this.animation.create("lookside", [5, 9], 10, true); //test for idle when looking sideways
  //Action animations

  this.animation.create("repair", [20, 21, 22, 23], 8, true);
  //Water animations
  this.animation.create("falling", [25, 26, 27, 28, 29], 9, true);
  this.animation.create("drown", [30, 31], 8, true);
  this.animation.create("death", [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 40, 41, 42, 43], 8, false);
  //Attacked animation, injured
  this.animation.create("dragy", [45, 46], 4, true);
  this.animation.create("dragx", [47, 48], 4, true);
  this.m_createGun(this.enemies);
  this.m_setPhysics();
};

ArcticMadness.entity.Player.prototype.update = function (step) {
  rune.display.Sprite.prototype.update.call(this, step);

  //this.m_checkPlayerHealth();

  if (!this.isInWater && this.isAlive && !this.isAttacked && !this.isRepairing) {
    //this.m_handleInput(this.controls);
    this.m_handleInputGamepad();
    this.m_setGunPosition();
    this.m_handleHitBox();
  }

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
    //this.animation.gotoAndPlay("idle");
  }
};

ArcticMadness.entity.Player.prototype.m_handleInputGamepad = function () {
  

  if (this.gamepad.stickLeftLeft && this.gamepad.stickLeftUp || this.gamepad.stickLeftLeft && this.gamepad.stickLeftDown || this.gamepad.stickLeftRight && this.gamepad.stickLeftUp || this.gamepad.stickLeftRight && this.gamepad.stickLeftDown) {
    this.diagonalMovement = true;
  }

  var speed = this.diagonalMovement ? 3 / Math.sqrt(2) : 3; // Normalisera hastigheten för diagonala rörelser
  var velocityChange = this.diagonalMovement ? 0.15 / Math.sqrt(2) : 0.15; // Normalisera velocityn för diagonala rörelser

  if (this.gamepad.stickLeftLeft) {
    if (this.x <= 0) {
      this.x = 0;
    } else {
      this.x -= speed;
      this.velocity.x -= velocityChange;
      this.flippedX = true;
      this.diagonalMovement = false;
      this.animation.gotoAndPlay("walk");
      if(this.gamepad.stickRightRight){
        this.flippedX = false;
      }
    }
  }

  if (this.gamepad.stickLeftRight) {
    if (this.x >= 1250) {
      this.x = 1250;
    } else {
      this.x += speed;
      this.velocity.x += velocityChange;
      this.flippedX = false;
      this.diagonalMovement = false;
      this.animation.gotoAndPlay("walk");
    }
  }

  if (this.gamepad.stickLeftUp) {
    if (this.y <= 0) {
      this.y = 0;
    } else {
      this.y -= speed;
      this.velocity.y -= velocityChange;
      this.flippedX = false;
      this.diagonalMovement = false;
      this.animation.gotoAndPlay("up");
    }
  }

  if (this.gamepad.stickLeftDown) {
    if (this.y >= 700) {
      this.y = 700;
    } else {
      this.y += speed;
      this.velocity.y += velocityChange;
      this.flippedX = false;
      this.diagonalMovement = false;
      this.animation.gotoAndPlay("down");
    }
  }
};

ArcticMadness.entity.Player.prototype.m_createGun = function (enemies) {
  this.gun = new ArcticMadness.entity.Gun(
    this.x,
    this.y,
    this.color,
    this.gamepad,
    enemies,
    this
  );
  this.stage.addChild(this.gun);
};

ArcticMadness.entity.Player.prototype.m_setGunPosition = function () {
  this.gun.x = this.x + 26;
  this.gun.y = this.y + 20;

  if (this.gamepad.stickRightLeft) {
    this.gun.x = this.x + 10;
    this.gun.y = this.y + 20;
  }
  if (this.gamepad.stickRightRight) {
    this.gun.x = this.x + 26;
    this.gun.y = this.y + 20;
  }
  if (this.gamepad.stickRightUp) {
    this.gun.x = this.x + 26;
    this.gun.y = this.y + 10;
  }
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
this.hitbox.set(16, 8, 32, 46);
   this.hitbox.debug = false;
   
};

// ArcticMadness.entity.Player.prototype.m_checkPlayerHealth = function () {
//   if (this.health <= 0) {
//     this.isAlive = false;
//     this.animation.gotoAndPlay("death");
//   }
// };
