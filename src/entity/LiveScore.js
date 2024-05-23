//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.LiveScore = function (game) {
    this.game = game;
    this.score = 0;
    this.scoreText = null;
    
    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------
    
    /**
     * Calls the constructor method of the super class.
     */
    rune.text.BitmapField.call(this);
    this.init();
    }

//--------------------------------------------------------------------------
// Inheritance

ArcticMadness.entity.LiveScore.prototype = Object.create(
    rune.display.DisplayObject.prototype
);
ArcticMadness.entity.LiveScore.prototype.constructor = ArcticMadness.entity.LiveScore;

//--------------------------------------------------------------------------

ArcticMadness.entity.LiveScore.prototype.init = function () {
    rune.display.DisplayObject.prototype.init.call(this);
    this.m_createScoreText();
}

ArcticMadness.entity.LiveScore.prototype.update = function (step) {
    rune.display.DisplayObject.prototype.update.call(this, step);
    
}

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
}

ArcticMadness.entity.LiveScore.prototype.updateScoreText = function () {
    this.scoreText.text = "SCORE; " + this.score;
}