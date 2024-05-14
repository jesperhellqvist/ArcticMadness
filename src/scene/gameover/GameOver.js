//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.scene.GameOver = function (score) {
    this.score = score;

  this.gameOverText = null;
  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  /**
   * Calls the constructor method of the super class.
   */
  rune.scene.Scene.call(this);
  this.init();
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.scene.GameOver.prototype = Object.create(rune.scene.Scene.prototype);
ArcticMadness.scene.GameOver.prototype.constructor = ArcticMadness.scene.GameOver;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

ArcticMadness.scene.GameOver.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);
  this.m_createGameOverText();
  this.m_createScoreText();
};

ArcticMadness.scene.GameOver.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);
    if (this.keyboard.pressed("ENTER")) {
        this.application.scenes.load([new ArcticMadness.scene.Menu()]);
    }
};

ArcticMadness.scene.GameOver.prototype.dispose = function () {
    rune.scene.Scene.prototype.dispose.call(this);
}

//------------------------------------------------------------------------------
// Public prototype methods
//------------------------------------------------------------------------------

ArcticMadness.scene.GameOver.prototype.stopGame = function () {
    this.map.stopWave();
};

//------------------------------------------------------------------------------
// Privat prototype methods
//------------------------------------------------------------------------------

ArcticMadness.scene.GameOver.prototype.m_createGameOverText = function () {
  this.gameOverText = new rune.text.BitmapField("game over", "thefont");
  this.gameOverText.autoSize = true;
  this.gameOverText.width = 250;
  this.gameOverText.height = 50;
  this.gameOverText.x = this.application.screen.width / 2 - this.gameOverText.width / 2;
  this.gameOverText.y = this.application.screen.height / 2 - this.gameOverText.height / 2;
  this.gameOverText.scaleX = 4;
    this.gameOverText.scaleY = 4;
  this.stage.addChild(this.gameOverText);
};


ArcticMadness.scene.GameOver.prototype.m_createScoreText = function () {
    this.scoreText = new rune.text.BitmapField("score: " + this.score, "thefont");
    this.scoreText.autoSize = true;
    this.scoreText.width = 250;
    this.scoreText.height = 50;
    this.scoreText.x = this.application.screen.width / 2 - this.scoreText.width / 2;
    this.scoreText.y = this.application.screen.height / 2 - this.scoreText.height / 2 + 100;
    this.scoreText.scaleX = 4;
    this.scoreText.scaleY = 4;
    this.stage.addChild(this.scoreText);
};

