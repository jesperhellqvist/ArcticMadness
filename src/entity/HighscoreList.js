//--------------------------------
// Constructor scope
//--------------------------------

/**
 * Creates a new instance of the HighscoreList class.
 * @constructor
 * @param {string} title The title of the highscore list.
 * @param {number} tableID The table ID.
 * @param {ArcticMadness.scene.Menu} menu The menu object.
 * @param {number} x The x position of the highscore list.
 * @param {number} y The y position of the highscore list.
 * @param {number} titleX The x position of the title.
 * @param {number} titleY The y position of the title.
 * @returns {undefined}
 * @extends {rune.ui.VTList}
 * @class
 */

ArcticMadness.entity.HighscoreList = function (
  title,
  tableID,
  menu,
  x,
  y,
  titleX,
  titleY
) {
  this.title = title;
  this.tableID = tableID;
  this.menu = menu;
  this.highscoreList = null;
  this.x = x;
  this.y = y;
  this.titleX = titleX;
  this.titleY = titleY;
  this.text = null;
  this.highscoreList = null;

  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  rune.ui.VTList.call(this, "thefont");
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.entity.HighscoreList.prototype = Object.create(
  rune.ui.VTList.prototype
);
ArcticMadness.entity.HighscoreList.prototype.constructor =
  ArcticMadness.entity.HighscoreList;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated.
 * @returns {undefined}
 */

ArcticMadness.entity.HighscoreList.prototype.init = function () {
  rune.ui.VTList.prototype.init.call(this);
  this.m_createTable();
  this.m_createTitle();
};

/**
 * Removes the highscore list from the stage.
 * @returns {undefined}
 */

ArcticMadness.entity.HighscoreList.prototype.dispose = function () {
  this.menu.stage.removeChild(this.highscoreList, true);
  this.menu.stage.removeChild(this.text, true);
  this.menu = null;
  rune.ui.VTList.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Private prototype methods
//------------------------------------------------------------------------------

/**
 * Creates the title of the highscore list.
 * @returns {undefined}
 */

ArcticMadness.entity.HighscoreList.prototype.m_createTitle = function () {
  this.text = new rune.text.BitmapField(this.title, "thefont");
  this.text.autoSize = true;
  this.text.x = this.titleX;
  this.text.y = this.titleY;
  this.text.scaleX = 2;
  this.text.scaleY = 2;
  this.menu.stage.addChild(this.text);
};

/**
 * Creates the highscore list.
 * @returns {undefined}
 */

ArcticMadness.entity.HighscoreList.prototype.m_createTable = function () {
  this.highscoreList = new rune.ui.VTList("thefont");
  this.highscoreList.align = rune.ui.VTList.ALIGN_LEFT;
  this.highscoreList.padding = 10;

  var scoreAdded = false;

  for (var i = 0; i < 5; i++) {
    var score = this.application.highscores.get(i, this.tableID);
    if (score.name == "Rune") {
      // Om någon inte har skrivit sitt namn
      score.name = "henke";
    }
    this.listItem = score.name + score.score;
    var space = "";

    while ((this.listItem + space).length < 11) {
      space += " ";
    }

    // If the score is 0, continue to the next iteration
    if (score.score == 0) {
      continue;
    }

    this.highscoreList.add(score.name + space + score.score);
    scoreAdded = true;
  }

  // If no score was added, add "no scores"
  if (!scoreAdded) {
    this.highscoreList.add("no scores");
  }

  this.highscoreList.x = this.x;
  this.highscoreList.y = this.y;
  this.highscoreList.scaleX = 1.8;
  this.highscoreList.scaleY = 1.8;
  this.menu.stage.addChild(this.highscoreList);
};
