//--------------------------------
// Constructor scope
//--------------------------------

/**
 * Creates a new object.
 *
 * @constructor
 * @extends rune.display.DisplayGroup
 * @param {rune.game.Game} game Reference to the current game object.
 *
 * @class
 * @classdesc
 *
 * Represents a group of players.
 
 */

ArcticMadness.entity.Players = function (game) {
  this.game = game;

  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  rune.display.DisplayGroup.call(this, this.game.stage);

  this.init();
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.entity.Players.prototype = Object.create(rune.display.DisplayGroup.prototype);
ArcticMadness.entity.Players.prototype.constructor = ArcticMadness.entity.Players;

//------------------------------------------------------------------------------
// Public prototype methods

/**
 * Initializes the object.
 *  
 * @returns {undefined}
 */

ArcticMadness.entity.Players.prototype.init = function () {
  rune.display.DisplayGroup.prototype.init.call(this);
  console.log("Players init");
  this.m_createPlayers();
}

//------------------------------------------------------------------------------
// Private prototype methods

/**
 * 
 * @returns {undefined}
 */

ArcticMadness.entity.Players.prototype.m_createPlayers = function () {
     
    // var gamepads = this.game.gamepads.get(0);
    // console.log(gamepads.connected);

    // for (var i = 0; i < gamepads.length; i++) {
    //   if (gamepads[i] != null) {
    //     this.m_createPlayer(700, 100, "64_penguin_nogun", {
    //       left: "A",
    //       right: "D",
    //       up: "W",
    //       down: "S",
    //       shoot: "SPACE",
    //     }, gamepads[i]);
    //   }
    // }
}

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {string} sprite 
 * @param {Object} controls 
 * @param {rune.input.Gamepad} gamepad 
 * @returns {undefined}
 */

// ArcticMadness.entity.Players.prototype.m_createPlayer = function (x, y, sprite, controls, gamepad) {
//   var player = new ArcticMadness.entity.Player(x, y, sprite, controls, gamepad);
//   this.addChild(player);
// }


