//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.map.Map = function (map, players, game, gamepads) {
  this.map = map;
  this.tiles = this.map.back.data; // Array of tile values
  this.tileLayer = this.map.back; // Reference to the tile layer
  this.players = players; // Reference to the an array of player objects
  this.game = game; // Reference to the game object
  this.gamepads = gamepads; // Array of gamepads
  this.tileTimers = {};
  this.repairTimer = {};
  this.newCrackTimer = null;

  ArcticMadness.map.Map.prototype.init.call(this);
};

//------------------------------------------------------------------------------
// Public prototype methods
//------------------------------------------------------------------------------

// This is the init method, which is called when the object is created.

ArcticMadness.map.Map.prototype.init = function () {
  this.m_crackRandomTile();
  this.m_setCrackTimer();
};

// This is the update method, which is called every frame from the Game.

ArcticMadness.map.Map.prototype.update = function (step) {
  for (var i = 0; i < this.players.length; i++) {
    var player = this.players[i];
    if (player.isAlive) {
      var playerInWater = this.m_isPlayerInWater(player);
      this.m_checkPlayerInWater(playerInWater);

      if (!player.isInWater) {
        this.m_handleInputGamepad(player);
      }
    }
  }
};

//--------------------------------------------------------------------------
// Private methods
//--------------------------------------------------------------------------

// This method sets a timer to change a random ice tile to a crack tile.

ArcticMadness.map.Map.prototype.m_setCrackTimer = function () {
  this.newCrackTimer = this.game.timers.create(
    {
      duration: 2000,
      onTick: function () {
        this.m_crackRandomTile();
        this.m_setCrackTimer();
      },
      scope: this,
    },
    true
  );
};

// This method checks if the player is in water.

ArcticMadness.map.Map.prototype.m_checkPlayerInWater = function (player) {
  if (player != null && player.isAlive) {
    var playerTile = this.tileLayer.getTileOf(
      player.centerX,
      player.centerY + 18
    );

    if(!player.falling){
    this.game.tweenWater(player, playerTile);
    }
    player.health -= 1;
    player.gun.alpha = 0;
   
    if (player.health <= 0) {
      player.isInWater = true;
      player.isAlive = false;
      player.animation.gotoAndPlay("death");
      this.game.gameOver();
    }
  }
};

// This method creates a timer for a tile.

ArcticMadness.map.Map.prototype.m_createTimer = function (
  time,
  callback,
  tileIndex
) {
  var timer = this.game.timers.create(
    {
      duration: time,
      onTick: callback,
      scope: this,
    },
    true
  );

  this.tileTimers[tileIndex] = timer;
};

/**
 * This method breaks the ice at a specific tile index.
 * @param {number} index The index of the tile to break.
 *
 * @returns {undefined}
 */

ArcticMadness.map.Map.prototype.m_breakIce = function (index) {
  this.tileLayer.setTileValueAt(index, 4);
  this.m_createTimer(
    2000,
    function () {
      this.m_breakIce2(index);
    },
    index
  );
};
ArcticMadness.map.Map.prototype.m_breakIce2 = function (index) {
  this.tileLayer.setTileValueAt(index, 5);
  this.m_createTimer(
    2000,
    function () {
      this.m_breakIce3(index);
    },
    index
  );
};
ArcticMadness.map.Map.prototype.m_breakIce3 = function (index) {
  this.tileLayer.setTileValueAt(index, 6);
  this.m_createTimer(
    2000,
    function () {
      this.m_breakIce4(index);
    },
    index
  );
};
ArcticMadness.map.Map.prototype.m_breakIce4 = function (index) {
  this.tileLayer.setTileValueAt(index, 7);
  this.m_createTimer(
    2000,
    function () {
      this.m_removeIce(index);
    },
    index
  );
};

/**
 * This method removes the ice at a specific tile index.
 * @param {number} index The index of the tile to remove.
 * @returns {undefined}
 */

ArcticMadness.map.Map.prototype.m_removeIce = function (index) {
  this.tileLayer.setTileValueAt(index, 1);
  // this.m_changeRandomTile();
};

/**
 * This method checks if the player is standing on a water tile.
 * @returns {boolean} Returns true if the player is standing on water.
 */

