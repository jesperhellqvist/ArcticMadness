//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.scene.NewHighscore = function (score) {
  this.score = score;

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
  this.m_createNewHighscoreText();
  this.m_createScoreText();
  this.m_addHighscore();
  // this.m_initSaveHighscoreButton();
};

ArcticMadness.scene.NewHighscore.prototype.update = function (step) {
  rune.scene.Scene.prototype.update.call(this, step);
  if (this.keyboard.pressed("ENTER")) {
    this.application.scenes.load([new ArcticMadness.scene.Menu()]);
  }
};

//------------------------------------------------------------------------------

ArcticMadness.scene.NewHighscore.prototype.dispose = function () {
  rune.scene.Scene.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Privat prototype methods
//------------------------------------------------------------------------------

ArcticMadness.scene.NewHighscore.prototype.m_createNewHighscoreText =
  function () {
    this.newHighscoreText = new rune.text.BitmapField(
      "new highscore",
      "thefont"
    );
    this.newHighscoreText.autoSize = true;
    this.newHighscoreText.width = 250;
    this.newHighscoreText.height = 50;
    this.newHighscoreText.x = 200;
    this.newHighscoreText.y = 100;
    this.newHighscoreText.scaleX = 2;
    this.newHighscoreText.scaleY = 2;
    this.stage.addChild(this.newHighscoreText);
  };

ArcticMadness.scene.NewHighscore.prototype.m_createScoreText = function () {
  this.scoreText = new rune.text.BitmapField("score: " + this.score, "thefont");
  this.scoreText.autoSize = true;
  this.scoreText.width = 250;
  this.scoreText.height = 50;
  this.scoreText.x = 200;
  this.scoreText.y = 200;
  this.scoreText.scaleX = 2;
  this.scoreText.scaleY = 2;
  this.stage.addChild(this.scoreText);
};

ArcticMadness.scene.NewHighscore.prototype.m_addHighscore = function () {
  console;
  this.application.highscores.send(this.score, "Jesper", 0);
};
