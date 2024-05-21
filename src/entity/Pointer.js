
//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.Pointer = function () {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------

    /**
     * Calls the constructor method of the super class.
     */
    rune.display.Graphic.call(this, 0, 0, 30, 20, "fish");
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.entity.Pointer.prototype = Object.create(
    rune.display.Graphic.prototype
);
ArcticMadness.entity.Pointer.prototype.constructor = ArcticMadness.entity.Pointer;

//

ArcticMadness.entity.Pointer.prototype.init = function () {
    rune.display.Graphic.prototype.init.call(this);
    this.flippedX = true;
    this.m_initTexture();
}

ArcticMadness.entity.Pointer.prototype.update = function (step) {
    rune.display.Graphic.prototype.update.call(this, step);
}

ArcticMadness.entity.Pointer.prototype.dispose = function () {
    rune.display.Graphic.prototype.dispose.call(this);
}

ArcticMadness.entity.Pointer.prototype.m_initTexture = function () {
    this.texture.replaceColor(
        new rune.color.Color24(133, 144, 255),
        new rune.color.Color24(255, 0, 0)
    );
}