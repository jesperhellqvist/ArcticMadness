//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Creates a new instance of the Main class.
 *
 * @constructor
 * 
 * @class
 * @classdesc
 * 
 * Entry point class.
 */
ArcticMadness.system.Main = function() {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------
    
    /**
     * Extend (Rune) Application.
     */
    rune.system.Application.call(this, {
        developer: "com.mathiaselvforsen",
        app: "ArcticMadness",
        build: "0.0.0",
        scene: ArcticMadness.scene.Game,
        resources: ArcticMadness.data.Requests,
        useGamepads:true,
        useKeyboard:true,
        framerate: 30,
        debug: true,
        screenResolutionX: 960,
        screenResolutionY: 540
    });
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.system.Main.prototype = Object.create(rune.system.Application.prototype);
ArcticMadness.system.Main.prototype.constructor = ArcticMadness.system.Main;