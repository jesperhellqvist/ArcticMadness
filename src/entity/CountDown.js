//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.CountDown = function (context) {
  this.context = context;
  rune.display.Sprite.call(this, 500, 100, 12, 16, "thefont");
};

ArcticMadness.entity.CountDown.prototype = Object.create(
  rune.display.Sprite.prototype
);
ArcticMadness.entity.CountDown.prototype.constructor =
  ArcticMadness.entity.CountDown;

ArcticMadness.entity.CountDown.prototype.init = function () {
  rune.display.Sprite.prototype.init.call(this);
  console.log("init");
  this.animation.create("3-1", [19, 18, 17], 1, false);
  this.animation.create(
    "10-1",
    [25, 24, 23, 22, 21, 20, 19, 18, 17, 16],
    1,
    false
  );
  this.m_setPosition();
};

ArcticMadness.entity.CountDown.prototype.update = function (step) {
  rune.display.Sprite.prototype.update.call(this, step);
};

ArcticMadness.entity.CountDown.prototype.dispose = function () {
  rune.display.Sprite.prototype.dispose.call(this);
};

ArcticMadness.entity.CountDown.prototype.playCountDown3 = function () {
  this.animation.gotoAndPlay("3-1");
};

ArcticMadness.entity.CountDown.prototype.playCountDown10 = function () {
  this.animation.gotoAndPlay("10-1");
};

ArcticMadness.entity.CountDown.prototype.m_setPosition = function () {
    this.x = this.application.screen.width / 2;
    this.y = this.application.screen.height / 2;
  this.scaleX = 4;
  this.scaleY = 4;
};
