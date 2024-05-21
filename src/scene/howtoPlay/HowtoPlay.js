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
    this.cameras.getCameraAt(0).fade.opacity = 1;
    this.cameras.getCameraAt(0).fade.in(300);
    this.m_createBackground();
    this.m_createUI();
    this.m_createControlAnimations();
    this.m_createDescription();
}

//Back to main Menu
ArcticMadness.scene.HowtoPlay.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);
    if (this.gamepads.get(0).justPressed(1)) {
        
        this.cameras.getCameraAt(0).fade.out(300, function() {
            this.application.scenes.load([
              new ArcticMadness.scene.Menu(),
            ]);
          }, this);
    } 
}

ArcticMadness.scene.HowtoPlay.prototype.dispose = function () {
    this.stage.removeChild(this.controller, true);
    this.stage.removeChild(this.backToMenu, true);
    this.stage.removeChild(this.howto_bg, true);
    rune.scene.Scene.prototype.dispose.call(this);
}
//------------------------------------------------------------------------------


ArcticMadness.scene.HowtoPlay.prototype.m_createBackground = function () {
    this.howto_bg = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,

        "howto_bg2",
    );
    this.stage.addChild(this.howto_bg);
}


//Method to initialize the controller graphics
ArcticMadness.scene.HowtoPlay.prototype.m_createUI = function () {
    this.backToMenu = new rune.display.Sprite(50, 20, 220, 220, "how_to");
    this.backToMenu.animation.create("button", [14, 15], 4, true);
    this.backToMenu.animation.gotoAndPlay("button");
    this.backToMenu.scaleX = 0.7;
    this.backToMenu.scaleY = 0.7;
    this.stage.addChild(this.backToMenu);

}

//Method to initialize the animations
ArcticMadness.scene.HowtoPlay.prototype.m_createControlAnimations = function () {
    this.controller = new rune.display.Sprite(570, 170, 800, 400, "howtoanimation");
    this.controller.animation.create("controls", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 40, 41, 42, 43],
        8,
        true
    );
    this.controller.animation.gotoAndPlay("controls");
    this.stage.addChild(this.controller);
}

//Method to initialize the description
ArcticMadness.scene.HowtoPlay.prototype.m_createDescription = function () {
    this.descriptionText = new rune.text.BitmapField(
       "ARCTIC MADNESS IS A SURVIVOR GAME\n\nWHERE YOU PLAY AS A PENGUIN\n\nTHE GOAL IS TO SURVIVE\n\nAS LONG AS POSSIBLE\n\nBY AVOIDING THE WATER AND\n\nTHE ENEMIES\n\nYOU CAN REPAIR THE ICE BY\n\nFILLING THE CRACKS WITH SNOW AND\n\nYOU CAN ALSO SHOOT THE ENEMIES\n\nWITH YOUR FISH GUN\n\nIF YOU FALL IN THE WATER OTHER\n\nPLAYERS CAN SAVE YOU\n\nBUT IF THEY ARENT FAST ENOUGH\n\nYOU GET EATEN\n\n         GOOD LUCK\n\n","thefont"
    );
    this.descriptionText.autoSize = true;
    this.descriptionText.scaleX = 1.3;
    this.descriptionText.scaleY = 1;
    this.descriptionText.x= 30;
    this.descriptionText.y = 200;
    this.stage.addChild(this.descriptionText);
}

