//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.HighscoreList = function (title, tableID, menu, x, y, titleX, titleY) {
  this.title = title;
  this.tableID = tableID;
  this.menu = menu;
  this.highscoreList = null;
  this.x = x;
  this.y = y;
  this.titleX = titleX;
  this.titleY = titleY;

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
  this.m_createTitle();
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

ArcticMadness.entity.HighscoreList.prototype.m_createTitle = function () {
  this.text = new rune.text.BitmapField(
    this.title,
    "thefont"
  );
  this.text.autoSize = true;
  this.text.x = this.titleX;
  this.text.y = this.titleY;
  this.text.scaleX = 2;
  this.text.scaleY = 2;
  this.menu.stage.addChild(this.text);
}

ArcticMadness.entity.HighscoreList.prototype.m_createTable = function () {
  this.highscoreList = new rune.ui.VTList("thefont");
  this.highscoreList.align = rune.ui.VTList.ALIGN_LEFT;
  this.highscoreList.padding = 10;

  for (var i = 0; i < 5; i++) {
    var score = this.application.highscores.get(i, this.tableID);
    this.listItem = score.name + score.score;
    var space = "";
    while ((this.listItem + space).length < 11) {
      space += " ";
    }  
    if (score.name == "Rune") {
      score.name = "henke";
    }
    if (i == 0 && score.score == 0) {
      score.name = "no scores";
      score.score = "";
      this.highscoreList.add(this.listItem);
      break;
    }
  


    this.highscoreList.add(score.name + space + score.score);

  }
  this.highscoreList.x = this.x;
  this.highscoreList.y = this.y;
  this.highscoreList.scaleX = 1.8;
  this.highscoreList.scaleY = 1.8;
  this.menu.stage.addChild(this.highscoreList);
};
