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
        scene: ArcticMadness.scene.Menu,
        resources: ArcticMadness.data.Requests,
        useGamepads:true,
        useKeyboard:true,
        framerate: 30,
        debug: true,
        screenResolutionX: 1280,
        screenResolutionY: 720
    });
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.system.Main.prototype = Object.create(rune.system.Application.prototype);
ArcticMadness.system.Main.prototype.constructor = ArcticMadness.system.Main;