//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.Enemy = function (x, y, player, map, game) {
  this.x = x;
  this.y = y;
  this.player = player; // Reference to the player object.
  this.playerPositionX = this.player.x;
  this.playerPositionY = this.player.y;
  this.map = map; // Reference to the map object.
  this.game = game; // Reference to the game object.

  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  /**
   * Calls the constructor method of the super class.
   */
  rune.display.Sprite.call(this, this.x, this.y, 64, 64, "64_enemy_lepardseal");
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.entity.Enemy.prototype = Object.create(
  rune.display.Sprite.prototype
);
ArcticMadness.entity.Enemy.prototype.constructor = ArcticMadness.entity.Enemy;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

// This is the init method, which is called when the object is created.

ArcticMadness.entity.Enemy.prototype.init = function () {
  rune.display.Sprite.prototype.init.call(this);
  this.animation.create("walk", [0, 1, 2, 3], 5, true);
  this.animation.create("water", [4], 1, true);
};

// This is the update method, which is called every frame.

ArcticMadness.entity.Enemy.prototype.update = function (step) {
  rune.display.Sprite.prototype.update.call(this, step);
  this.m_followPlayer();
  if (this.player.isAlive && !this.player.isInWater) {
    this.m_checkPlayerCollision();
  }
};

// This is the dispose method, which is called when the object is removed.

ArcticMadness.entity.Enemy.prototype.dispose = function () {
  rune.display.Sprite.prototype.dispose.call(this);
  console.log("Enemy disposed");
};

//------------------------------------------------------------------------------
// Private prototype methods
//------------------------------------------------------------------------------

// This method makes the enemy follow the player.

ArcticMadness.entity.Enemy.prototype.m_followPlayer = function () {
  this.playerPositionX = this.player.x;
  this.playerPositionY = this.player.y;

  var centerX = this.application.screen.width / 2; 
  var centerY = this.application.screen.width / 2;

  if (this.player.isInWater) {
    if (this.x < centerX) {
      this.x += 2;
      this.flippedX = false;
      this.animation.gotoAndPlay("walk");
    }
    if (this.x > centerX) {
      this.x -= 2;
      this.flippedX = true;
    }
    if (this.y < centerY) {
      this.y += 2;
    }
    if (this.y > centerY) {
      this.y -= 2;
    }
    
  }

  if (!this.player.isInWater) {
    if (this.x < this.playerPositionX) {
      this.x += 2;
      this.flippedX = false;
      this.animation.gotoAndPlay("walk");
    } else if (this.x > this.playerPositionX) {
      this.x -= 2;
      this.flippedX = true;
      this.animation.gotoAndPlay("walk");
    }
    if (this.y < this.playerPositionY) {
      this.y += 2;
      
    } else if (this.y > this.playerPositionY) {
      this.y -= 2;
    }
    if(this.y == this.playerPositionY) {
      this.flippedX = false;
    }
  }
};

// This method checks for collision with the player.

ArcticMadness.entity.Enemy.prototype.m_checkPlayerCollision = function () {
  if (this.hitTestObject(this.player)) {
    this.player.isAttacked = true;
    this.player.health -= 1;
    this.player.gun.alpha = 0;
    this.animation.gotoAndPlay("water");
    this.player.animation.gotoAndPlay("dragy");
    this.m_getNearestWater(this.player.x, this.player.y);
  }
};

// This method gets the nearest water tile.

ArcticMadness.entity.Enemy.prototype.m_getNearestWater = function (x, y) {
  var topLeft = this.application.screen.width / 2;
  var topRight = this.application.screen.width;
  var bottomLeft = this.application.screen.height / 2;
  var bottomRight = this.application.screen.height;

  console.log(topLeft, topRight, bottomLeft, bottomRight);

  if (x < topLeft && y < bottomLeft) {
    this.player.x -= 1;
    this.player.y -= 4;
    this.x -= 1;
    this.y -= 4;
  }
  if (x < topLeft && y > bottomLeft) {
    this.player.x -= 1;
    this.player.y += 4;
    this.x -= 1;
    this.y += 4;
  }
  if (x > topLeft && y < bottomLeft) {
    this.player.x += 1;
    this.player.y -= 4;
    this.x += 1;
    this.y -= 4;
  }
  if (x > topLeft && y > bottomLeft) {
    this.player.x += 1;
    this.player.y += 4;
    this.x += 1;
    this.y += 4;
  }
};
