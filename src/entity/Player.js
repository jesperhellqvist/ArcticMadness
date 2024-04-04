
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
        rune.display.Sprite.call(this, 0, 0, 32, 32, "penguin");
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
        this.hitbox.set(0, 0, 32, 32);
        this.scaleX = 2;
        this.scaleY = 2;
        this.x = 100;
        this.y = 100;
        this.speed = 2;

    };