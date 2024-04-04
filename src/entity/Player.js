
//--------------------------------
// Constructor scope
//--------------------------------



ArcticMadness.entity.Player = function() {

        this.health = 100; // Player health
        
    
        //--------------------------------------------------------------------------
        // Super call
        //--------------------------------------------------------------------------
        
        /**
        * Calls the constructor method of the super class.
        */
        rune.display.Sprite.call(this, 100, 100, 32, 32, "penguin");
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
    };

    ArcticMadness.entity.Player.prototype.dispose = function() {
        rune.display.Sprite.prototype.dispose.call(this);
    };

    //--------------------------------------------------------------------------
    // Private methods
    //--------------------------------------------------------------------------

    ArcticMadness.entity.Player.prototype.m_handleInput = function() {
        if(this.keyboard.pressed("A")) {
            this.x -= 2;
            this.flippedX = true;
            this.animation.gotoAndPlay("walk");
            
        }
       else if(this.keyboard.pressed("D")) {
            this.x += 2;
            this.flippedX = false;
            this.animation.gotoAndPlay("walk");
            
        }
       else if(this.keyboard.pressed("W")) {
            this.y -= 1;
            this.animation.gotoAndPlay("walk");
          
    
        }
       else if(this.keyboard.pressed("S")) {
            this.y += 1;
            this.animation.gotoAndPlay("walk");
           
        }
        else {
            this.animation.gotoAndPlay("idle");
            
        }
    };
