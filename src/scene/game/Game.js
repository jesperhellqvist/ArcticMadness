//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Creates a new object.
 *
 * @constructor
 * @extends rune.scene.Scene
 *
 * @class
 * @classdesc
 * 
 * Game scene.
 */
ArcticMadness.scene.Game = function() {

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

ArcticMadness.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
ArcticMadness.scene.Game.prototype.constructor = ArcticMadness.scene.Game;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated. 
 * The method is used to create objects to be used within the scene.
 *
 * @returns {undefined}
 */
ArcticMadness.scene.Game.prototype.init = function() {
    rune.scene.Scene.prototype.init.call(this);
    var bg = new rune.display.Graphic(0,0,960,540,"bg2");

  
    
    
    var text = new rune.text.BitmapField("Arctic Madness!!");
    text.autoSize = true;
    text.center = this.application.screen.center;

    var player = new ArcticMadness.entity.Player(100, 100, "penguin64", {left: "A", right: "D", up: "W", down: "S", jump: "SPACE"});
    var player2 = new ArcticMadness.entity.Player(200, 200, "penguin64", {left: "LEFT", right: "RIGHT", up: "UP", down: "DOWN", jump: "SPACE"});
  

   


    this.stage.addChild(bg);
    this.stage.addChild(player);
    this.stage.addChild(player2);
  
    this.stage.addChild(text);
};

/**
 * This method is automatically executed once per "tick". The method is used for 
 * calculations such as application logic.
 *
 * @param {number} step Fixed time step.
 *
 * @returns {undefined}
 */
ArcticMadness.scene.Game.prototype.update = function(step) {
    rune.scene.Scene.prototype.update.call(this, step);
};

/**
 * This method is automatically called once just before the scene ends. Use 
 * the method to reset references and remove objects that no longer need to 
 * exist when the scene is destroyed. The process is performed in order to 
 * avoid memory leaks.
 *
 * @returns {undefined}
 */
ArcticMadness.scene.Game.prototype.dispose = function() {
    rune.scene.Scene.prototype.dispose.call(this);

};