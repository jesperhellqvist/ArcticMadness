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
  this.m_createBackground();
  this.m_createWavesCompeltedText();
  this.m_createRepairedScoreText();
  this.m_createEnemyScoreText();
  this.m_createTotalScoreText();
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
  this.game.stage.removeChild(this.enemyScore, true);
  this.enemyScore = null;
  this.game.stage.removeChild(this.totalScore, true);
  this.totalScore = null;
  this.game.stage.removeChild(this.wave_bg, true);
  this.wave_bg = null;


  //this.game.stage.removeChild(this.repairedScore, true);
};


ArcticMadness.entity.BonusContainer.prototype.m_createBackground = function () {
  this.wave_bg = new rune.display.Graphic(
    340, 160, 600, 400, "wave_bg"
  );
  console.log(this.background);
  this.game.stage.addChild(this.wave_bg);
};

ArcticMadness.entity.BonusContainer.prototype.m_createWavesCompeltedText =
  function () {
    console.log("m_createWavesCompeltedText");
    this.wavesCompleted = new rune.text.BitmapField(
      "1",
      "thefont"
    );
    this.wavesCompleted.autosize = true;
    this.wavesCompleted.width = 100;
    this.wavesCompleted.height = 50;
    this.wavesCompleted.scaleX = 3;
    this.wavesCompleted.scaleY = 3;
    this.wavesCompleted.x = 640;
    this.wavesCompleted.y = 240;
    this.game.stage.addChild(this.wavesCompleted);
  };

ArcticMadness.entity.BonusContainer.prototype.m_createRepairedScoreText =
  function () {
    console.log("m_createRepairedScoreText");
    this.repairedScore = new rune.text.BitmapField("REPAIRED: 0", "thefont");
    this.repairedScore.autosize = true;
    this.repairedScore.width = 200;
    this.repairedScore.height = 50;
    this.repairedScore.scaleX = 2;
    this.repairedScore.scaleY = 2;
    this.repairedScore.x= 800;
    this.repairedScore.y = 400;
    this.game.stage.addChild(this.repairedScore);
  };

ArcticMadness.entity.BonusContainer.prototype.m_createEnemyScoreText =
  function () {
    this.enemyScore = new rune.text.BitmapField("ENEMIES: 0", "thefont");
    this.enemyScore.autosize = true;
    this.enemyScore.width = 200;
    this.enemyScore.height = 50;
    this.enemyScore.scaleX = 2;
    this.enemyScore.scaleY = 2;
    this.enemyScore.x= 800;
    this.enemyScore.y = 325;
    this.game.stage.addChild(this.enemyScore);
  };

ArcticMadness.entity.BonusContainer.prototype.m_createTotalScoreText = function () {
  this.totalScore = new rune.text.BitmapField("TOTAL SCORE: 0", "thefont");
  this.totalScore.autosize = true;
  this.totalScore.width = 200;
  this.totalScore.height = 50;
  this.totalScore.scaleX = 2;
  this.totalScore.scaleY = 2;
  this.totalScore.x= 800;
  this.totalScore.y = 475;
  this.game.stage.addChild(this.totalScore);
};

ArcticMadness.entity.BonusContainer.prototype.updateScore = function (score) {
  this.repairedScore.text = score.toString();
};

ArcticMadness.entity.BonusContainer.prototype.updateEnemyScore = function (
  score
) {
  this.enemyScore.text = score.toString();
}

ArcticMadness.entity.BonusContainer.prototype.updateWavesCompleted = function (
  waves
) {
  this.wavesCompleted.text = waves.toString();
};

ArcticMadness.entity.BonusContainer.prototype.updateTotalScore = function (
  enemyScore,repairScore
) {
 console.log(enemyScore);
  totScore = enemyScore + repairScore;
  this.totalScore.text = totScore.toString();
}
