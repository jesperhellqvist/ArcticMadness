//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Creates a new object.
 *
 * @constructor
 * @extends rune.scene.Scene
 *
 * @class
 * @classdesc
 *
 * Game state.
 */

ArcticMadness.scene.Menu = function () {
  this.moveSound = null;
  this.chooseSound = null;
  this.menuSound = null;
  this.menu = null;
  this.highscoreList = null;
  this.controller_bg = null;
  this.highscore_bg = null;
  this.highscoreText = null;
  this.hs1 = null;
  this.hs2 = null;
  this.hs3 = null;
  this.hs4 = null;
  this.highscoreX = 0;
  this.highscoreY = 0;
  this.currentIndex = 0;
  this.highscores = null;

  rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.scene.Menu.prototype = Object.create(rune.scene.Scene.prototype);
ArcticMadness.scene.Menu.prototype.constructor = ArcticMadness.scene.Menu;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * @inheritDoc
 */

ArcticMadness.scene.Menu.prototype.init = function () {
  rune.scene.Scene.prototype.init.call(this);
  this.cameras.getCameraAt(0).fade.opacity = 1;
  this.cameras.getCameraAt(0).fade.in(300);
  this.m_initBackground();
  this.m_initAnimations();
  this.m_initMenu();
  this.m_highscoreList();
  this.m_initSound();

};

/**
 * @inheritDoc
 */

ArcticMadness.scene.Menu.prototype.update = function (step) {
  rune.scene.Scene.prototype.update.call(this, step);

  //Controller input
  if (this.gamepads.get(0).justPressed(12)||this.gamepads.get(0).stickLeftJustUp) {
    this.moveSound.play();
    this.moveSound.loop = false;
    if (this.menu.up()) {
    }
  }

  if (this.gamepads.get(0).justPressed(13)||this.gamepads.get(0).stickLeftJustDown) {
    this.moveSound.play();
    this.moveSound.loop = false;
    if (this.menu.down()) {
    }
  }

  if (this.gamepads.get(0).justPressed(0)) {
    this.menu.select();
    this.chooseSound.play();
    this.chooseSound.loop = false;
  }


  //diving penguin animation on homescreen
  if (this.divingPenguin.y == 600 && this.divingPenguin.x == -500) {
    this.divingPenguin.y = 500;
  } else if (this.divingPenguin.x >= 600) {
    this.divingPenguin.velocity.x = 0;
    this.createDivingTween();
  }

};


//Kolla igenom så dessa inte är har "gamla" metoder som inte används, och är flyttade till ny scene
ArcticMadness.scene.Menu.prototype.dispose = function () {
  console.log("dispose");
  this.stage.removeChild(this.menu, true);
  this.stage.removeChild(this.highscoreText, true);
  this.stage.removeChild(this.divingPenguin, true);
  this.stage.removeChild(this.background, true);
  this.stage.removeChild(this.controller_bg, true);
  this.stage.removeChild(this.hs1, true);
  this.stage.removeChild(this.hs2, true);
  this.stage.removeChild(this.hs3, true);
  this.stage.removeChild(this.hs4, true);
  this.stage.removeChild(this.highscore_bg);
  rune.scene.Scene.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------

ArcticMadness.scene.Menu.prototype.createDivingTween = function () {
  if (!this.divingTweenActive) {
    this.divingTweenActive = true;
    this.divingPenguin.animation.gotoAndPlay("diving", 0);
    this.tweens.create({
      target: this.divingPenguin,
      scope: this,
      duration: 550,
      onUpdate: function () {
        this.splashEffect = this.application.sounds.sound.get("Splash");
        this.splashEffect.play();
        this.splashEffect.loop = false;

      },
      onDispose: function (divingPenguin) {
        this.divingTweenActive = false;
        divingPenguin.x = -500;
        this.divingPenguin.velocity.x = 2;
        this.divingPenguin.animation.gotoAndPlay("walking");
      },
      args: {
        x: 650,
        y: this.divingPenguin.y + 20,
      },
    });
  }
};

ArcticMadness.scene.Menu.prototype.m_initBackground = function () {
  this.background = new rune.display.Graphic(
    0,
    0,
    this.application.screen.width,
    this.application.screen.height,
    "menu_bg"
  );
  this.stage.addChild(this.background);
  this.divingPenguin = new rune.display.Sprite(
    -50,
    500,
    64,
    64,
    "penguin_texture_64x64"
  );
  this.stage.addChild(this.divingPenguin);
};

//------------------------------------------------------------------------------

ArcticMadness.scene.Menu.prototype.m_initAnimations = function () {
  this.divingPenguin.animation.create("walking", [5, 6, 7, 8], 8, true);
  this.divingPenguin.animation.create("diving", [25, 26, 27, 28, 29], 9, false);
  this.divingPenguin.animation.create(
    "splashing",
    [30, 31, 30, 31, 42],
    8,
    true
  );
  this.divingPenguin.velocity.x = 2;
};

//Method to initialize the menu
ArcticMadness.scene.Menu.prototype.m_initMenu = function () {
  this.menu = new rune.ui.VTMenu({
    pointer: ArcticMadness.entity.Pointer,
    resource: "thefont",
    duration: 1000,
    frequency: 100,
  });
  this.menu.add("START GAME");
  this.menu.add("HOW TO PLAY");
  this.menu.add("HIGHSCORE");
  this.menu.add("CREDITS");

  this.menu.x = 200;
  this.menu.y = 210;
  this.menu.scaleX = 2;
  this.menu.scaleY = 2;
  this.menu.onSelect(this.selectOption, this);
  this.stage.addChild(this.menu);
};

ArcticMadness.scene.Menu.prototype.m_highscoreList = function () {
  this.highscoreX = 850;
  this.highscoreY = 300;
  this.highscores = [
    this.hs1 = new ArcticMadness.entity.HighscoreList("$ PLAYER", 0, this, 100, 100, 850, 200),
    this.hs2 = new ArcticMadness.entity.HighscoreList("% PLAYERS", 1, this, 300, 100, 850, 200),
    this.hs3 = new ArcticMadness.entity.HighscoreList("& PLAYERS", 2, this, 500, 100, 850, 200),
    this.hs4 = new ArcticMadness.entity.HighscoreList("' PLAYERS", 3, this, 700, 100, 850, 200),
  ];
  this.highscores[this.currentIndex].x = this.highscoreX;
  this.highscores[this.currentIndex].y = this.highscoreY;
  this.stage.addChild(this.highscores[this.currentIndex]);

  this.highscoreSlide = this.timers.create({
    duration: 3000,
    repeat: Infinity,
    scope: this,
    onTick: function () {
      this.stage.removeChild(this.highscores[this.currentIndex].highscoreList, true);
      this.stage.removeChild(this.highscores[this.currentIndex].text, true);
      this.currentIndex++;
      if (this.currentIndex > 3) {
        this.currentIndex = 0;
      }
      this.highscores[this.currentIndex].x = this.highscoreX;
      this.highscores[this.currentIndex].y = this.highscoreY;
      this.stage.addChild(this.highscores[this.currentIndex]);
    },
  });

};


ArcticMadness.scene.Menu.prototype.m_initSound = function () {
  this.menuSound = this.application.sounds.master.get("lobby");
  this.menuSound.play();
  this.menuSound.loop = true;
  this.moveSound = this.application.sounds.sound.get("shoot");
  this.chooseSound = this.application.sounds.sound.get("repaircomplete");
};

//Method to select the option
ArcticMadness.scene.Menu.prototype.selectOption = function (option) {
  switch (option.text) {
    case "START GAME":
      this.cameras.getCameraAt(0).fade.out(800, function () {
        this.application.scenes.load([
          new ArcticMadness.scene.JoinGame(this.menuSound),
        ]);
      }, this);

      break;
    case "HOW TO PLAY":
      this.cameras.getCameraAt(0).fade.out(300, function () {
        this.application.scenes.load([
          new ArcticMadness.scene.HowtoPlay(),
        ]);
      }, this);
      break;
    case "HIGHSCORE":
      this.cameras.getCameraAt(0).fade.out(300, function () {
        this.application.scenes.load([
          new ArcticMadness.scene.Highscores(),
        ]);
      }, this);
      break;
    case "CREDITS":
      console.log("CREDITS, visa ljudskapare, samt mig o jepa")
      break;
  }
};

