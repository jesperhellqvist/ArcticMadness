//--------------------------------
// Constructor scope
//--------------------------------

/**
 * Creates a new instance of the BonusContainer class
 * @constructor
 * @param {ArcticMadness.scene.Game} game
 * @extends {rune.display.DisplayObjectContainer}
 * @class ArcticMadness.entity.BonusContainer
 */

ArcticMadness.entity.BonusContainer = function (game) {
  this.game = game;
  this.wavesCompleted = null;
  this.repairedScore = null;
  this.enemyScore = null;
  this.totalScore = null;
  this.wave_bg = null;
  this.score = 0;
  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  /**
   * Calls the constructor method of the super class.
   */
  rune.display.DisplayObjectContainer.call(this, 0, 0, 700, 700);
};

//--------------------------------------------------------------------------
// Inheritance
//--------------------------------------------------------------------------

ArcticMadness.entity.BonusContainer.prototype = Object.create(
  rune.display.DisplayObjectContainer.prototype
);
ArcticMadness.entity.BonusContainer.prototype.constructor =
  ArcticMadness.entity.BonusContainer;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is called when the object is added to the stage.
 * @returns {undefined}
 */

ArcticMadness.entity.BonusContainer.prototype.init = function () {
  rune.display.DisplayObjectContainer.prototype.init.call(this);
  this.m_createBackground();
  this.m_createWavesCompeltedText();
  this.m_createRepairedScoreText();
  this.m_createEnemyScoreText();
  this.m_createTotalScoreText();
};

/**
 * This method is called when the object is removed from the stage and removes all children.
 * @returns {undefined}
 */

ArcticMadness.entity.BonusContainer.prototype.dispose = function () {
  this.game.stage.removeChild(this.wave_bg, true);
  this.game.stage.removeChild(this.totalScore, true);
  this.game.stage.removeChild(this.enemyScore, true);
  this.game.stage.removeChild(this.repairedScore, true);
  this.game.stage.removeChild(this.wavesCompleted, true);
  this.game = null;
  rune.display.DisplayObjectContainer.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Public prototype methods
//------------------------------------------------------------------------------

/**
 * Updates the repaired score text
 * @param {number} score
 * @returns {undefined}
 */

ArcticMadness.entity.BonusContainer.prototype.updateScore = function (score) {
  this.score = score / 10;
  this.repairedScore.text =  "$# X " + this.score.toString() ;
};

/**
 * Updates the enemy score text
 * @param {number} score
 * @returns {undefined}
 */

ArcticMadness.entity.BonusContainer.prototype.updateEnemyScore = function (
  score
) {
  this.score = score / 5;
  this.enemyScore.text ="( X " + this.score.toString();
};

/**
 * Updates the waves completed text
 * @param {number} waves
 * @returns {undefined}
 */

ArcticMadness.entity.BonusContainer.prototype.updateWavesCompleted = function (
  waves
) {
  this.wavesCompleted.text = waves.toString();
};

/**
 * Updates the total score text
 * @param {number} enemyScore
 * @param {number} repairScore
 * @returns {undefined}
 */

ArcticMadness.entity.BonusContainer.prototype.updateTotalScore = function (
  enemyScore,
  repairScore
) {
  var totScore = enemyScore + repairScore;
  this.totalScore.text = totScore.toString();
};

//------------------------------------------------------------------------------
// Private prototype methods
//------------------------------------------------------------------------------

/**
 * Creates the background for the bonus container
 * @returns {undefined}
 */

ArcticMadness.entity.BonusContainer.prototype.m_createBackground = function () {
  this.wave_bg = new rune.display.Graphic(340, 160, 600, 400, "wave_bg");
  this.game.stage.addChild(this.wave_bg);
};

/**
 * Creates the waves completed text
 * @returns {undefined}
 */

ArcticMadness.entity.BonusContainer.prototype.m_createWavesCompeltedText =
  function () {
    this.wavesCompleted = new rune.text.BitmapField("1", "thefont");
    this.wavesCompleted.autosize = true;
    this.wavesCompleted.width = 100;
    this.wavesCompleted.height = 50;
    this.wavesCompleted.scaleX = 3;
    this.wavesCompleted.scaleY = 3;
    this.wavesCompleted.x = 640;
    this.wavesCompleted.y = 240;
    this.game.stage.addChild(this.wavesCompleted);
  };

/**
 * Creates the repaired score text
 * @returns {undefined}
 */

ArcticMadness.entity.BonusContainer.prototype.m_createRepairedScoreText =
  function () {
    this.repairedScore = new rune.text.BitmapField("REPAIRED: 0", "thefont");
    this.repairedScore.autosize = true;
    this.repairedScore.width = 200;
    this.repairedScore.height = 50;
    this.repairedScore.scaleX = 1.5;
    this.repairedScore.scaleY = 1.5;
    this.repairedScore.x = 750;
    this.repairedScore.y = 405;
    this.game.stage.addChild(this.repairedScore);
  };

/**
 * Creates the enemy score text
 * @returns {undefined}
 */

ArcticMadness.entity.BonusContainer.prototype.m_createEnemyScoreText =
  function () {
    this.enemyScore = new rune.text.BitmapField("ENEMIES: 0", "thefont");
    this.enemyScore.autosize = true;
    this.enemyScore.width = 200;
    this.enemyScore.height = 50;
    this.enemyScore.scaleX = 1.5;
    this.enemyScore.scaleY = 1.5;
    this.enemyScore.x = 750;
    this.enemyScore.y = 325;
    this.game.stage.addChild(this.enemyScore);
  };

/**
 * Creates the total score text
 * @returns {undefined}
 */

ArcticMadness.entity.BonusContainer.prototype.m_createTotalScoreText =
  function () {
    this.totalScore = new rune.text.BitmapField("TOTAL SCORE: 0", "thefont");
    this.totalScore.autosize = true;
    this.totalScore.width = 200;
    this.totalScore.height = 50;
    this.totalScore.scaleX = 2;
    this.totalScore.scaleY = 2;
    this.totalScore.x = 800;
    this.totalScore.y = 475;
    this.game.stage.addChild(this.totalScore);
  };
