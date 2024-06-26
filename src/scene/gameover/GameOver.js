//--------------------------------
// Constructor scope
//--------------------------------

/**
 * This class represents the game over scene.
 * @constructor
 * @extends {rune.scene.Scene}
 * @param {number} score The score of the player.
 * @param {rune.media.Sound} menuSound The sound of the menu.
 * @return {undefined}
 */

ArcticMadness.scene.GameOver = function (score, menuSound) {
  this.score = score;
  this.menuSound = menuSound;
  this.gameover_bg = null;
  this.scoreText = null;
  this.gameoverMenu = null;
  this.drowningPenguin = null;
  this.drowningPenguin2 = null;
  this.moveSound = null;
  this.chooseSound = null;
  this.gameOverSound = null;

  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

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

/**
 * @inheritDoc
 * @override
 */

ArcticMadness.scene.GameOver.prototype.init = function () {
  rune.scene.Scene.prototype.init.call(this);
  this.cameras.getCameraAt(0).fade.opacity = 1;
  this.cameras.getCameraAt(0).fade.in(2000);
  this.m_createBackground();
  this.m_createSounds();
  this.m_createScoreText();
  this.m_createMenu();
  this.m_createAnimations();
  this.menuSound.fade(1, 3000);
};

/**
 * @inheritDoc
 * @override
 * @param {number} step
 * @return {undefined}
 */

ArcticMadness.scene.GameOver.prototype.update = function (step) {
  rune.scene.Scene.prototype.update.call(this, step);
  if (
    this.gamepads.get(0).justPressed(12) ||
    this.gamepads.get(0).stickLeftJustUp
  ) {
    this.moveSound.play();
    if (this.gameoverMenu.up()) {
    }
  }

  if (
    this.gamepads.get(0).justPressed(13) ||
    this.gamepads.get(0).stickLeftJustDown
  ) {
    this.moveSound.play();
    if (this.gameoverMenu.down()) {
    }
  }

  if (this.gamepads.get(0).justPressed(0)) {
    this.gameoverMenu.select();
    this.chooseSound.play();
  }
};

/**
 * @inheritDoc
 * @override
 * @return {undefined}
 */

ArcticMadness.scene.GameOver.prototype.dispose = function () {
  this.stage.removeChild(this.gameOverSound, true);
  this.stage.removeChild(this.chooseSound, true);
  this.stage.removeChild(this.moveSound, true);
  this.stage.removeChild(this.drowningPenguin2, true);
  this.stage.removeChild(this.drowningPenguin, true);
  this.stage.removeChild(this.gameoverMenu, true);
  this.stage.removeChild(this.scoreText, true);
  this.stage.removeChild(this.gameover_bg, true);
  rune.scene.Scene.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Privat prototype methods
//------------------------------------------------------------------------------

/**
 * Create the background.
 * @return {undefined}
 */

ArcticMadness.scene.GameOver.prototype.m_createBackground = function () {
  this.gameover_bg = new rune.display.Graphic(
    0,
    0,
    this.application.screen.width,
    this.application.screen.height,
    "gameover_bg"
  );
  this.stage.addChild(this.gameover_bg);
};

/**
 * Create the sounds.
 * @return {undefined}
 */

ArcticMadness.scene.GameOver.prototype.m_createSounds = function () {
  this.moveSound = this.application.sounds.sound.get("shoot");
  this.moveSound.loop = false;
  this.chooseSound = this.application.sounds.sound.get("repaircomplete");
  this.chooseSound.loop = false;
  this.gameOverSound = this.application.sounds.sound.get("gameover");
  this.gameOverSound.loop = false;
  this.gameOverSound.play();
};

/**
 * Create the score text.
 * @return {undefined}
 */

ArcticMadness.scene.GameOver.prototype.m_createScoreText = function () {
  this.scoreText = new rune.text.BitmapField("score: " + this.score, "thefont");
  this.scoreText.autoSize = true;
  this.scoreText.scaleX = 4;
  this.scoreText.scaleY = 4;
  this.scoreText.center = this.application.screen.center;
  this.scoreText.y = this.application.screen.height / 2;
  this.stage.addChild(this.scoreText);
};

/**
 * Create the animations.
 * @return {undefined}
 */

ArcticMadness.scene.GameOver.prototype.m_createAnimations = function () {
  this.drowningPenguin = new rune.display.Sprite(
    200,
    500,
    64,
    64,
    "penguin_texture_64x64"
  );
  this.drowningPenguin.animation.create("drowning", [30, 31], 8, true);
  this.drowningPenguin.scaleX = 2;
  this.drowningPenguin.scaleY = 2;
  this.stage.addChild(this.drowningPenguin);
  this.drowningPenguin2 = new rune.display.Sprite(
    920,
    500,
    64,
    64,
    "penguin_texture_64x64"
  );
  this.drowningPenguin2.animation.create("drowning", [30, 31], 8, true);
  this.drowningPenguin2.scaleX = 2;
  this.drowningPenguin2.scaleY = 2;
  this.stage.addChild(this.drowningPenguin2);
};

/**
 * Create the menu.
 * @return {undefined}
 */

ArcticMadness.scene.GameOver.prototype.m_createMenu = function () {
  this.gameoverMenu = new rune.ui.VTMenu({
    pointer: ArcticMadness.entity.Pointer,
    resource: "thefont",
    duration: 1000,
    frequency: 100,
  });
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

/**
 * Select an option.
 * @param {rune.ui.VTListElement} option The selected option.
 * @return {undefined}
 */

ArcticMadness.scene.GameOver.prototype.selectOption = function (option) {
  switch (option.text) {
    case "PLAY AGAIN":
      this.cameras.getCameraAt(0).fade.out(
        300,
        function () {
          this.application.scenes.load([
            new ArcticMadness.scene.JoinGame(this.menuSound),
          ]);
        },
        this
      );

      break;
    case "MAIN MENU":
      this.cameras.getCameraAt(0).fade.out(
        300,
        function () {
          this.application.scenes.load([new ArcticMadness.scene.Menu()]);
        },
        this
      );
      break;
  }
};
