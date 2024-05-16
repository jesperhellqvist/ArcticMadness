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
  this.moveSound = this.application.sounds.sound.get("shoot");
  this.chooseSound = this.application.sounds.sound.get("repaircomplete");
  this.menuSound = this.application.sounds.master.get("lobby");
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

  //Start menu
  if (!this.multiplayerMenu) {
    if (this.gamepads.get(0).justPressed(12)) {
      this.moveSound.play();
      this.moveSound.loop = false;
      if (this.menu.up()) {
      }
    }

    if (this.gamepads.get(0).justPressed(13)) {
      this.moveSound.play();
      this.moveSound.loop = false;
      if (this.menu.down()) {
      }
    }

    if (this.gamepads.get(0).justPressed(0)) {
      this.menu.select();
    }
  }

  // Multiplayer menu
  if (this.multiplayerMenu) {
    // Check if multiplayerMenu exists
    if (this.gamepads.get(0).justPressed(12)) {
      this.moveSound.play();
      this.moveSound.loop = false;
      if (this.multiplayerMenu.up()) {
      }
    }

    if (this.gamepads.get(0).justPressed(13)) {
      this.moveSound.play();
      this.moveSound.loop = false;
      if (this.multiplayerMenu.down()) {
      }
    }

    if (this.gamepads.get(0).justPressed(0)) {
      this.multiplayerMenu.select();
    }
  }

  //Temporary go back to menu when pressing ("b" on the controller, square, X on xbox)
  if (this.gamepads.get(0).justPressed(2)) {
    this.stage.removeChild(this.controller_bg);
    this.stage.removeChild(this.highscore_bg);
    this.stage.removeChild(this.highscoreText);
    this.stage.removeChild(this.hs1.highscoreList);
    this.stage.removeChild(this.hs2.highscoreList);
    this.stage.removeChild(this.hs3.highscoreList);
    this.stage.removeChild(this.hs4.highscoreList);
    this.stage.addChild(this.menu);
  }

  if (this.divingPenguin.y == 600 && this.divingPenguin.x == -500) {
    this.divingPenguin.y = 500;
  } else if (this.divingPenguin.x >= 600) {
    this.divingPenguin.velocity.x = 0;
    this.createDivingTween();
  }
};

ArcticMadness.scene.Menu.prototype.dispose = function () {
  console.log("dispose");
  this.stage.removeChild(this.menu);
  this.stage.removeChild(this.highscoreText);
  this.stage.removeChild(this.divingPenguin);
  this.stage.removeChild(this.background);
  this.stage.removeChild(this.controller_bg);
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
      onDispose: function (divingPenguin) {
        this.splashEffect = this.application.sounds.sound.get("Splash");
        this.splashEffect.play();
        this.splashEffect.loop = false;
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
    "64_penguin_nogun"
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
    resource: "thefont",
    duration: 1000,
    frequency: 100,
  });
  this.menu.add("START GAME");
  this.menu.add("HOW TO PLAY");
  this.menu.add("HIGHSCORE");

  this.menu.x = 200;
  this.menu.y = 210;
  this.menu.scaleX = 2;
  this.menu.scaleY = 2;
  this.menu.onSelect(this.selectOption, this);
  this.stage.addChild(this.menu);
};

ArcticMadness.scene.Menu.prototype.m_highscoreList = function () {
  this.highscoreList = new rune.ui.VTList("thefont");
  this.highscoreList.add("highscores");
  for (var i = 0; i < 5; i++) {
    var score = this.application.highscores.get(i, 0);
    console.log(score);
    this.highscoreList.add(score.name + " " + score.score);
  }
  this.highscoreList.x = 850;
  this.highscoreList.y = 280;
  this.highscoreList.scaleX = 2;
  this.highscoreList.scaleY = 2;
  this.stage.addChild(this.highscoreList);
};

ArcticMadness.scene.Menu.prototype.m_initSound = function () {
  this.menuSound.play();
  this.menuSound.loop = true;
};

//Method to select the option
ArcticMadness.scene.Menu.prototype.selectOption = function (option) {
  switch (option.text) {
    case "START GAME":
      this.application.scenes.load([
        new ArcticMadness.scene.JoinGame(this.menuSound),
      ]);
      break;
    case "HOW TO PLAY":
      this.controller_bg = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "controller_bg"
      );
      this.stage.addChild(this.controller_bg);
      this.stage.removeChild(this.menu);

      break;
    case "HIGHSCORE":
      this.m_initHighscore();
      break;
  }
};

ArcticMadness.scene.Menu.prototype.m_initHighscore = function () {
  this.highscore_bg = new rune.display.Graphic(
    0,
    0,
    this.application.screen.width,
    this.application.screen.height,
    "highscores_bg"
  );
  this.stage.addChild(this.highscore_bg);
  this.stage.removeChild(this.menu);
  this.init_hs1();
  this.init_hs2();
  this.init_hs3();
  this.init_hs4();
};

ArcticMadness.scene.Menu.prototype.init_hs1 = function () {
  this.hs1 = new ArcticMadness.entity.HighscoreList("singeplayer", 0, this, 100, 100);
  this.hs1.x = 35;
    this.hs1.y = 270;
 
  this.stage.addChild(this.hs1);
};

ArcticMadness.scene.Menu.prototype.init_hs2 = function () {
  this.hs2 = new ArcticMadness.entity.HighscoreList("2 players", 1, this, 300, 100);
    this.hs2.x = 370;
    this.hs2.y = 270;
  this.stage.addChild(this.hs2);
};

ArcticMadness.scene.Menu.prototype.init_hs3 = function () {
  this.hs3 = new ArcticMadness.entity.HighscoreList("3 players", 2, this, 500, 100);
  this.hs3.x = 690;
  this.hs3.y = 270;
  this.stage.addChild(this.hs3);
};

ArcticMadness.scene.Menu.prototype.init_hs4 = function () {
  this.hs4 = new ArcticMadness.entity.HighscoreList("4 players", 3, this, 700, 100);
  this.hs4.x = 1000;
  this.hs4.y = 270;
  this.stage.addChild(this.hs4);
};
