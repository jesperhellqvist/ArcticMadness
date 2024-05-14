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
    this.m_initBackground();
    this.m_initAnimations();
    this.m_initMenu();
    this.m_highscoreList();
    this.m_initSound();


}

/**
 * @inheritDoc
 */



ArcticMadness.scene.Menu.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);

    //Start menu
    if (!this.multiplayerMenu ) {
        if (this.gamepads.get(0).justPressed(12)) {
            if (this.menu.up()) {
            }

        }

        if (this.gamepads.get(0).justPressed(13)) {
            if (this.menu.down()) {
            }

        }

        if (this.gamepads.get(0).justPressed(0)) {
            this.menu.select();

        }
    }

    // Multiplayer menu
    if (this.multiplayerMenu) { // Check if multiplayerMenu exists
        if (this.gamepads.get(0).justPressed(12)) {
            if (this.multiplayerMenu.up()) {
            }
        }

        if (this.gamepads.get(0).justPressed(13)) {
            if (this.multiplayerMenu.down()) {
            }
        }

        if (this.gamepads.get(0).justPressed(0)) {
            this.multiplayerMenu.select();
        }
    }

    //Temporary go back to menu when pressing ("b" on the controller, square, X on xbox)
    if (this.gamepads.get(0).justPressed(2)) {
        this.stage.removeChild(this.controller_bg);
        this.stage.addChild(this.menu);
    }

    if (this.divingPenguin.y == 600 && this.divingPenguin.x == -500) {
        this.divingPenguin.y = 500;

    }
    else if (this.divingPenguin.x >= 600) {
        this.divingPenguin.velocity.x = 0;
        this.createDivingTween();
    }




}

//------------------------------------------------------------------------------

ArcticMadness.scene.Menu.prototype.createDivingTween = function () {
    if (!this.divingTweenActive) {
        this.divingTweenActive = true;
        this.divingPenguin.animation.gotoAndPlay("diving");
        this.tweens.create({
            target: this.divingPenguin,
            scope: this,
            duration: 550,
            onUpdate: function (divingPenguin) {

            },
            onDispose: function (divingPenguin) {
                this.splashEffect = this.application.sounds.sound.get("Splash");
                this.splashEffect.play();
                this.splashEffect.loop = false;
                this.divingTweenActive = false;
                divingPenguin.x = -500;
                this.divingPenguin.velocity.x = 2;
                this.divingPenguin.animation.gotoAndPlay("walking");
            },
            args: {
                x: 650,
                y: this.divingPenguin.y + 20,
            },
        });
    }
}


ArcticMadness.scene.Menu.prototype.m_initBackground = function () {
    this.background = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height, "menu_bg"
    );
    this.stage.addChild(this.background);
    this.divingPenguin = new rune.display.Sprite(-50, 500, 64, 64, "64_penguin_nogun");
    this.stage.addChild(this.divingPenguin);

}

//------------------------------------------------------------------------------

ArcticMadness.scene.Menu.prototype.m_initAnimations = function () {
    this.divingPenguin.animation.create("walking", [5, 6, 7, 8], 8, true);
    this.divingPenguin.animation.create("diving", [25, 26, 27, 28, 29], 9, true);
    this.divingPenguin.animation.create("splashing", [30, 31, 30, 31, 42], 8, true);
    this.divingPenguin.velocity.x = 2;


}

//Method to initialize the menu
ArcticMadness.scene.Menu.prototype.m_initMenu = function () {
    this.menu = new rune.ui.VTMenu();
    this.menu.add("Single Player");
    this.menu.add("Multiplayer");
    this.menu.add("Highscore");
    this.menu.add("How to play");
    this.menu.x = 200;
    this.menu.y = 230;
    this.menu.scaleX = 3;
    this.menu.scaleY = 3;
    this.menu.onSelect(this.selectOption, this);
    this.stage.addChild(this.menu);
}

ArcticMadness.scene.Menu.prototype.m_highscoreList = function () {
    this.playerHighscore = "1.mathias 1337";
    this.highscoreText = new rune.text.BitmapField(this.playerHighscore, "thefont");
    this.highscoreText.autoSize = true;
    this.highscoreText.scaleX = 2;
    this.highscoreText.scaleY = 2;
    this.highscoreText.x = 780;
    this.highscoreText.y = 300;

    this.stage.addChild(this.highscoreText);
}

ArcticMadness.scene.Menu.prototype.m_initSound = function () {
    this.menuSound = this.application.sounds.sound.get("lobby");
    this.menuSound.play();
    this.menuSound.loop = true;
}

//Method to select the option
ArcticMadness.scene.Menu.prototype.selectOption = function (option) {
    switch (option.text) {
        case "Single Player":
            this.application.scenes.load([
                new ArcticMadness.scene.Game()
            ]);
            break;
        case "Multiplayer":
            this.m_multiplayerMenu();
            // this.application.scenes.load([
            //     new ArcticMadness.scene.Game()
            // ]);
            break;
        case "How to play":
            this.controller_bg = new rune.display.Graphic(
                0,
                0,
                this.application.screen.width,
                this.application.screen.height, "controller_bg"
            );
            this.stage.addChild(this.controller_bg);
            this.stage.removeChild(this.menu);

            break;
        case "Highscore":
            this.application.scenes.load([
                new ArcticMadness.scene.Highscore()
            ]);
            break;
    }
}

ArcticMadness.scene.Menu.prototype.m_multiplayerMenu = function () {
    this.stage.removeChild(this.menu);
    this.multiplayerMenu = new rune.ui.VTMenu();
    this.multiplayerMenu.add("2 Players");
    this.multiplayerMenu.add("3 Players");
    this.multiplayerMenu.add("4 Players");
    this.multiplayerMenu.add("Back");
    this.multiplayerMenu.x = 200;
    this.multiplayerMenu.y = 230;
    this.multiplayerMenu.scaleX = 3;
    this.multiplayerMenu.scaleY = 3;
    this.multiplayerMenu.onSelect(this.selectMultiplayerOption, this);
    this.stage.addChild(this.multiplayerMenu);




}

ArcticMadness.scene.Menu.prototype.selectMultiplayerOption = function (option) {
    switch (option.text) {
        case "2 Players":
            this.application.scenes.load([
                new ArcticMadness.scene.Game(2)
            ]);
            break;
        case "3 Players":
            this.application.scenes.load([
                new ArcticMadness.scene.Game(3)
            ]);
            break;
        case "4 Players":
            this.application.scenes.load([
                new ArcticMadness.scene.Game(4)
            ]);
            break;
        case "Back":
            this.stage.removeChild(this.multiplayerMenu);
            this.multiplayerMenu = null;
            this.stage.addChild(this.menu);
            break;
    }
}
