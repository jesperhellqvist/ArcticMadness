//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.scene.HowtoPlay = function () {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------

    /**
     * Calls the constructor method of the super class.
     */
    rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.scene.HowtoPlay.prototype = Object.create(
    rune.scene.Scene.prototype
);
ArcticMadness.scene.HowtoPlay.prototype.constructor =
    ArcticMadness.scene.HowtoPlay;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------


ArcticMadness.scene.HowtoPlay.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);
 
}

ArcticMadness.scene.HowtoPlay.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);
}

ArcticMadness.scene.HowtoPlay.prototype.dispose = function () {
    rune.scene.Scene.prototype.dispose.call(this);
}
//------------------------------------------------------------------------------


