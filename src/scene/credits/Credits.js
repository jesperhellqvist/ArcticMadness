//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.scene.Credits = function () {
    this.credits_bg = null;
    this.musicCredits = null;
    this.lobbyMusicCredits = null;
    this.gameMusicCredits = null;
    this.creatorsText = null;
    this.jesperGraphics = null;
    this.jesperText = null;
    this.jesperInfoText = null;
    this.mathiasGraphics = null;
    this.mathiasText = null;
    this.mathiasInfoText = null;
    this.backToMenu = null;
    this.penguin = null;
    this.penguin2 = null;
    this.penguin3 = null;
    this.penguin4 = null;
    
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


ArcticMadness.scene.Credits.prototype = Object.create(
    rune.scene.Scene.prototype
);
ArcticMadness.scene.Credits.prototype.constructor =
    ArcticMadness.scene.Credits;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------


ArcticMadness.scene.Credits.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);
    this.cameras.getCameraAt(0).fade.opacity = 1;
    this.cameras.getCameraAt(0).fade.in(300);
    this.m_createBackground();
    this.m_createMusicCredits();
    this.m_createProfiles();
    this.m_createUI();
    this.m_createPenguins();
    this.m_createAnimations();
}

//Back to main Menu
ArcticMadness.scene.Credits.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);
    if (this.gamepads.get(0).justPressed(1)) {

        this.cameras.getCameraAt(0).fade.out(300, function () {
            this.application.scenes.load([
                new ArcticMadness.scene.Menu(),
            ]);
        }, this);
    }
}

ArcticMadness.scene.Credits.prototype.dispose = function () {
    this.stage.removeChild(this.penguin4, true);
    this.stage.removeChild(this.penguin3, true);
    this.stage.removeChild(this.penguin2, true);
    this.stage.removeChild(this.penguin, true);
    this.stage.removeChild(this.backToMenu, true);
    this.stage.removeChild(this.mathiasInfoText, true);
    this.stage.removeChild(this.mathiasText, true);
    this.stage.removeChild(this.mathiasGraphics, true);
    this.stage.removeChild(this.jesperInfoText, true);
    this.stage.removeChild(this.jesperText, true);
    this.stage.removeChild(this.jesperGraphics, true);
    this.stage.removeChild(this.creatorsText, true);
    this.stage.removeChild(this.gameMusicCredits, true);
    this.stage.removeChild(this.lobbyMusicCredits, true);
    this.stage.removeChild(this.musicCredits, true);
    this.stage.removeChild(this.credits_bg, true);
    rune.scene.Scene.prototype.dispose.call(this);
}

//------------------------------------------------------------------------------


//------------------------------------------------------------------------------

ArcticMadness.scene.Credits.prototype.m_createBackground = function () {
    this.credits_bg = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "credits_bg"
    );
    this.stage.addChild(this.credits_bg);

}

//------------------------------------------------------------------------------

ArcticMadness.scene.Credits.prototype.m_createMusicCredits = function () {
    this.musicCredits = new rune.text.BitmapField("MUSIC CREDITS", "thefont");
    this.musicCredits.autoSize = true;
    this.musicCredits.scaleX = 2;
    this.musicCredits.scaleY = 2;
    this.musicCredits.center = this.application.screen.center;
    this.musicCredits.y = 475;
    this.stage.addChild(this.musicCredits);


    this.lobbyMusicCredits = new rune.ui.VTList("thefont");
    this.lobbyMusicCredits.padding = 10;
    this.lobbyMusicCredits.add("LOBBY MUSIC");
    this.lobbyMusicCredits.add("ELECTRO DOODLE BY KEVIN MACLEOD");
    this.lobbyMusicCredits.add("INCOMPETECH.COM");
    this.lobbyMusicCredits.add("LICENSED UNDER CREATIVE COMMONS;");
    this.lobbyMusicCredits.add("BY ATTRIBUTION '.# LICENSE");
    this.lobbyMusicCredits.add("HTTP;--CREATIVECOMMONS.ORG-LICENSES-BY-'.#-");
    this.lobbyMusicCredits.x = 100;
    this.lobbyMusicCredits.y = 540;
    this.stage.addChild(this.lobbyMusicCredits);

    this.gameMusicCredits = new rune.ui.VTList("thefont");
    this.gameMusicCredits.padding = 10;
    this.gameMusicCredits.add("GAME MUSIC");
    this.gameMusicCredits.add("THE LIFT BY KEVIN MACLEOD");
    this.gameMusicCredits.add("INCOMPETECH.COM");
    this.gameMusicCredits.add("LICENSED UNDER CREATIVE COMMONS;");
    this.gameMusicCredits.add("BY ATTRIBUTION '.# LICENSE");
    this.gameMusicCredits.add("HTTP;--CREATIVECOMMONS.ORG-LICENSES-BY-'.#-");
    this.gameMusicCredits.x = 700;
    this.gameMusicCredits.y = 540;
    this.stage.addChild(this.gameMusicCredits);
};


//------------------------------------------------------------------------------

