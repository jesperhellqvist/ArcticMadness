//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.BonusContainer = function (game) {
  this.game = game;
  this.wavesCompleted = null;
  this.repairedScore = null;

  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  /**
   * Calls the constructor method of the super class.
   */
  rune.display.DisplayObjectContainer.call(this, 0, 0, 700, 700);
  this.init();
};

//--------------------------------------------------------------------------
// Inheritance

ArcticMadness.entity.BonusContainer.prototype = Object.create(
  rune.display.DisplayObjectContainer.prototype
);
ArcticMadness.entity.BonusContainer.prototype.constructor =
  ArcticMadness.entity.BonusContainer;

//--------------------------------------------------------------------------

ArcticMadness.entity.BonusContainer.prototype.init = function () {
  rune.display.DisplayObjectContainer.prototype.init.call(this);
  this.m_createWavesCompeltedText();
  this.m_createRepairedScoreText();
};

ArcticMadness.entity.BonusContainer.prototype.update = function (step) {
  rune.display.DisplayObjectContainer.prototype.update.call(this, step);
};

ArcticMadness.entity.BonusContainer.prototype.dispose = function () {
  rune.display.DisplayObjectContainer.prototype.dispose.call(this);
  this.game.stage.removeChild(this.wavesCompleted, true);
  this.wavesCompleted = null;
  this.game.stage.removeChild(this.repairedScore, true);
  this.repairedScore = null;

  //this.game.stage.removeChild(this.repairedScore, true);
};

ArcticMadness.entity.BonusContainer.prototype.m_createWavesCompeltedText =
  function () {
    console.log("m_createWavesCompeltedText");
    this.wavesCompleted = new rune.text.BitmapField(
      "WAVES COMPLETED: 0",
      "thefont"
    );
    this.wavesCompleted.width = 250;
    this.wavesCompleted.height = 50;
    this.wavesCompleted.scaleX = 2;
    this.wavesCompleted.scaleY = 2;
    this.wavesCompleted.autosize = true;
    this.wavesCompleted.x = 500;
    this.wavesCompleted.y = 500;
    this.game.stage.addChild(this.wavesCompleted);
  };

ArcticMadness.entity.BonusContainer.prototype.m_createRepairedScoreText =
  function () {
    console.log("m_createRepairedScoreText");
    this.repairedScore = new rune.text.BitmapField("REPAIRED: 0", "thefont");
    this.repairedScore.width = 200;
    this.repairedScore.height = 50;
    this.repairedScore.scaleX = 2;
    this.repairedScore.scaleY = 2;
    this.repairedScore.autosize = true;
    this.repairedScore.x = 500;
    this.repairedScore.y = 550;
    this.game.stage.addChild(this.repairedScore);
  };

ArcticMadness.entity.BonusContainer.prototype.updateScore = function (score) {
  this.repairedScore.text = "reparied: " + score;
};

ArcticMadness.entity.BonusContainer.prototype.updateWavesCompleted = function (
  waves
) {
  this.wavesCompleted.text = "waves completed " + waves;
};
