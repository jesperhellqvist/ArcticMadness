//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.scene.GameOver = function (score,menuSound) {
  this.score = score;
  this.gameOverText = null;
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

ArcticMadness.scene.GameOver.prototype = Object.create(
  rune.scene.Scene.prototype
);
ArcticMadness.scene.GameOver.prototype.constructor =
  ArcticMadness.scene.GameOver;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

ArcticMadness.scene.GameOver.prototype.init = function () {
  rune.scene.Scene.prototype.init.call(this);
  this.m_createBackground();
  this.m_createScoreText();
  this.m_createMenu();
  this.m_createAnimations();
  this.menuSound.fade(1,3000);
  
};

ArcticMadness.scene.GameOver.prototype.update = function (step) {
  rune.scene.Scene.prototype.update.call(this, step);
      if (this.gamepads.get(0).justPressed(12)) {
          // this.moveSound.play();
          // this.moveSound.loop = false;
          if (this.gameoverMenu.up()) {
          }
      }

      if (this.gamepads.get(0).justPressed(13)) {
          // this.moveSound.play();
          // this.moveSound.loop = false;
          if (this.gameoverMenu.down()) {
          }
      }

      if (this.gamepads.get(0).justPressed(0)) {
          this.gameoverMenu.select();
      }
  

  if (this.keyboard.pressed("ENTER")) {
    this.application.scenes.load([new ArcticMadness.scene.Menu()]);
  }
};

ArcticMadness.scene.GameOver.prototype.dispose = function () {
  rune.scene.Scene.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Privat prototype methods
//------------------------------------------------------------------------------

ArcticMadness.scene.GameOver.prototype.m_createBackground = function () {
  this.gameover_bg = new rune.display.Graphic(
    0,
    0,
    this.application.screen.width,
    this.application.screen.height, "gameover_bg"
  );
  this.stage.addChild(this.gameover_bg);
};

ArcticMadness.scene.GameOver.prototype.m_createScoreText = function () {
  this.scoreText = new rune.text.BitmapField("score: " + this.score, "thefont");
  this.scoreText.autoSize = true;
  this.scoreText.scaleX = 4;
  this.scoreText.scaleY = 4;
  this.scoreText.center = this.application.screen.center;
  this.scoreText.y = this.application.screen.height / 2;
  this.stage.addChild(this.scoreText);
};

ArcticMadness.scene.GameOver.prototype.m_createAnimations = function () {
  this.drowningPenguin = new rune.display.Sprite(-50, 500, 64, 64, "64_penguin_nogun");
};

ArcticMadness.scene.GameOver.prototype.m_createMenu = function () {
  this.gameoverMenu = new rune.ui.VTMenu(
    {
      resource: "thefont",
      duration: 1000,
      frequency: 100
    }
  );
  this.gameoverMenu.add("PLAY AGAIN");
  this.gameoverMenu.add("MAIN MENU");
  this.gameoverMenu.width = 200;
  this.gameoverMenu.height = 50;
  this.gameoverMenu.x = 400;
  this.gameoverMenu.y = 500;
  this.gameoverMenu.scaleX = 3;
  this.gameoverMenu.scaleY = 3;
  this.gameoverMenu.onSelect(this.selectOption, this);

  this.stage.addChild(this.gameoverMenu);
};

ArcticMadness.scene.GameOver.prototype.selectOption = function (option) {
  switch (option.text) {
    case "PLAY AGAIN":
      this.application.scenes.load([new ArcticMadness.scene.JoinGame(this.menuSound)]);
      break;
    case "MAIN MENU":
      this.application.scenes.load([new ArcticMadness.scene.Menu()]);
      break;
  }
};
