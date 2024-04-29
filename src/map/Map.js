//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.map.Map = function (map, player, game, gamepad) {
  this.map = map;
  this.tiles = this.map.back.data; // Array of tile values
  this.tileLayer = this.map.back; // Reference to the tile layer
  this.player = player; // Reference to the player object
  this.game = game; // Reference to the game object
  this.gamepad = gamepad; // Reference to the gamepad object
  this.tileTimers = {};
  this.repairTimer = null;

  ArcticMadness.map.Map.prototype.init.call(this);
};

//------------------------------------------------------------------------------
// Public prototype methods
//------------------------------------------------------------------------------

// This is the init method, which is called when the object is created.

ArcticMadness.map.Map.prototype.init = function () {
  this.m_changeRandomTile();
};

// This is the update method, which is called every frame from the Game.

ArcticMadness.map.Map.prototype.update = function (step) {
  this.m_checkPlayerInWater();
  if (
    !this.player.isInWater &&
    this.player.isAlive &&
    !this.player.isAttacked
  ) {
    this.m_handleInputGamepad();
  }
};

//--------------------------------------------------------------------------
// Private methods
//--------------------------------------------------------------------------

// This method handles the gamepad input to repair ice.

ArcticMadness.map.Map.prototype.m_handleInputGamepad = function () {
  if (this.gamepad.pressed(2)) {
    this.player.animation.gotoAndPlay("repair");
    if (!this.repairTimer) {
      this.player.gun.alpha = 0; // Hide the gun
      this.repairTimer = this.game.timers.create(
        {
          duration: 2000,
          onComplete: function () {
            this.m_repairIce();
            this.repairTimer = null;
          },
          scope: this,
        },
        true
      );
    }
  } else {
    if (this.repairTimer) {
      this.repairTimer.stop();
      this.repairTimer = null;
    }
   // this.player.animation.gotoAndPlay("idle");
    this.player.gun.alpha = 1; // Show the gun
  }
};

// This method checks if the player is in water.

ArcticMadness.map.Map.prototype.m_checkPlayerInWater = function () {
  if (this.m_isPlayerInWater() && this.player.isAlive) {
    var playerTile = this.tileLayer.getTileOf(
      this.player.centerX,
      this.player.centerY + 18
    );

    this.player.x = playerTile.x;
    this.player.y = playerTile.y;
    this.player.health -= 1;
    this.player.isInWater = true;
    this.player.gun.alpha = 0;
    this.player.animation.gotoAndPlay("drown");
    if (this.player.health <= 0) {
      this.player.isInWater = true;
      this.player.isAlive = false;
      this.player.animation.gotoAndPlay("death");
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
  this.tileLayer.setTileValueAt(index, 15);
  this.m_createTimer(
    5000,
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
  this.m_changeRandomTile();
};

/**
 * This method checks if the player is standing on a water tile.
 * @returns {boolean} Returns true if the player is standing on water.
 */

ArcticMadness.map.Map.prototype.m_isPlayerInWater = function () {
  // Check if the player is standing on a water tile
  var tileValue = this.tileLayer.getTileValueOf(
    this.player.centerX,
    this.player.centerY + 18
  );

  // If the tile value is 1, the player is standing on water
  if (
    tileValue === 1 ||
    tileValue === 8 ||
    tileValue === 9 ||
    tileValue === 17
  ) {
    return true;
  } else {
    return false;
  }
};

/**
 * This method changes a random ice tile to a crack tile.
 * @returns {undefined}
 */

ArcticMadness.map.Map.prototype.m_changeRandomTile = function () {
  var iceTiles = [];

  // Find all tiles with value 2
  for (var i = 0; i < this.tiles.length; i++) {
    if (this.tiles[i] === 2 || this.tiles[i] === 4) {
      iceTiles.push(i);
    }
  }

  if (iceTiles.length > 0) {
    // Randomly select one of the ice tiles
    var randomIndex = iceTiles[Math.floor(Math.random() * iceTiles.length)];

    this.tileLayer.setTileValueAt(randomIndex, 14); // Change tile value to 14 (crack)
    this.m_createTimer(
      5000,
      function () {
        this.m_breakIce(randomIndex);
      },
      randomIndex
    ); // Create a timer for this tile
  }
};

/**
 * This method repairs the ice at the player's position.
 * @returns {undefined}
 */

ArcticMadness.map.Map.prototype.m_repairIce = function () {
  var playerTileIndex = this.tileLayer.getTileIndexOf(
    this.player.centerX,
    this.player.centerY
  );

  var playerTile = this.tileLayer.getTileValueOf(
    this.player.centerX,
    this.player.centerY
  );

  if (playerTile === 20 || playerTile === 21) {
    this.tileLayer.setTileValueAt(playerTileIndex, 2);
    var timer = this.tileTimers[playerTileIndex];
    if (timer) {
      // If the tile has a timer, stop it
      timer.stop();
      delete this.tileTimers[playerTileIndex];
      this.m_changeRandomTile();
    }
  }
  this.repairTimer = null;
};
