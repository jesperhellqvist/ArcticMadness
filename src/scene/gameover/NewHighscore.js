//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.scene.NewHighscore = function (score, numberOfPlayers, bestScore, menuSound) {
  this.score = score;
  this.numberOfPlayers = numberOfPlayers;
  this.background = null;
  this.newHighscoreText = null;
  this.scoreText = null;
  this.headerGraphics = null;
  this.bestScore = bestScore;
  this.selectBox = null;
  this.ListName = "";
  this.ListNameText = null;
  this.titleText = null;
  this.particleX = 300;
  this.particleY = 500;
  this.particleTimer = null;
  this.menuSound = menuSound;
  this.moveSound = null;
  this.chooseSound = null;






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
  this.cameras.getCameraAt(0).fade.opacity = 1;
  this.cameras.getCameraAt(0).fade.in(1000);
  this.m_createBackground();
  this.m_createSound();
  this.m_createNewHighscoreText();
  this.m_createHeaderGraphics();
  this.m_createScoreText();
  this.m_initSelectBox();
  this.m_createParticleTimer();
  this.m_createEmitter();
  this.m_createCheeringSoundTimer();
  this.menuSound.fade(1, 3000);
};

ArcticMadness.scene.NewHighscore.prototype.update = function (step) {
  rune.scene.Scene.prototype.update.call(this, step);
  this.m_handleSelectBoxMovement();
  this.m_handleSelectBoxInput();
  this.m_removeLetter();
};

//------------------------------------------------------------------------------

ArcticMadness.scene.NewHighscore.prototype.dispose = function () {
  this.stage.removeChild(this.selectBox, true);
  this.stage.removeChild(this.ListNameText, true);
  this.stage.removeChild(this.particleTimer, true);
  this.stage.removeChild(this.m_emitter, true);
  this.stage.removeChild(this.newHighscoreText, true);
  this.stage.removeChild(this.scoreText, true);
  this.stage.removeChild(this.headerGraphics, true);
  this.stage.removeChild(this.background, true);

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
    "newhighscore_bg2"
  );
  this.stage.addChild(this.background);
};

ArcticMadness.scene.NewHighscore.prototype.m_createSound = function () {
  this.moveSound = this.application.sounds.sound.get("shoot");
  this.moveSound.loop = false;
  this.chooseSound = this.application.sounds.sound.get("repaircomplete");
  this.chooseSound.loop = false;
  this.highscoreSound = this.application.sounds.sound.get("newhighscore");
  this.highscoreSound.loop = false;
  this.yaySound = this.application.sounds.sound.get("yay");
  this.yaySound.loop = false;
  this.topFiveSound = this.application.sounds.sound.get("topfive");
  this.topFiveSound.loop = false;
};

ArcticMadness.scene.NewHighscore.prototype.m_createHeaderGraphics = function () {
  this.headerGraphics = new rune.display.Sprite(240, 20, 800, 200, "highscorebar");
  this.headerGraphics.animation.create("lights", [4, 3, 4, 3, 1, 2, 1, 2], 5, true);
  this.headerGraphics.animation.gotoAndPlay("lights");
  this.stage.addChild(this.headerGraphics);

};

ArcticMadness.scene.NewHighscore.prototype.m_createCheeringSoundTimer = function () {
  this.cheeringSoundTimer = this.timers.create({
    duration: 3000,
    repeat: Infinity,
    scope: this,
    onTick: function () {
      this.yaySound.play();
    },
  });
};

ArcticMadness.scene.NewHighscore.prototype.m_createNewHighscoreText =
  function () {
    if (this.bestScore) {
      this.titleText = "new highscore";
      this.highscoreSound.play();
    } else {
      this.titleText = "top five";
      this.topFiveSound.play();
    }

    this.newHighscoreText = new rune.text.BitmapField(
      this.titleText,
      "thefont"
    );
    this.newHighscoreText.autoSize = true;
    this.newHighscoreText.scaleX = 4;
    this.newHighscoreText.scaleY = 4;
    this.newHighscoreText.center = this.application.screen.center;
    this.newHighscoreText.y = 80;
    this.stage.addChild(this.newHighscoreText);
  };


