//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.HighscoreList = function (title, tableID, menu, x, y) {
  this.title = title;
  this.tableID = tableID;
  this.menu = menu;
  this.highscoreList = null;
    this.x = x;
    this.y = y;

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

ArcticMadness.entity.HighscoreList.prototype.init = function () {
  rune.ui.VTList.prototype.init.call(this);
  this.m_createTable();
};

//------------------------------------------------------------------------------

ArcticMadness.entity.HighscoreList.prototype.update = function (step) {
  rune.ui.VTList.prototype.update.call(this, step);
};

//------------------------------------------------------------------------------

ArcticMadness.entity.HighscoreList.prototype.dispose = function () {
  rune.ui.VTList.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------

ArcticMadness.entity.HighscoreList.prototype.m_createTable = function () {
  this.highscoreList = new rune.ui.VTList("thefont");
  this.highscoreList.add(this.title);
  for (var i = 0; i < 5; i++) {
    var score = this.application.highscores.get(i, this.tableID);
    console.log(score);
    this.highscoreList.add(score.name + " " + score.score);
  }
    this.highscoreList.x = this.x;
    this.highscoreList.y = this.y;
  this.highscoreList.scaleX = 2;
  this.highscoreList.scaleY = 2;
  this.menu.stage.addChild(this.highscoreList);
};