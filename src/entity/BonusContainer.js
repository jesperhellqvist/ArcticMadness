//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.BonusContainer = function (game) {
    this.game = game;



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

ArcticMadness.entity.BonusContainer.prototype = Object.create(
    rune.display.DisplayObject.prototype
);
ArcticMadness.entity.BonusContainer.prototype.constructor = ArcticMadness.entity.BonusContainer;

//--------------------------------------------------------------------------

ArcticMadness.entity.BonusContainer.prototype.init = function () {
    rune.display.DisplayObject.prototype.init.call(this);
    this.m_createBonusContainer();
}

ArcticMadness.entity.BonusContainer.prototype.update = function (step) {
    rune.display.DisplayObject.prototype.update.call(this, step);

}


ArcticMadness.entity.BonusContainer.prototype.m_createBonusContainer = function () {
    this.controller_bg = new rune.display.Graphic(
        0,
        0,
        300,
        300, "bonuspoint"
    );
    this.game.stage.addChild(this.controller_bg);
    this.repairedScore = new rune.text.BitmapField("REPAIRD SCORE", "thefont");
    this.repairedScore.width = 200;
    this.repairedScore.height = 50;
    this.repairedScore.scaleX = 1;
    this.repairedScore.scaleY = 1;
    this.repairedScore.x = 100;
    this.repairedScore.y = 200;
    this.game.stage.addChild(this.repairedScore);
}
