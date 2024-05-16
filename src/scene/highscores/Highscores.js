//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.scene.Highscores = function () {

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

ArcticMadness.scene.Highscores.prototype = Object.create(
    rune.scene.Scene.prototype
);
ArcticMadness.scene.Highscores.prototype.constructor =
    ArcticMadness.scene.Highscores;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------


ArcticMadness.scene.Highscores.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);
 
}

ArcticMadness.scene.Highscores.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);
}

ArcticMadness.scene.Highscores.prototype.dispose = function () {
    rune.scene.Scene.prototype.dispose.call(this);
}
//------------------------------------------------------------------------------


