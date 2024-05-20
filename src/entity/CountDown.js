//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.entity.CountDown = function (context) {
  this.context = context;
  rune.display.Sprite.call(this, 0, 0, 0, 0, "");
};

ArcticMadness.entity.CountDown.prototype = Object.create(
  rune.display.Sprite.prototype
);
ArcticMadness.entity.CountDown.prototype.constructor =
  ArcticMadness.entity.CountDown;

ArcticMadness.entity.CountDown.prototype.init = function () {
  rune.display.Sprite.prototype.init.call(this);
};

ArcticMadness.entity.CountDown.prototype.update = function (step) {
    rune.display.Sprite.prototype.update.call(this, step);
    };

ArcticMadness.entity.CountDown.prototype.dispose = function () {
    rune.display.Sprite.prototype.dispose.call(this);
    };
