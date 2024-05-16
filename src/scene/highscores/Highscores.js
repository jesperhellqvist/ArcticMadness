//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.scene.Highscores = function () {
    this.highscore_bg = null;
    this.headerGraphics = null;
    this.highscoreText = null;
    this.hs1 = null;
    this.hs2 = null;
    this.hs3 = null;
    this.hs4 = null;
    this.backToMenu = null;


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
    this.m_createBackground();
    this.m_createHeader();
    this.init_hs1();
    this.init_hs2();
    this.init_hs3();
    this.init_hs4();
    this.m_createcontroller();

}
//Back to main Menu
ArcticMadness.scene.Highscores.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);
    if (this.gamepads.get(0).justPressed(1)) {
        this.application.scenes.load([
            new ArcticMadness.scene.Menu(),

        ]);
    }
}

ArcticMadness.scene.Highscores.prototype.dispose = function () {
    this.stage.removeChild(this.backToMenu, true);
    this.stage.removeChild(this.hs4, true);
    this.stage.removeChild(this.hs3, true);
    this.stage.removeChild(this.hs2, true);
    this.stage.removeChild(this.hs1, true);
    this.stage.removeChild(this.highscoreText, true);
    this.stage.removeChild(this.headerGraphics, true);
    this.stage.removeChild(this.highscore_bg, true);
    rune.scene.Scene.prototype.dispose.call(this);

}
//------------------------------------------------------------------------------

//create background
ArcticMadness.scene.Highscores.prototype.m_createBackground = function () {
    this.highscore_bg = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "highscores_bg"
    );
    this.stage.addChild(this.highscore_bg);
};

//Header graphics and text
ArcticMadness.scene.Highscores.prototype.m_createHeader = function () {
    this.headerGraphics = new rune.display.Sprite(240, 50, 800, 200, "highscorebar");
    this.headerGraphics.animation.create("lights", [4, 3, 4, 3, 1, 2, 1, 2], 5, true);
    this.headerGraphics.animation.gotoAndPlay("lights");
    this.stage.addChild(this.headerGraphics);
    this.highscoreText = new rune.text.BitmapField(
        "HIGHSCORES",
        "thefont"
    );
    this.highscoreText.autoSize = true;
    this.highscoreText.scaleX = 5;
    this.highscoreText.scaleY = 5;
    this.highscoreText.center = this.application.screen.center;
    this.highscoreText.y = this.headerGraphics.y + 50;
    this.stage.addChild(this.highscoreText);
}
//1 player list
ArcticMadness.scene.Highscores.prototype.init_hs1 = function () {
    this.hs1 = new ArcticMadness.entity.HighscoreList("$ PLAYER", 0, this, 100, 100, 70, 300);
    this.hs1.x = 50;
    this.hs1.y = 420;
    this.stage.addChild(this.hs1);
};
//2 players list
ArcticMadness.scene.Highscores.prototype.init_hs2 = function () {
    this.hs2 = new ArcticMadness.entity.HighscoreList("% PLAYERS", 1, this, 300, 100, 380, 300);
    this.hs2.x = 370;
    this.hs2.y = 420;
    this.stage.addChild(this.hs2);
};

//3 players list
ArcticMadness.scene.Highscores.prototype.init_hs3 = function () {
    this.hs3 = new ArcticMadness.entity.HighscoreList("& PLAYERS", 2, this, 500, 100, 690, 300);
    this.hs3.x = 690;
    this.hs3.y = 420;
    this.stage.addChild(this.hs3);
};

//4 players list
ArcticMadness.scene.Highscores.prototype.init_hs4 = function () {
    this.hs4 = new ArcticMadness.entity.HighscoreList("' PLAYERS", 3, this, 700, 100, 1000, 300);
    this.hs4.x = 1000;
    this.hs4.y = 420;
    this.stage.addChild(this.hs4);
};

//Method to initialize the controller graphics
ArcticMadness.scene.Highscores.prototype.m_createcontroller = function () {
    this.backToMenu = new rune.display.Sprite(30, 20, 220, 220, "how_to");
    this.backToMenu.animation.create("button", [14, 15], 4, true);
    this.backToMenu.animation.gotoAndPlay("button");
    this.backToMenu.scaleX = 0.7;
    this.backToMenu.scaleY = 0.7;
    this.stage.addChild(this.backToMenu);

}
