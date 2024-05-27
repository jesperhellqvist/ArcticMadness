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
  this.countDown = null;
  this.gameStartTimer = null;
  this.connectedGamepads = [];
  this.colors = [
    { r: 133, g: 144, b: 255 }, // Player 1 orignal Blue
    { r: 244, g: 40, b: 45 }, // Player 2 Red
    { r: 16, g: 152, b: 86 }, // Player 3 Green
    { r: 255, g: 250, b: 5 }, // Player 4 Yellow
  ];
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
  this.cameras.getCameraAt(0).fade.opacity = 1;
  this.cameras.getCameraAt(0).fade.in(1000);
  this.m_initBackground();
  this.m_initAnimations();
};

ArcticMadness.scene.JoinGame.prototype.update = function (step) {
  rune.scene.Scene.prototype.update.call(this, step);
  this.m_playerJoinGame();
};

ArcticMadness.scene.JoinGame.prototype.dispose = function () {
  this.stage.removeChild(this.background, true);
  this.stage.removeChild(this.background2, true);
  this.stage.removeChild(this.background3, true);
  this.stage.removeChild(this.background4, true);
  this.stage.removeChild(this.howTo, true);
  this.stage.removeChild(this.player, true);
  this.stage.removeChild(this.player2, true);
  this.stage.removeChild(this.player3, true);
  this.stage.removeChild(this.player4, true);
  this.colors = null;
  this.connectedGamepads = null;
  this.menuSound = null;
  rune.scene.Scene.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Privat prototype methods
//------------------------------------------------------------------------------

ArcticMadness.scene.JoinGame.prototype.m_initBackground = function () {
  this.background1 = new rune.display.Sprite(0, 0, 640, 360, "join_graphics");

  this.background2 = new rune.display.Sprite(640, 0, 640, 360, "join_graphics");

  this.background3 = new rune.display.Sprite(0, 360, 640, 360, "join_graphics");

  this.background4 = new rune.display.Sprite(
    640,
    360,
    640,
    360,
    "join_graphics"
  );

  this.howTo = new rune.display.Sprite(30, 20, 220, 220, "how_to");

  this.stage.addChild(this.background1);
  this.stage.addChild(this.background2);
  this.stage.addChild(this.background3);
  this.stage.addChild(this.background4);
};

ArcticMadness.scene.JoinGame.prototype.m_initAnimations = function () {
  this.background1.animation.create("play", [0, 1], 2, true);
  this.background1.animation.gotoAndPlay("play");
  this.background2.animation.create("play", [0, 1], 2, true);
  this.background2.animation.gotoAndPlay("play");
  this.background3.animation.create("play", [0, 1], 2, true);
  this.background3.animation.gotoAndPlay("play");
  this.background4.animation.create("play", [0, 1], 2, true);
  this.background4.animation.gotoAndPlay("play");

  this.background1.animation.create("ice", [2], 4, false);
  this.background2.animation.create("ice", [2], 4, false);
  this.background3.animation.create("ice", [2], 4, false);
  this.background4.animation.create("ice", [2], 4, false);
  this.howTo.animation.create(
    "move",
    [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 11, 11, 11, 10, 12, 13, 13, 12, 13, 13],
    4,
    true
  );
};

ArcticMadness.scene.JoinGame.prototype.m_playerJoinGame = function () {
  var positions = [
    { x: 320, y: 180 },
    { x: 930, y: 180 },
    { x: 320, y: 540 },
    { x: 930, y: 540 },
  ];

  for (var i = 0; i < 4; i++) {
    if (
      this.gamepads.get(i).justPressed(0) &&
      this.connectedGamepads.indexOf(i) === -1
    ) {
      this.connectedGamepads.push(i);
      var color = this.colors[this.connectedGamepads.length - 1];
      var player = new ArcticMadness.entity.Player(
        positions[i].x,
        positions[i].y,
        "penguin_texture_64x64",
        color,
        this.gamepads.get(i),
        i
      );
      this.stage.addChild(player);
      this.m_startGameTimer();
      this["background" + (i + 1)].animation.gotoAndStop("ice");
      if (i === 0) {
        this.stage.addChild(this.howTo);
      }
    }
  }
};

ArcticMadness.scene.JoinGame.prototype.m_startGameTimer = function () {
  if (this.gameStartTimer) {
    this.gameStartTimer.dispose();
    this.gameStartTimer = null;
  }

  this.m_initCountDown();

  this.gameStartTimer = this.timers.create({
    duration: 10000,
    onComplete: function () {
      this.menuSound.fade(0, 3000);
      this.application.scenes.load([
        new ArcticMadness.scene.Game(
          this.connectedGamepads.length,
          this.menuSound,
          this.connectedGamepads
        ),
      ]);
    },
    scope: this,
  });
};

ArcticMadness.scene.JoinGame.prototype.m_initCountDown = function () {
  if (this.countDown !== null) {
    this.stage.removeChild(this.countDown, true);
    this.countDown = null;
  }

  this.countDown = new ArcticMadness.entity.CountDown(this);
  this.stage.addChild(this.countDown);
  this.countDown.playCountDown10();
};
