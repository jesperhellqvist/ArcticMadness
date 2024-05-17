//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.Particle = function () {


    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------

    /**
     * Calls the constructor method of the super class.
     */
    rune.display.Sprite.call(this, 0, 0, 30, 20, "fish");
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.entity.Particle.prototype = Object.create(
    rune.display.Sprite.prototype
);
ArcticMadness.entity.Particle.prototype.constructor = ArcticMadness.entity.Particle;


ArcticMadness.entity.Particle.prototype.init = function () {
    rune.display.Sprite.prototype.init.call(this);
    this.m_initTexture();
};

ArcticMadness.entity.Particle.prototype.update = function (step) {
    rune.display.Sprite.prototype.update.call(this, step);
};

ArcticMadness.entity.Particle.prototype.dispose = function () {
    rune.display.Sprite.prototype.dispose.call(this);
};


//------------------------------------------------------------------------------
ArcticMadness.entity.Particle.prototype.m_initTexture = function () {
    this.texture.replaceColor(
        new rune.color.Color24(133,144,255),
        new rune.color.Color24(Math.random() * 255, Math.random() * 255, Math.random() * 255)
    );
  
};

