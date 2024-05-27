//--------------------------------
// Constructor scope
//--------------------------------

/**
 * This class is the highscore scene.
 * @class Highscores
 * @constructor
 * @extends rune.scene.Scene
 *
 */

ArcticMadness.scene.Highscores = function () {
  this.highscore_bg = null;
  this.headerGraphics = null;
  this.highscoreText = null;
  this.m_emitter = null;
  this.hs1 = null;
  this.hs2 = null;
  this.hs3 = null;
  this.hs4 = null;
  this.backToMenu = null;
  this.particleX = 300;
  this.particleY = 500;
  this.particleTimer = null;

  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------
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

/**
 * @inheritDoc
 * @override
 */

ArcticMadness.scene.Highscores.prototype.init = function () {
  rune.scene.Scene.prototype.init.call(this);
  this.cameras.getCameraAt(0).fade.opacity = 1;
  this.cameras.getCameraAt(0).fade.in(300);
  this.m_createBackground();
  this.m_createHeader();
  this.m_createParticleTimer();
  this.m_createEmitter();
  this.init_hs1();
  this.init_hs2();
  this.init_hs3();
  this.init_hs4();
  this.m_createUI();
};

/**
 * @inheritDoc
 * @override
 * @param {number} step Current step.
 */

ArcticMadness.scene.Highscores.prototype.update = function (step) {
  rune.scene.Scene.prototype.update.call(this, step);
  if (this.gamepads.get(0).justPressed(1)) {
    this.cameras.getCameraAt(0).fade.out(
      300,
      function () {
        this.application.scenes.load([new ArcticMadness.scene.Menu()]);
      },
      this
    );
  }
};

/**
 * @inheritDoc
 * @override
 */

ArcticMadness.scene.Highscores.prototype.dispose = function () {
  this.stage.removeChild(this.particleTimer, true);
  this.stage.removeChild(this.backToMenu, true);
  this.stage.removeChild(this.hs4, true);
  this.stage.removeChild(this.hs3, true);
  this.stage.removeChild(this.hs2, true);
  this.stage.removeChild(this.hs1, true);
  this.stage.removeChild(this.m_emitter, true);
  this.stage.removeChild(this.highscoreText, true);
  this.stage.removeChild(this.headerGraphics, true);
  this.stage.removeChild(this.highscore_bg, true);
  rune.scene.Scene.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Private prototype methods
//------------------------------------------------------------------------------

/**
 * This method creates the background.
 * @returns {undefined}
 * @private
 */

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

/**
 * This method creates the header.
 * @returns {undefined}
 * @private
 */

ArcticMadness.scene.Highscores.prototype.m_createHeader = function () {
  this.headerGraphics = new rune.display.Sprite(
    240,
    50,
    800,
    200,
    "highscorebar"
  );
  this.headerGraphics.animation.create(
    "lights",
    [4, 3, 4, 3, 1, 2, 1, 2,0],
    5,
    true
  );
  this.headerGraphics.animation.gotoAndPlay("lights");
  this.stage.addChild(this.headerGraphics);
  this.highscoreText = new rune.text.BitmapField("HIGHSCORES", "thefont");
  this.highscoreText.autoSize = true;
  this.highscoreText.scaleX = 5;
  this.highscoreText.scaleY = 5;
  this.highscoreText.center = this.application.screen.center;
  this.highscoreText.y = this.headerGraphics.y + 50;
  this.stage.addChild(this.highscoreText);
};

/**
 * This method creates the particle emitter.
 * @returns {undefined}
 * @private
 */

ArcticMadness.scene.Highscores.prototype.m_createEmitter = function () {
  this.particleX = Math.random() * 1280;
  this.particleY = Math.random() * 720;
  this.m_emitter = new rune.particle.Emitter(
    this.particleX,
    this.particleY,
    30,
    20,
    {
      particles: [ArcticMadness.entity.Particle],
      capacity: 100,
      accelrationY: 1,
      maxVelocityX: 4,
      minVelocityX: -4,
      maxVelocityY: 4,
      minVelocityY: -4,
      minRotation: 0,
      maxRotation: 20,
    }
  );
  this.stage.addChild(this.m_emitter);
  this.m_emitter.emit(30);
};

/**
 * This method creates the particle timer.
 * @returns {undefined}
 * @private
 */

ArcticMadness.scene.Highscores.prototype.m_createParticleTimer = function () {
  this.particleTimer = this.timers.create({
    duration: 3000,
    repeat: Infinity,
    scope: this,
    onTick: function () {
      this.m_createEmitter();
    },
  });
};

/**
 * This method initializes the highscore lists.
 * @returns {undefined}
 * @private
 */

ArcticMadness.scene.Highscores.prototype.init_hs1 = function () {
  this.hs1 = new ArcticMadness.entity.HighscoreList(
    "$ PLAYER",
    0,
    this,
    100,
    100,
    70,
    300
  );
  this.hs1.x = 50;
  this.hs1.y = 420;
  this.stage.addChild(this.hs1);
};

/**
 * This method initializes the highscore lists for two players.
 * @returns {undefined}
 * @private
 */

ArcticMadness.scene.Highscores.prototype.init_hs2 = function () {
  this.hs2 = new ArcticMadness.entity.HighscoreList(
    "% PLAYERS",
    1,
    this,
    300,
    100,
    380,
    300
  );
  this.hs2.x = 370;
  this.hs2.y = 420;
  this.stage.addChild(this.hs2);
};

/**
 * This method initializes the highscore lists for three players.
 * @returns {undefined}
 * @private
 */

ArcticMadness.scene.Highscores.prototype.init_hs3 = function () {
  this.hs3 = new ArcticMadness.entity.HighscoreList(
    "& PLAYERS",
    2,
    this,
    500,
    100,
    690,
    300
  );
  this.hs3.x = 690;
  this.hs3.y = 420;
  this.stage.addChild(this.hs3);
};

/**
 * This method initializes the highscore lists for four players.
 * @returns {undefined}
 * @private
 */

ArcticMadness.scene.Highscores.prototype.init_hs4 = function () {
  this.hs4 = new ArcticMadness.entity.HighscoreList(
    "' PLAYERS",
    3,
    this,
    700,
    100,
    1000,
    300
  );
  this.hs4.x = 1000;
  this.hs4.y = 420;
  this.stage.addChild(this.hs4);
};

/**
 * This method creates the UI.
 * @returns {undefined}
 * @private
 */

ArcticMadness.scene.Highscores.prototype.m_createUI = function () {
  this.backToMenu = new rune.display.Sprite(30, 20, 220, 220, "how_to");
  this.backToMenu.animation.create("button", [14, 15], 4, true);
  this.backToMenu.animation.gotoAndPlay("button");
  this.backToMenu.scaleX = 0.5;
  this.backToMenu.scaleY = 0.5;
  this.stage.addChild(this.backToMenu);
};
