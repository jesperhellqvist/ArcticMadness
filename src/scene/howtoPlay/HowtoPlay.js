//--------------------------------
// Constructor scope
//--------------------------------

/**
 * This class represents the how to play scene.
 * @constructor
 * @extends {rune.scene.Scene}
 *
 */

ArcticMadness.scene.HowtoPlay = function () {
  this.howto_bg = null;
  this.pointsText = null;
  this.descriptionText = null;
  this.controller = null;
  this.backToMenu = null;

  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------
  rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.scene.HowtoPlay.prototype = Object.create(
  rune.scene.Scene.prototype
);
ArcticMadness.scene.HowtoPlay.prototype.constructor =
  ArcticMadness.scene.HowtoPlay;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * @inheritDoc
 * @override
 */

ArcticMadness.scene.HowtoPlay.prototype.init = function () {
  rune.scene.Scene.prototype.init.call(this);
  this.cameras.getCameraAt(0).fade.opacity = 1;
  this.cameras.getCameraAt(0).fade.in(300);
  this.m_createBackground();
  this.m_createUI();
  this.m_createControlAnimations();
  this.m_createDescription();
};

/**
 * @inheritDoc
 * @override
 * @param {number} step Current step.
 */

ArcticMadness.scene.HowtoPlay.prototype.update = function (step) {
  rune.scene.Scene.prototype.update.call(this, step);
  if (this.gamepads.get(0).justPressed(1)) {
    this.cameras.getCameraAt(0).fade.out(
      300,
      function () {
        this.application.scenes.load([new ArcticMadness.scene.Menu()]);
      },
      this
    );
  }
};

/**
 * @inheritDoc
 * @override
 */

ArcticMadness.scene.HowtoPlay.prototype.dispose = function () {
  this.stage.removeChild(this.backToMenu, true);
  this.stage.removeChild(this.controller, true);
  this.stage.removeChild(this.descriptionText, true);
  this.stage.removeChild(this.pointsText, true);
  this.stage.removeChild(this.howto_bg, true);
  rune.scene.Scene.prototype.dispose.call(this);
};
//------------------------------------------------------------------------------
//Private prototype methods
//------------------------------------------------------------------------------

/**
 * This method creates the background.
 * @returns {undefined}
 * @private
 */
ArcticMadness.scene.HowtoPlay.prototype.m_createBackground = function () {
  this.howto_bg = new rune.display.Graphic(
    0,
    0,
    this.application.screen.width,
    this.application.screen.height,
    "howto_bg2"
  );
  this.stage.addChild(this.howto_bg);
};

/**
 * This method creates the UI.
 * @returns {undefined}
 * @private
 */

ArcticMadness.scene.HowtoPlay.prototype.m_createUI = function () {
  this.backToMenu = new rune.display.Sprite(50, 20, 220, 220, "how_to");
  this.backToMenu.animation.create("button", [14, 15], 4, true);
  this.backToMenu.animation.gotoAndPlay("button");
  this.backToMenu.scaleX = 0.5;
  this.backToMenu.scaleY = 0.5;
  this.stage.addChild(this.backToMenu);
};

/**
 * This method creates the control animations.
 * @returns {undefined}
 * @private
 */

ArcticMadness.scene.HowtoPlay.prototype.m_createControlAnimations =
  function () {
    this.controller = new rune.display.Sprite(
      570,
      170,
      800,
      400,
      "howtoanimation"
    );
    this.controller.animation.create(
      "controls",
      [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 40, 41, 42, 43,
      ],
      8,
      true
    );
    this.controller.animation.gotoAndPlay("controls");
    this.stage.addChild(this.controller);
  };

/**
 * This method creates the description.
 * @returns {undefined}
 * @private
 */

ArcticMadness.scene.HowtoPlay.prototype.m_createDescription = function () {
  // Description text
  this.descriptionText = new rune.ui.VTList("thefont");
  this.descriptionText.padding = 15;
  this.descriptionText.align = rune.ui.VTList.ALIGN_LEFT;
  this.descriptionText.add("ARCTIC MADNESS IS A SURVIVOR GAME");
  this.descriptionText.add("REPAIR THE CRACKS SO THE ICE DOESNT BREAK");
  this.descriptionText.add("AVOID THE WATER AND THE ENEMIES");
  this.descriptionText.add("SHOOT THE ENEMIES WITH YOUR FISH GUN");
  this.descriptionText.add("HELP YOUR FRIENDS IF THEY FALL IN THE WATER");
  this.descriptionText.x = 25;
  this.descriptionText.y = 200;
  this.stage.addChild(this.descriptionText);

  // Points text
  this.pointsText = new rune.ui.VTList("thefont");
  this.pointsText.padding = 15;
  this.pointsText.align = rune.ui.VTList.ALIGN_LEFT;
  this.pointsText.add("    HOW TO SCORE POINTS");
  this.pointsText.add("$ REPAIRED CRACK ; $# POINTS");
  this.pointsText.add("$ KILLED ENEMY   ;  % POINTS");
  this.pointsText.add("$ SECOND ALIVE   ;  $ POINTS");
  this.pointsText.x = 20;
  this.pointsText.y = 450;
  this.pointsText.scaleX = 1.5;
  this.pointsText.scaleY = 1.5;
  this.stage.addChild(this.pointsText);
};