ArcticMadness.scene.Credits.prototype.m_createProfiles = function () {
    this.creatorsText = new rune.text.BitmapField("CREATED BY", "thefont");
    this.creatorsText.autoSize = true;
    this.creatorsText.scaleX = 2;
    this.creatorsText.scaleY = 2;
    this.creatorsText.center = this.application.screen.center;
    this.creatorsText.y = 50;
    this.stage.addChild(this.creatorsText);

    this.jesperGraphics = new rune.display.Sprite(100, 100, 100, 100, "profiles");
    this.jesperGraphics.animation.create("jesper", [0, 1], 1, true);
    this.jesperGraphics.x = 320;
    this.jesperGraphics.y = 120;
    this.jesperGraphics.scaleX = 2;
    this.jesperGraphics.scaleY = 2;
    this.stage.addChild(this.jesperGraphics);


    this.jesperText = new rune.text.BitmapField("JESPER HELLQUIST", "thefont");
    this.jesperText.autoSize = true;
    this.jesperText.scaleX = 1.5;
    this.jesperText.scaleY = 1.5;
    this.jesperText.x = 280;
    this.jesperText.y = 100;
    this.stage.addChild(this.jesperText);

    this.jesperInfoText = new rune.text.BitmapField("DEVELOPER", "thefont");
    this.jesperInfoText.autoSize = true;
    this.jesperInfoText.scaleX = 1.5;
    this.jesperInfoText.scaleY = 1.5;
    this.jesperInfoText.x = 340;
    this.jesperInfoText.y = 320;
    this.stage.addChild(this.jesperInfoText);

    this.mathiasGraphics = new rune.display.Sprite(100, 100, 100, 100, "profiles");
    this.mathiasGraphics.animation.create("mathias", [3, 2], 1, true);
    this.mathiasGraphics.x = 760;
    this.mathiasGraphics.y = 120;
    this.mathiasGraphics.scaleX = 2;
    this.mathiasGraphics.scaleY = 2;
    this.stage.addChild(this.mathiasGraphics);

    this.mathiasText = new rune.text.BitmapField("MATHIAS ELV FORSEN", "thefont");
    this.mathiasText.autoSize = true;
    this.mathiasText.scaleX = 1.5;
    this.mathiasText.scaleY = 1.5;
    this.mathiasText.x = 700;
    this.mathiasText.y = 100;
    this.stage.addChild(this.mathiasText);

    this.mathiasInfoText = new rune.text.BitmapField("DESIGNER", "thefont");
    this.mathiasInfoText.autoSize = true;
    this.mathiasInfoText.scaleX = 1.5;
    this.mathiasInfoText.scaleY = 1.5;
    this.mathiasInfoText.x = 790;
    this.mathiasInfoText.y = 320;
    this.stage.addChild(this.mathiasInfoText);
}

//------------------------------------------------------------------------------

ArcticMadness.scene.Credits.prototype.m_createUI = function () {
    this.backToMenu = new rune.display.Sprite(50, 20, 220, 220, "how_to");
    this.backToMenu.animation.create("button", [14, 15], 4, true);
    this.backToMenu.animation.gotoAndPlay("button");
    this.backToMenu.scaleX = 0.5;
    this.backToMenu.scaleY = 0.5;
    this.stage.addChild(this.backToMenu);

}

//------------------------------------------------------------------------------

ArcticMadness.scene.Credits.prototype.m_createPenguins = function () {
    this.penguin = new rune.display.Sprite(-50, 350, 64, 64, "penguin_texture_64x64");
    this.penguin.animation.create("walking", [5, 6, 7, 8], 8, true);
    this.stage.addChild(this.penguin);

    this.penguin2 = new rune.display.Sprite(-75, 360, 64, 64, "penguin_texture_64x64");
    this.penguin2.animation.create("walking", [5, 6, 7, 8], 8, true);
    this.penguin2.texture.replaceColor(
        new rune.color.Color24(133, 144, 255),
        new rune.color.Color24(244, 40, 45)
    );
    this.stage.addChild(this.penguin2);
   

    this.penguin3 = new rune.display.Sprite(-100, 370, 64, 64, "penguin_texture_64x64");
    this.penguin3.animation.create("walking", [5, 6, 7, 8], 8, true);
    this.penguin3.texture.replaceColor(
        new rune.color.Color24(133, 144, 255),
        new rune.color.Color24(16, 152, 86)
    );
    this.stage.addChild(this.penguin3);

    this.penguin4 = new rune.display.Sprite(-300, 380, 64, 64, "penguin_texture_64x64");
    this.penguin4.animation.create("walking", [5, 6, 7, 8], 8, true);
    this.penguin4.texture.replaceColor(
        new rune.color.Color24(133, 144, 255),
        new rune.color.Color24(255, 250, 5)
    );
    this.stage.addChild(this.penguin4);
}

//------------------------------------------------------------------------------

ArcticMadness.scene.Credits.prototype.m_createAnimations = function () {
    this.tweens.create({
        target: this.penguin,
        scope: this,
        duration: 10000,
        onDispose: function (penguin) {
            penguin.x = -50;
        },
        args: {
            x: 1350,
        },
    });
    this.tweens.create({
        target: this.penguin2,
        scope: this,
        duration: 11000,
        onDispose: function (penguin) {
            penguin.x = -75;

        },
        args: {
            x: 1350,
        },
    });

    this.tweens.create({
        target: this.penguin3,
        scope: this,
        duration: 12000,
        onDispose: function (penguin) {
            penguin.x = -100;
        },
        args: {
            x: 1400,
        },
    });

    this.tweens.create({
        target: this.penguin4,
        scope: this,
        duration: 15000,
        onDispose: function (penguin) {
            penguin.x = -150;
            this.m_createAnimations();

        },
        args: {
            x: 1350,
        },
    });
}


//------------------------------------------------------------------------------


