
//--------------------------------
// Constructor scope
//--------------------------------



ArcticMadness.entity.Player = function (x, y, pinguin, controls) {

    this.health = 100; // Player health
    this.controls = controls; // Player controls on keyboard
    this.x = x; // Player x position
    this.y = y; // Player y position   
    //this.topSpeed = 3; // Player top speed



    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------

    /**
    * Calls the constructor method of the super class.
    */
    rune.display.Sprite.call(this, x, y, 64, 64, pinguin);
};

//--------------------------------------------------------------------------
// Inheritance
//--------------------------------------------------------------------------

ArcticMadness.entity.Player.prototype = Object.create(rune.display.Sprite.prototype);
ArcticMadness.entity.Player.prototype.constructor = ArcticMadness.entity.Player;

//--------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//--------------------------------------------------------------------------

ArcticMadness.entity.Player.prototype.init = function () {
    rune.display.Sprite.prototype.init.call(this);

    this.animation.create("idle", [0, 1], 8, true);
    this.animation.create("walk", [4, 5, 6, 7], 10, true);
    this.m_setPhysics();
};

ArcticMadness.entity.Player.prototype.update = function (step) {
    rune.display.Sprite.prototype.update.call(this, step);

    if(this.isJumping) {
        this.y += this.velocity.y;
        this.velocity.y += 1;
    }

    if(this.y <= this.y){
        this.isJumping = false;
    }
    
    
     

    this.m_handleInput(this.controls);
    this.m_handleHitBox();


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
            this.animation.gotoAndPlay("walk");
        }
    }
    if (this.keyboard.pressed(controls.right)) {
        if (this.x >= 925) {
            this.x = 925;
        } else {
            this.x += 5;
            this.velocity.x += 0.15;
            this.flippedX = false;
            this.animation.gotoAndPlay("walk");
        }
    }
    if (this.keyboard.pressed(controls.up)) {
        if (this.y <= 0) {
            this.y = 0;
        } else {
            this.y -= 5;
            this.velocity.y -= 0.15;
            this.animation.gotoAndPlay("walk");
        }
    }
    if (this.keyboard.pressed(controls.down)) {
        if (this.y >= 505) {
            this.y = 505;
        } else {
            this.y += 5;
            this.velocity.y += 0.15;
            this.animation.gotoAndPlay("walk");
        }
    }
    if (this.keyboard.justPressed(controls.jump) && !this.isJumping) {
        
        
        this.velocity.y = -10;

        this.isJumping = true;
        this.animation.gotoAndPlay("walk");
    }
    if (!this.keyboard.pressed(controls.left) && !this.keyboard.pressed(controls.right) && !this.keyboard.pressed(controls.up) && !this.keyboard.pressed(controls.down) && !this.keyboard.pressed(controls.jump)) {
        this.animation.gotoAndPlay("idle");
    }
};

ArcticMadness.entity.Player.prototype.m_setPhysics = function () {
    this.velocity.drag.x = 0.05;
    this.velocity.drag.y = 0.05;
    this.velocity.max.y = 1.8;
    this.velocity.max.x = 1.8;
};

ArcticMadness.entity.Player.prototype.m_handleHitBox = function () {
    this.hitbox.set();
    this.debug = true;
    this.debugColor = "#FF0000";
};