ArcticMadness.map.Map.prototype.m_isPlayerInWater = function (player) {
  // Check if the player is standing on a water tile
  var tileValue = this.tileLayer.getTileValueOf(
    player.centerX,
    player.centerY + 18
  );

  // If the tile value is 1, the player is standing on water
  if (
    tileValue === 1
    // tileValue === 2 ||
    // tileValue === 8 ||
    // tileValue === 9 ||
    // tileValue === 10 ||
    // tileValue === 11 ||
    // tileValue === 12 ||
    // tileValue === 13 ||
    // tileValue === 14 ||
    // tileValue === 15 ||
    // tileValue === 16 ||
    // tileValue === 17 ||
    // tileValue === 18 ||
    // tileValue === 21 ||
    // tileValue === 22 ||
    // tileValue === 23 ||
    // tileValue === 24
  ) {
    player.isInWater = true;
    return player;
  }

  player.isInWater = false;
  return null;
};

/**
 * This method changes a random ice tile to a crack tile.
 * @returns {undefined}
 */

ArcticMadness.map.Map.prototype.m_crackRandomTile = function () {
  var iceTiles = [];

  // Find all tiles with with ice
  for (var i = 0; i < this.tiles.length; i++) {
    // if (this.tiles[i] === 3 || this.tiles[i] === 4 || this.tiles[i] === 5 || this.tiles[i] === 6 || this.tiles[i] === 7 || this.tiles[i] === 8 || this.tiles[i] === 19 || this.tiles[i] === 20) {
    if (this.tiles[i] === 2) {
      iceTiles.push(i);
    }
  }

  if (iceTiles.length > 0) {
    // Randomly select one of the ice tiles
    var randomIndex = iceTiles[Math.floor(Math.random() * iceTiles.length)];

    this.tileLayer.setTileValueAt(randomIndex, 3); // Change tile value to 19 (crack)
    this.m_createTimer(
      2000,
      function () {
        this.m_breakIce(randomIndex);
      },
      randomIndex
    ); // Create a timer for this tile
  }
};

// This method handles the gamepad input to repair ice.

ArcticMadness.map.Map.prototype.m_handleInputGamepad = function (player) {
  var gamepad = player.gamepad;

  var playerTileIndex = this.tileLayer.getTileIndexOf(
    player.centerX,
    player.centerY
  );

  var timer = this.tileTimers[playerTileIndex];

  if (gamepad.pressed(0) && timer && player.isRepairing === false) {
    timer.pause();

    player.isRepairing = true;
    player.velocity.x = 0;
    player.velocity.y = 0;
    player.animation.gotoAndPlay("repair");
    timer.pause();
    console.log("pause");
    
    if (!this.repairTimer[player.id]) {
      player.gun.alpha = 0; // Hide the gun

      this.repairTimer[player.id] = this.game.timers.create(
        {
          duration: 1500,
          onComplete: function () {
            this.m_repairIce(player, playerTileIndex);

            timer.stop();
            delete this.tileTimers[playerTileIndex];
            this.repairTimer[player.id] = null;

            player.isRepairing = false;
            player.gun.alpha = 1; // Show the gun

            player.animation.gotoAndPlay("idle");
          },
          scope: this,
        },
        true
      );
    }
  } else if (this.repairTimer[player.id] && gamepad.justReleased(0)) {
    timer.resume();

    this.repairTimer[player.id].stop();
    this.repairTimer[player.id] = null;

    player.isRepairing = false;
    player.gun.alpha = 1; // Show the gun
    player.animation.gotoAndPlay("idle");
  }
};

/**
 * This method repairs the ice at the player's position.
 * @returns {undefined}
 */

ArcticMadness.map.Map.prototype.m_repairIce = function (player, playerTileIndex) {
 

  var playerTile = this.tileLayer.getTileValueOf(
    player.centerX,
    player.centerY
  );

  if (
    playerTile === 3 ||
    playerTile === 4 ||
    playerTile === 5 ||
    playerTile === 6 ||
    playerTile === 7
  ) {
    this.tileLayer.setTileValueAt(playerTileIndex, 2);
  }
};
