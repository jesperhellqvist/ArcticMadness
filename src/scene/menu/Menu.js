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
 * Game state.
 */

ArcticMadness.scene.Menu = function () {


    rune.scene.Scene.call(this);

};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.scene.Menu.prototype = Object.create(rune.scene.Scene.prototype);
ArcticMadness.scene.Menu.prototype.constructor = ArcticMadness.scene.Menu;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * @inheritDoc
 */

ArcticMadness.scene.Menu.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);
    var t = new rune.text.BitmapField("Press Space");
    t.autoSize = true;
    t.center = this.application.screen.center;
    this.stage.addChild(t);

    var options = new rune.ui.VTMenu("options");
    options.x = 500;
    options.y = 500;
    this.stage.addChild(options);
}

/**
 * @inheritDoc
 */

ArcticMadness.scene.Menu.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);
    if (this.keyboard.justPressed("space")) {
        this.application.scenes.load([
            new ArcticMadness.scene.Game()
        ]);
    }
}
