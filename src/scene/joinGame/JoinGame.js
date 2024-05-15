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

ArcticMadness.scene.JoinGame = function (menuSound) {
  this.background = null;
  this.background2 = null;
  this.background3 = null;
  this.background4 = null;
  this.player = null;
  this.player2 = null;
  this.player3 = null;
  this.player4 = null;
  this.gameStartTimer = null;
  this.connectedGamepads = [];
  this.menuSound = menuSound;
  rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.scene.JoinGame.prototype = Object.create(
  rune.scene.Scene.prototype
);
ArcticMadness.scene.JoinGame.prototype.constructor =
  ArcticMadness.scene.JoinGame;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * @inheritDoc
 */

ArcticMadness.scene.JoinGame.prototype.init = function () {
  rune.scene.Scene.prototype.init.call(this);
  this.m_initBackground();
  this.m_initAnimations();
};

ArcticMadness.scene.JoinGame.prototype.update = function (step) {
  rune.scene.Scene.prototype.update.call(this, step);
  this.m_playerJoinGame();
};

ArcticMadness.scene.JoinGame.prototype.dispose = function () {
  console.log("dispose");
  this.stage.removeChild(this.background, true);
  this.stage.removeChild(this.background2, true);
  this.stage.removeChild(this.background3, true);
  this.stage.removeChild(this.background4,  true);
  this.stage.removeChild(this.howTo, true);
  this.stage.removeChild(this.player, true);
  this.stage.removeChild(this.player2, true);
  this.stage.removeChild(this.player3, true);
  this.stage.removeChild(this.player4, true);
  rune.scene.Scene.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Privat prototype methods
//------------------------------------------------------------------------------

ArcticMadness.scene.JoinGame.prototype.m_initBackground = function () {
  this.background = new rune.display.Sprite(0, 0, 640, 360, "join_graphics");

  this.background2 = new rune.display.Sprite(640, 0, 640, 360, "join_graphics");

  this.background3 = new rune.display.Sprite(0, 360, 640, 360, "join_graphics");

  this.background4 = new rune.display.Sprite(
    640,
    360,
    640,
    360,
    "join_graphics"
  );

  this.howTo= new rune.display.Sprite(30, 20, 220, 220, "how_to");

  this.stage.addChild(this.background);
  this.stage.addChild(this.background2);
  this.stage.addChild(this.background3);
  this.stage.addChild(this.background4);
};

ArcticMadness.scene.JoinGame.prototype.m_initAnimations = function () {
  this.background.animation.create("play", [0, 1], 4, true);
  this.background.animation.gotoAndPlay("play");
  this.background2.animation.create("play", [0, 1], 4, true);
  this.background2.animation.gotoAndPlay("play");
  this.background3.animation.create("play", [0, 1], 4, true);
  this.background3.animation.gotoAndPlay("play");
  this.background4.animation.create("play", [0, 1], 4, true);
  this.background4.animation.gotoAndPlay("play");

  this.background.animation.create("ice", [2], 4, false);
  this.background2.animation.create("ice", [2], 4, false);
  this.background3.animation.create("ice", [2], 4, false);
  this.background4.animation.create("ice", [2], 4, false);
  this.howTo.animation.create("move", [0,1,2,3,5,6,7,8,9,10,11,11,11,11,10,12,13,13,12,13,13], 4, true);
};

ArcticMadness.scene.JoinGame.prototype.m_playerJoinGame = function () {
  if (
    this.gamepads.get(0).justPressed(0) &&
    !this.connectedGamepads.includes(0)
  ) {
    this.connectedGamepads.push(0);
    this.player = new ArcticMadness.entity.Player(
      320,
      180,
      "64_penguin_nogun",
      {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
      },
      {
        left: "A",
        right: "D",
        up: "W",
        down: "S",
        shoot: "SPACE",
      },
      this.gamepads.get(0),
      0
    );
    this.stage.addChild(this.player);
    this.m_startGameTimer();
    this.background.animation.gotoAndStop("ice");
    this.stage.addChild(this.howTo);
  }
  if (
    this.gamepads.get(1).justPressed(0) &&
    !this.connectedGamepads.includes(1)
  ) {
    this.connectedGamepads.push(1);
    this.player2 = new ArcticMadness.entity.Player(
      930,
      180,
      "64_penguin_nogun",
      {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
      },
      {
        left: "LEFT",
        right: "RIGHT",
        up: "UP",
        down: "DOWN",
        shoot: "ENTER",
      },
      this.gamepads.get(1),
      1
    );
    this.stage.addChild(this.player2);
    this.m_startGameTimer();
    this.background2.animation.gotoAndStop("ice");
  }
  if (
    this.gamepads.get(2).justPressed(0) &&
    !this.connectedGamepads.includes(2)
  ) {
    this.connectedGamepads.push(2);
    this.player3 = new ArcticMadness.entity.Player(
      320,
      540,
      "64_penguin_nogun",
      {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
      },
      {
        left: "J",
        right: "L",
        up: "I",
        down: "K",
        shoot: "O",
      },
      this.gamepads.get(2),
      2
    );
    this.stage.addChild(this.player3);
    this.m_startGameTimer();
    this.background3.animation.gotoAndStop("ice");
  }
  if (
    this.gamepads.get(3).justPressed(0) &&
    !this.connectedGamepads.includes(3)
  ) {
    this.connectedGamepads.push(3);
    this.player4 = new ArcticMadness.entity.Player(
      930,
      540,
      "64_penguin_nogun",
      {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
      },
      {
        left: "N",
        right: "M",
        up: "U",
        down: "H",
        shoot: "Y",
      },
      this.gamepads.get(3),
      3
    );
    this.stage.addChild(this.player4);
    this.m_startGameTimer();
    this.background4.animation.gotoAndStop("ice");
  }
};

ArcticMadness.scene.JoinGame.prototype.m_startGameTimer = function () {
  if (this.gameStartTimer) {
    this.gameStartTimer.dispose();
    this.gameStartTimer = null;
  }

  this.gameStartTimer = this.timers.create({
    duration: 5000,
    onComplete: function () {
      this.menuSound.fade();
      this.application.scenes.load([
        new ArcticMadness.scene.Game(this.connectedGamepads.length,this.menuSound),
      ]);
    },
    scope: this,
  });
};
