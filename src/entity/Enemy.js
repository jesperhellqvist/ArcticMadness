//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.Enemy = function (x, y, player) {
  this.x = x;
  this.y = y;
  this.player = player; // Reference to the player object.
  this.playerPositionX = this.player.x;
  this.playerPositionY = this.player.y;

  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  /**
   * Calls the constructor method of the super class.
   */
  rune.display.Sprite.call(this, this.x, this.y, 64, 64, "enemiestest");
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
  this.animation.create("walk", [0], 8, true);
};

// This is the update method, which is called every frame.

ArcticMadness.entity.Enemy.prototype.update = function (step) {
  rune.display.Sprite.prototype.update.call(this, step);
    this.m_followPlayer();
};

// This is the dispose method, which is called when the object is removed.

ArcticMadness.entity.Enemy.prototype.dispose = function () {
    rune.display.Sprite.prototype.dispose.call(this);
    };

//------------------------------------------------------------------------------
// Private prototype methods
//------------------------------------------------------------------------------

// This method makes the enemy follow the player.

ArcticMadness.entity.Enemy.prototype.m_followPlayer = function () {
    this.playerPositionX = this.player.x;
    this.playerPositionY = this.player.y;

    if (this.x < this.playerPositionX) {
        this.x += 1;
    } else if (this.x > this.playerPositionX) {
        this.x -= 1;
    }
    if (this.y < this.playerPositionY) {
        this.y += 1;
    } else if (this.y > this.playerPositionY) {
        this.y -= 1;
    }
}
