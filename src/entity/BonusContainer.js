//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.BonusContainer = function (game) {
  this.game = game;
  this.controller_bg = null;
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
  this.m_setBackGround();
  this.m_createRepairedScoreText();
};

ArcticMadness.entity.BonusContainer.prototype.update = function (step) {
  rune.display.DisplayObjectContainer.prototype.update.call(this, step);
};

ArcticMadness.entity.BonusContainer.prototype.dispose = function () {
  rune.display.DisplayObjectContainer.prototype.dispose.call(this);
  console.log("dispose BonusContainer");
  this.game.stage.removeChild(this.controller_bg, true);
  this.controller_bg = null;
  this.game.stage.removeChild(this.repairedScore, true);
  this.repairedScore = null;

  //this.game.stage.removeChild(this.repairedScore, true);
};

ArcticMadness.entity.BonusContainer.prototype.m_setBackGround = function () {
  this.controller_bg = new rune.display.Sprite(
    400,
    400,
    700,
    700,
    "bonuspoint"
  );
  this.controller_bg.scaleX = 1;
  this.controller_bg.scaleY = 1;
    this.controller_bg.alpha = 0.5;
  this.game.stage.addChild(this.controller_bg);
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
