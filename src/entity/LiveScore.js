//--------------------------------
// Constructor scope
//--------------------------------

/**
 * Creates a new instance of the LiveScore class.
 * @constructor
 * @param {ArcticMadness.scene.Game} game The game object.
 * @returns {undefined}
 * @extends {rune.display.DisplayObject}
 * @class
 * @public
 */

ArcticMadness.entity.LiveScore = function (game) {
  this.game = game;
  this.score = 0;
  this.scoreText = null;

  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  rune.display.DisplayObject.call(this);
};

//--------------------------------------------------------------------------
// Inheritance
//--------------------------------------------------------------------------

ArcticMadness.entity.LiveScore.prototype = Object.create(
  rune.display.DisplayObject.prototype
);
ArcticMadness.entity.LiveScore.prototype.constructor =
  ArcticMadness.entity.LiveScore;

//--------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//--------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated.
 * @returns {undefined}
 * @public
 */

ArcticMadness.entity.LiveScore.prototype.init = function () {
  rune.display.DisplayObject.prototype.init.call(this);
  this.m_createScoreText();
};

ArcticMadness.entity.LiveScore.prototype.dispose = function () {
  this.game.stage.removeChild(this.scoreText, true);
  this.game = null;
  rune.display.DisplayObject.prototype.dispose.call(this);
};

//--------------------------------------------------------------------------
// Public prototype methods
//--------------------------------------------------------------------------

/**
 * Update the score text
 * @returns {undefined}
 * @public
 */

ArcticMadness.entity.LiveScore.prototype.updateScoreText = function () {
  this.scoreText.text = "SCORE; " + this.score;
};

//--------------------------------------------------------------------------
// Private prototype methods
//--------------------------------------------------------------------------

/**
 * Create the score text
 * @returns {undefined}
 * @private
 */

ArcticMadness.entity.LiveScore.prototype.m_createScoreText = function () {
  this.scoreText = new rune.text.BitmapField("SCORE; " + this.score, "thefont");
  this.scoreText.width = 200;
  this.scoreText.height = 50;
  this.scoreText.scaleX = 2;
  this.scoreText.scaleY = 2;
  this.scoreText.autosize = true;
  this.scoreText.x = 900;
  this.scoreText.y = 20;
  this.game.stage.addChild(this.scoreText);
};
