//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.scene.NewHighscore = function (score,menuSound) {
    this.score = score;
    this.visualKeyboard = null;
    this.selectBox = null;
    this.ListName = "";
    this.ListNameText = null;
    this.menuSound = menuSound;




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

ArcticMadness.scene.NewHighscore.prototype = Object.create(
    rune.scene.Scene.prototype
);
ArcticMadness.scene.NewHighscore.prototype.constructor =
    ArcticMadness.scene.NewHighscore;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

ArcticMadness.scene.NewHighscore.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);
    this.m_createBackground();
    this.m_createNewHighscoreText();
    this.m_createScoreText();
    this.m_initVisualKeyboard();
    this.m_initSelectBox();
    this.menuSound.play();

    //this.m_addHighscore();
    // this.m_initSaveHighscoreButton();
};

ArcticMadness.scene.NewHighscore.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);
    if (this.keyboard.pressed("ENTER")) {
        this.application.scenes.load([new ArcticMadness.scene.Menu()]);
    }
    this.m_handleSelectBoxMovement();
    this.m_handleSelectBoxInput();
    this.m_removeLetter();
};

//------------------------------------------------------------------------------

ArcticMadness.scene.NewHighscore.prototype.dispose = function () {
    rune.scene.Scene.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Privat prototype methods
//------------------------------------------------------------------------------

ArcticMadness.scene.NewHighscore.prototype.m_createBackground = function () {
    this.background = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "newhighscore_bg"
    );
    this.stage.addChild(this.background);
};

ArcticMadness.scene.NewHighscore.prototype.m_createNewHighscoreText =
    function () {
        this.newHighscoreText = new rune.text.BitmapField(
            "new highscore",
            "thefont"
        );
        this.newHighscoreText.autoSize = true;
        this.newHighscoreText.scaleX = 4;
        this.newHighscoreText.scaleY = 4;
        this.newHighscoreText.center = this.application.screen.center;
        this.newHighscoreText.y = 100;
        this.stage.addChild(this.newHighscoreText);
    };

ArcticMadness.scene.NewHighscore.prototype.m_createScoreText = function () {
    this.scoreText = new rune.text.BitmapField("score: " + this.score, "thefont");
    this.scoreText.autoSize = true;
    this.scoreText.scaleX = 3;
    this.scoreText.scaleY = 3;
    this.scoreText.center = this.application.screen.center;
    this.scoreText.y = 200;
    
    this.stage.addChild(this.scoreText);
};

ArcticMadness.scene.NewHighscore.prototype.m_initVisualKeyboard = function () {
    this.visualKeyboard = new rune.display.Graphic(
        325,
        400,
        630,
        280,
        "keyboard");
    this.stage.addChild(this.visualKeyboard);

};

ArcticMadness.scene.NewHighscore.prototype.m_initSelectBox = function () {
    // this.selectBox = new rune.display.Graphic(325, 400, 70, 70, "selected");
    // this.stage.addChild(this.selectBox);
    this.selectBox = new rune.display.Sprite(325, 400, 70, 70, "selected"); //funkar med sprite?
    this.selectBox.animation.create("active", [0, 1,2], 8, true);
    this.stage.addChild(this.selectBox);
};

ArcticMadness.scene.NewHighscore.prototype.m_handleSelectBoxMovement = function () {
    var gamepad = this.gamepads.get(0);
    if (gamepad.justPressed(12) && this.selectBox.y > 400) {
        this.selectBox.y -= 70;
    }
    if (gamepad.justPressed(13) && this.selectBox.y < 610) {
        this.selectBox.y += 70;
    }
    if (gamepad.justPressed(14) && this.selectBox.x > 325) {
        this.selectBox.x -= 70;
    }
    if (gamepad.justPressed(15) && this.selectBox.x < 885) {
        this.selectBox.x += 70;
    }
    if (this.selectBox.y > 540) {
        this.selectBox.x = 535;
        this.selectBox.y = 610;
        this.selectBox.scaleX = 3;
    } else {
        this.selectBox.scaleX = 1;
    }
};

