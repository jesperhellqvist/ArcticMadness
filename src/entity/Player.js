
//--------------------------------
// Constructor scope
//--------------------------------



ArcticMadness.entity.Player = function(x, y, pinguin) {

        this.health = 100; // Player health
        
    
        //--------------------------------------------------------------------------
        // Super call
        //--------------------------------------------------------------------------
        
        /**
        * Calls the constructor method of the super class.
        */
        rune.display.Sprite.call(this, x, y, 32, 32, pinguin);
    };

    //--------------------------------------------------------------------------
    // Inheritance
    //--------------------------------------------------------------------------

    ArcticMadness.entity.Player.prototype = Object.create(rune.display.Sprite.prototype);
    ArcticMadness.entity.Player.prototype.constructor = ArcticMadness.entity.Player;

    //--------------------------------------------------------------------------
    // Override public prototype methods (ENGINE)
    //--------------------------------------------------------------------------

    ArcticMadness.entity.Player.prototype.init = function() {
        rune.display.Sprite.prototype.init.call(this);

        this.animation.create("idle", [0, 1], 8, true);
        this.animation.create("walk", [4, 5, 6, 7], 10, true);
    };

    ArcticMadness.entity.Player.prototype.update = function(step) {
        rune.display.Sprite.prototype.update.call(this, step);
        this.m_handleInput();
        this.m_handleHitBox();
    };

    ArcticMadness.entity.Player.prototype.dispose = function() {
        rune.display.Sprite.prototype.dispose.call(this);
    };

    //--------------------------------------------------------------------------
    // Private methods
    //--------------------------------------------------------------------------

    ArcticMadness.entity.Player.prototype.m_handleInput = function() {
        if(this.keyboard.pressed("A")) {
            if(this.x <= 0){
                this.x = 0;
                return;
            }
            this.x -= 5;
            this.flippedX = true;
            this.animation.gotoAndPlay("walk");
        }
       else if(this.keyboard.pressed("D")) {
            if(this.x >= 925){
                this.x = 925;
                return;
            }
            this.x += 5;
            this.flippedX = false;
            this.animation.gotoAndPlay("walk");
            
        }
       else if(this.keyboard.pressed("W")) {
            if(this.y <= 0){
                this.y = 0;
                return;
            }

            this.y -= 5;
            this.animation.gotoAndPlay("walk");
          
    
        }
       else if(this.keyboard.pressed("S")) {
            if(this.y >= 505){
                this.y = 505;
                return;
            }
            this.y += 5;
            this.animation.gotoAndPlay("walk");
           
        }
        else {
            this.animation.gotoAndPlay("idle");
        }
    };

    ArcticMadness.entity.Player.prototype.m_handleHitBox = function() {
       this.hitbox.set();
       this.debug = true;
       this.debugColor = "#FF0000";
    };