ArcticMadness.scene.NewHighscore.prototype.m_createScoreText = function () {
  this.scoreText = new rune.text.BitmapField("score: " + this.score, "thefont");
  this.scoreText.autoSize = true;
  this.scoreText.scaleX = 3;
  this.scoreText.scaleY = 3;
  this.scoreText.center = this.application.screen.center;
  this.scoreText.y = 230;
  this.stage.addChild(this.scoreText);
};


//Emitter
ArcticMadness.scene.NewHighscore.prototype.m_createEmitter = function () {
  this.particleX = Math.random() * 1280;
  this.particleY = Math.random() * 720;
  this.m_emitter = new rune.particle.Emitter(this.particleX, this.particleY, 30, 20, {
      particles: [ArcticMadness.entity.Particle],
      capacity: 100,
      accelrationY: 1,
      maxVelocityX: 4,
      minVelocityX: -4,
      maxVelocityY: 4,
      minVelocityY: -4,
      minRotation: 0,
      maxRotation: 20
  });

  this.stage.addChild(this.m_emitter);
  this.m_emitter.emit(30);

}


// DISPOSE INFINITY TIMER??
ArcticMadness.scene.NewHighscore.prototype.m_createParticleTimer = function () {
   this.particleTimer = this.timers.create({
      duration: 3000,
      repeat: Infinity,
      scope: this,

      onTick: function () {
     
          this.m_createEmitter();
      },
     

  });
}

ArcticMadness.scene.NewHighscore.prototype.m_initSelectBox = function () {
  this.selectBox = new rune.display.Sprite(325, 400, 70, 70, "selected"); //funkar med sprite?
  this.selectBox.animation.create("active", [0, 1, 2], 8, true);
  this.stage.addChild(this.selectBox);
};
ArcticMadness.scene.NewHighscore.prototype.m_handleSelectBoxMovement =
  function () {
    var gamepad = this.gamepads.get(0);
    if (gamepad.justPressed(12)||gamepad.stickLeftJustUp && this.selectBox.y > 400) {
      this.selectBox.y -= 70;
      this.moveSound.play();
  
    }
    if (gamepad.justPressed(13)||gamepad.stickLeftJustDown && this.selectBox.y < 610) {
      this.selectBox.y += 70;
      this.moveSound.play();

    }
    if (gamepad.justPressed(14)||gamepad.stickLeftJustLeft && this.selectBox.x > 325) {
      this.selectBox.x -= 70;
      this.moveSound.play();
     
    }
    if (gamepad.justPressed(15)||gamepad.stickLeftJustRight && this.selectBox.x < 885) {
      this.selectBox.x += 70;
      this.moveSound.play();

    }
    if (this.selectBox.y > 540) {
      this.selectBox.x = 535;
      this.selectBox.y = 610;
      this.selectBox.scaleX = 3;
    } 
    else {
      this.selectBox.scaleX = 1;
    }

  };
ArcticMadness.scene.NewHighscore.prototype.m_handleSelectBoxInput =
  function () {
    var gamepad = this.gamepads.get(0);
    if (gamepad.justPressed(0)) {
      this.chooseSound.play();
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
      if (this.selectBox.x == 600 && this.selectBox.y == 610) {
        this.m_removeLetter();
      }
      if (this.selectBox.x == 535 && this.selectBox.y == 610) {
        this.m_addHighscore(this.ListName.replace(/\s/g, ''));
        this.cameras.getCameraAt(0).fade.out(300, function () {
          this.application.scenes.load([
            new ArcticMadness.scene.Menu(),
          ]);
        }, this);      }
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
        this.ListNameText.y = 300;
        this.ListNameText.scaleX = 4;
        this.ListNameText.scaleY = 4;
        this.stage.addChild(this.ListNameText);
      }
    } 
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
  this.ListNameText.y = 300;
  this.ListNameText.scaleX = 4;
  this.ListNameText.scaleY = 4;
  this.stage.addChild(this.ListNameText);
};

ArcticMadness.scene.NewHighscore.prototype.m_addHighscore = function (name) {
  this.application.highscores.send(this.score, name, this.numberOfPlayers - 1);
};