ArcticMadness.scene.NewHighscore.prototype.m_handleSelectBoxInput = function () {
    var gamepad = this.gamepads.get(0);

    if (gamepad.justPressed(0)) {

        if (this.selectBox.x == 325 && this.selectBox.y == 400) {
            this.updateListName("q ");
        }
        if (this.selectBox.x == 395 && this.selectBox.y == 400) {
            this.updateListName("w ");
        }
        if (this.selectBox.x == 465 && this.selectBox.y == 400) {
            this.updateListName("e ");
        }
        if (this.selectBox.x == 535 && this.selectBox.y == 400) {
            this.updateListName("r ");
        }
        if (this.selectBox.x == 605 && this.selectBox.y == 400) {
            this.updateListName("t ");
        }
        if (this.selectBox.x == 675 && this.selectBox.y == 400) {
            this.updateListName("y ");
        }
        if (this.selectBox.x == 745 && this.selectBox.y == 400) {
            this.updateListName("u ");
        }
        if (this.selectBox.x == 815 && this.selectBox.y == 400) {
            this.updateListName("i ");
        }
        if (this.selectBox.x == 885 && this.selectBox.y == 400) {
            this.updateListName("o ");
        }
        if (this.selectBox.x == 325 && this.selectBox.y == 470) {
            this.updateListName("a ");
        }
        if (this.selectBox.x == 395 && this.selectBox.y == 470) {
            this.updateListName("s ");
        }
        if (this.selectBox.x == 465 && this.selectBox.y == 470) {
            this.updateListName("d ");
        }
        if (this.selectBox.x == 535 && this.selectBox.y == 470) {
            this.updateListName("f ");
        }
        if (this.selectBox.x == 605 && this.selectBox.y == 470) {
            this.updateListName("g ");
        }
        if (this.selectBox.x == 675 && this.selectBox.y == 470) {
            this.updateListName("h ");
        }
        if (this.selectBox.x == 745 && this.selectBox.y == 470) {
            this.updateListName("j ");
        }
        if (this.selectBox.x == 815 && this.selectBox.y == 470) {
            this.updateListName("k ");
        }
        if (this.selectBox.x == 885 && this.selectBox.y == 470) {
            this.updateListName("p ");
        }
        if (this.selectBox.x == 325 && this.selectBox.y == 540) {
            this.updateListName("z ");
        }
        if (this.selectBox.x == 395 && this.selectBox.y == 540) {
            this.updateListName("x ");
        }
        if (this.selectBox.x == 465 && this.selectBox.y == 540) {
            this.updateListName("c ");
        }
        if (this.selectBox.x == 535 && this.selectBox.y == 540) {
            this.updateListName("v ");
        }
        if (this.selectBox.x == 605 && this.selectBox.y == 540) {
            this.updateListName("b ");
        }
        if (this.selectBox.x == 675 && this.selectBox.y == 540) {
            this.updateListName("n ");
        }
        if (this.selectBox.x == 745 && this.selectBox.y == 540) {
            this.updateListName("m ");
        }
        if (this.selectBox.x == 815 && this.selectBox.y == 540) {
            this.updateListName("l ");
        }
        if (this.selectBox.x == 885 && this.selectBox.y == 540) {
            this.updateListName("! ");
        }
        if (this.selectBox.x == 535 && this.selectBox.y == 610) {
            console.log(this.ListName);
            this.m_addHighscore(this.ListName.replace(/\s/g, ''));
            this.application.scenes.load([new ArcticMadness.scene.Menu()]);
        }
    };
};

ArcticMadness.scene.NewHighscore.prototype.m_removeLetter = function () {
    var gamepad = this.gamepads.get(0);
    if (gamepad.justPressed(1)) {
        if (this.ListName.length > 0) {
            this.ListName = this.ListName.slice(0, -2);
            this.stage.removeChild(this.ListNameText, true);
            if (this.ListName.length > 0) {
                this.ListNameText = new rune.text.BitmapField(this.ListName, "thefont");
                this.ListNameText.autoSize = true;
                this.ListNameText.x = 430;
                this.ListNameText.y = 275;
                this.ListNameText.scaleX = 4;
                this.ListNameText.scaleY = 4;
                this.stage.addChild(this.ListNameText);
            }
        } //Rensar inte allt? 
    }
}



ArcticMadness.scene.NewHighscore.prototype.updateListName = function (letter) {

    if (this.ListNameText != null) {
        this.stage.removeChild(this.ListNameText, true);
    }

    if (this.ListName.length < 9) {
        this.ListName += letter;
    }

    this.ListNameText = new rune.text.BitmapField(this.ListName, "thefont");
    this.ListNameText.autoSize = true;
    this.ListNameText.x = 430;
    this.ListNameText.y = 275;
    this.ListNameText.scaleX = 4;
    this.ListNameText.scaleY = 4;
    this.stage.addChild(this.ListNameText);
}

ArcticMadness.scene.NewHighscore.prototype.m_addHighscore = function (name) {
    this.application.highscores.send(this.score, name, 0);
};