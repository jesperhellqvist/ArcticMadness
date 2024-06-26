//--------------------------------
// Constructor scope
//--------------------------------

/**
 * Creates a new instance of the Map class.
 * @constructor
 * @param {rune.tilemap.Tilemap} map The map object.
 * @param {Array} players The players array.
 * @param {ArcticMadness.scene.Game} game The game object.
 * @param {Array} gamepads The gamepads array.
 * @param {ArcticMadness.entity.Enemies} enemies The enemies object.
 * @returns {undefined}
 * @class
 * @public
 */

ArcticMadness.map.Map = function (map, players, game, gamepads, enemies) {
  this.map = map;
  this.tiles = this.map.back.data; // Array of tile values
  this.tileLayer = this.map.back; // Reference to the tile layer
  this.players = players; // Reference to the an array of player objects
  this.game = game; // Reference to the game object
  this.gamepads = gamepads; // Array of gamepads
  this.tileTimers = {};
  this.repairTimer = {};
  this.newCrackTimer = null;
  this.animationBlock = null;
  this.crackSound = null;
  this.helpSound = null;
  this.enemies = enemies; // Reference to the enemies object
  this.numRandamCracks = 0;
  this.repairedTilesScore = 0;
  this.repairedWaveScore = 0;
  this.killplayerTimer = null;

  ArcticMadness.map.Map.prototype.init.call(this);
};

//------------------------------------------------------------------------------
// Public prototype methods
//------------------------------------------------------------------------------

/**
 * Initializes the map object and sets a timer for creating a new crack in the ice.
 * @returns {undefined}
 */

ArcticMadness.map.Map.prototype.init = function () {
  this.m_initSound();
  this.m_crackRandomTile();
  this.setCrackTimer();
};

/**
 * Updates the map object.
 * @param {number} step The time between frames.
 * @returns {undefined}
 */

ArcticMadness.map.Map.prototype.update = function (step) {
  var alivePlayers = [];
  var revivablePlayers = [];

  // Existing player loop
  for (var i = 0; i < this.players.length; i++) {
    var player = this.players[i];
    if (player.isAlive) {
      if (this.m_isPlayerInWater(player)) {
        revivablePlayers.push(player);
        this.m_updatePlayerState(player);
      } else if (!player.isAttacked) {
        alivePlayers.push(player);
        player.isInWater = false;
        player.inWaterTile = null;
        this.m_handleInputGamepad(player);
      }
    }
  }

  // Extra loop to check if each alive player is on a revive tile
  for (var i = 0; i < alivePlayers.length; i++) {
    var alivePlayer = alivePlayers[i];
    if (this.m_isPlayerOnReviveTile(alivePlayer)) {
      this.m_reviveNearestPlayer(alivePlayer);
    }
  }
};

/**
 * Disposes the map object and its properties.
 * @returns {undefined}
 * @public
 */

ArcticMadness.map.Map.prototype.dispose = function () {
  this.enemies = null;
  this.helpSound = null;
  this.crackSound = null;
  this.animationBlock = null;
  this.newCrackTimer = null;
  this.repairTimer = null;
  this.tileTimers = null;
  this.gamepads = null;
  this.game = null;
  this.players = null;
  this.tileLayer = null;
  this.tiles = null;
  this.map = null;
  this.killplayerTimer = null;
};

//------------------------------------------------------------------
// Public Tilemap methods
//------------------------------------------------------------------

/**
 * This method returns a random water tile.
 * @returns {object} A random water tile.
 * @returns {null} Returns null if no water tiles are found.
 *
 */

ArcticMadness.map.Map.prototype.getRandomWaterTile = function () {
  var waterTiles = [];

  for (var i = 0; i < this.tiles.length; i++) {
    if (this.tiles[i] >= 9 && this.tiles[i] <= 24) {
      waterTiles.push(i);
    }
  }

  if (waterTiles.length > 0) {
    var randomIndex = waterTiles[Math.floor(Math.random() * waterTiles.length)];
    return this.tileLayer.getTileAt(randomIndex);
  }

  return null;
};

/**
 * This method removes the revive tile from the map.
 * @param {ArcticMadness.entity.Player} player The player object.
 * @returns {undefined}
 */

ArcticMadness.map.Map.prototype.removeReviveTile = function (player) {
  if (player.inWaterTile != null) {
    var playerWaterTile = this.tileLayer.getTileAt(player.inWaterTile);
    var offsets = [
      { x: 0, y: -32 }, // Above
      { x: 0, y: 96 }, // Below
      { x: -32, y: 0 }, // Left
      { x: 96, y: 0 }, // Right
    ];

    for (var i = 0; i < offsets.length; i++) {
      var offset = offsets[i];
      var tileIndex = this.tileLayer.getTileIndexOfPoint({
        x: playerWaterTile.x + offset.x,
        y: playerWaterTile.y + offset.y,
      });

      if (tileIndex >= 0) {
        var tileValue = this.tileLayer.getTileValueAt(tileIndex);
        if (tileValue === 38) {
          this.tileLayer.setTileValueAt(tileIndex, 33); // test
          this.m_createTimer(
            2000,
            function () {
              this.m_breakIce(tileIndex);
            },
            tileIndex
          );
          return;
        }
      }
    }
  }
};

/**
 * This method returns the index of the nearest ice tile.
 * @param {ArcticMadness.entity.Player} player The player object.
 * @returns {number} The index of the nearest ice tile.
 */

ArcticMadness.map.Map.prototype.getNearestIceTileIndex = function (player) {
  var nearestTileIndex = null;
  var nearestDistance = Infinity;

  // Loop through all tiles
  for (var i = 0; i < this.tileLayer.data.length; i++) {
    var tileIndex = this.tileLayer.data[i];
    if (tileIndex >= 1 && tileIndex <= 8) {
      var tile = this.tileLayer.getTileAt(i);
      var distance = this.m_getDistanceBetween(player, tile);
      // If this tile is closer than the current nearest tile
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestTileIndex = i;
      }
    }
  }
  return nearestTileIndex;
};

/**
 * This method sets a timer that creates a new crack in the ice every 2 seconds.
 * @returns {undefined}
 */

ArcticMadness.map.Map.prototype.setCrackTimer = function () {
  this.newCrackTimer = this.game.timers.create(
    {
      duration: 2000,
      onTick: function () {
        this.m_crackRandomTile();
        this.setCrackTimer();
      },
      scope: this,
    },
    true
  );
};

/**
 * This method calls the crackRandomTile method. The number of cracks created is based on the current wave.
 * @param {number} currentWave The current wave.
 * @returns {undefined}
 * @public
 */

ArcticMadness.map.Map.prototype.callCrackRandomTile = function (currentWave) {
  currentWave *= 2;
  for (var i = 0; i < currentWave; i++) {
    this.m_crackRandomTile();
  }
};

/**
 * This method changes a random ice tile to a crack tile.
 * @returns {undefined}
 */

ArcticMadness.map.Map.prototype.m_crackRandomTile = function () {
  var iceTiles = [];

  // Find all tiles with with ice
  for (var i = 0; i < this.tiles.length; i++) {
    if (this.tiles[i] >= 1 && this.tiles[i] <= 8) {
      iceTiles.push(i);
    }
  }

  if (iceTiles.length > 0) {
    // Randomly select one of the ice tiles
    var randomIndex = iceTiles[Math.floor(Math.random() * iceTiles.length)];
    this.crackSound.play();
    this.tileLayer.setTileValueAt(randomIndex, 33); // Change tile value to 19 (crack)
    this.m_createTimer(
      2000,
      function () {
        this.m_breakIce(randomIndex);
      },
      randomIndex
    ); // Create a timer for this tile
  }
};

/**
 * This method resets the map to its original state.
 * @returns {undefined}
 * @public
 */

ArcticMadness.map.Map.prototype.resetMap = function () {
  var tileValues = [
    19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    23, 19, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 19, 19, 3, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 19, 22, 3, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 19, 19, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 7, 23, 19, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    7, 19, 24, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 19, 19, 3,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 21, 19, 3, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 19, 19, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 8, 19, 17, 16, 12, 12, 13, 10, 14, 14, 13, 12, 12, 10, 15,
    14, 12, 12, 11, 10, 9, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
    19, 19, 19, 19, 19, 19, 19, 19, 19,
  ];
  for (var i = 0; i < tileValues.length; i++) {
    this.tileLayer.setTileValueAt(i, tileValues[i]);
  }
};

/**
 * This method ends a wave.
 * @returns {undefined}
 * @public
 */

ArcticMadness.map.Map.prototype.stopWave = function () {
  this.m_stopTileTimers();
  this.game.enemies.disposeEnemies();
  this.m_stopNewCrackTimer();
  this.m_stopNewEnemyTimer();

  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].isRepairing) {
      this.m_stopRepair(this.players[i], this.players[i].currentTileTimer);
    }
  }
};

//------------------------------------------------------------------------------
// Public methods related to the enemies
//------------------------------------------------------------------------------

/**
 * This method checks if an enemy is in water.
 * @param {ArcticMadness.entity.Enemy} enemy The enemy object.
 * @returns {boolean} Returns true if the enemy is in water.
 * @returns {boolean} Returns false if the enemy is not in water.
 * @public
 */

ArcticMadness.map.Map.prototype.checkIfEnemyInWater = function (enemy) {
  var tileValue = this.tileLayer.getTileValueOf(enemy.centerX, enemy.centerY);
  if (tileValue >= 9 && tileValue <= 24) {
    return true;
  } else {
    return false;
  }
};

//------------------------------------------------------------------------------
// Private methods related to the tilemap
//------------------------------------------------------------------------------

/**
 * This method stops all tile timers.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_stopTileTimers = function () {
  for (var key in this.tileTimers) {
    var timer = this.tileTimers[key];
    timer.stop();
  }
};

/**
 * This method stops the new crack timer.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_stopNewCrackTimer = function () {
  if (this.newCrackTimer) {
    this.newCrackTimer.stop();
  }
};

/**
 * This method breaks the ice at a specific tile index.
 * @param {number} index The index of the tile to break.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_breakIce = function (index) {
  this.tileLayer.setTileValueAt(index, 34);
  this.m_createTimer(
    2000,
    function () {
      this.m_breakIce2(index);
    },
    index
  );
};

/**
 * This method breaks the ice at a specific tile index.
 * @param {number} index The index of the tile to break.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_breakIce2 = function (index) {
  this.tileLayer.setTileValueAt(index, 35);
  this.m_createTimer(
    2000,
    function () {
      this.m_breakIce3(index);
    },
    index
  );
};

/**
 * This method breaks the ice at a specific tile index.
 * @param {number} index The index of the tile to break.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_breakIce3 = function (index) {
  this.tileLayer.setTileValueAt(index, 36);
  this.m_createTimer(
    2000,
    function () {
      this.m_breakIce4(index);
    },
    index
  );
};

/**
 * This method breaks the ice at a specific tile index.
 * @param {number} index The index of the tile to break.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_breakIce4 = function (index) {
  this.tileLayer.setTileValueAt(index, 37);
  this.m_createCracksAround(index);
  this.m_createTimer(
    2000,
    function () {
      this.m_removeIce(index);
    },
    index
  );
};

/**
 * This method removes the ice at a specific tile index. It also checks the surrounding tiles and sets the correct tile value.
 * @param {number} index The index of the tile to remove.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_removeIce = function (index) {
  var coreTile = this.tileLayer.getTileAt(index);

  // Random ice edge and water tiles

  var iceEdges = [12, 12, 12, 13, 15];
  var water = [19, 19, 19, 19, 20, 20, 23, 24];

  var randomiceEdge = iceEdges[Math.floor(Math.random() * iceEdges.length)];
  var randomWater = water[Math.floor(Math.random() * water.length)];

  // Get the tile index of the tile above and below the core tile

  var offsets = [
    { x: 0, y: -32 }, // Above
    { x: 0, y: 96 }, // Below
  ];

  var aboveTileIndex = this.tileLayer.getTileIndexOfPoint({
    x: coreTile.x + offsets[0].x,
    y: coreTile.y + offsets[0].y,
  });

  var belowTileIndex = this.tileLayer.getTileIndexOfPoint({
    x: coreTile.x + offsets[1].x,
    y: coreTile.y + offsets[1].y,
  });

  var aboveTileValue = this.tileLayer.getTileValueAt(aboveTileIndex);
  var belowTileValue = this.tileLayer.getTileValueAt(belowTileIndex);

  // If the tile above is ice or crack, set the core tile to 12
  if (aboveTileValue <= 8 || (aboveTileValue >= 26 && aboveTileValue <= 38)) {
    this.tileLayer.setTileValueAt(index, randomiceEdge);
  }

  // If the tile below is ice or crack, set the core tile to 19
  if (belowTileValue <= 8 || (belowTileValue >= 26 && belowTileValue <= 38)) {
    this.tileLayer.setTileValueAt(index, randomiceEdge);
  }

  // If the tile below is 12, set the core tile to 12 and the tile below to 19
  if (belowTileValue >= 9 && belowTileValue <= 16) {
    this.tileLayer.setTileValueAt(index, randomiceEdge);
    this.tileLayer.setTileValueAt(belowTileIndex, randomWater);
  }

  // If the tile above is 12, set the core tile to 19
  if (aboveTileValue >= 9 && aboveTileValue <= 16) {
    this.tileLayer.setTileValueAt(index, randomWater);
  }

  // If the tile above is 19 and the tile below is 12, set the core tile to 19 and the tile below to 19
  if (
    aboveTileValue >= 17 &&
    aboveTileValue <= 24 &&
    belowTileValue >= 9 &&
    belowTileValue <= 16
  ) {
    this.tileLayer.setTileValueAt(index, randomWater);
    this.tileLayer.setTileValueAt(belowTileIndex, randomWater);
  }

  // If both the tile above and the tile below are 12, set the core tile and the tile below to 19
  if (
    aboveTileValue >= 9 &&
    aboveTileValue <= 16 &&
    belowTileValue >= 9 &&
    belowTileValue <= 16
  ) {
    this.tileLayer.setTileValueAt(index, randomWater);
    this.tileLayer.setTileValueAt(belowTileIndex, randomWater);
  }

  // if the tile above is 19 and the tile below is ice, set the core tile to 19
  if (aboveTileValue >= 17 && aboveTileValue <= 24 && belowTileValue <= 8) {
    this.tileLayer.setTileValueAt(index, randomWater);
  }

  // if the tile above is 19 and the tile below is 19, set the core tile to 19
  if (aboveTileValue >= 17 && aboveTileValue <= 24 && belowTileValue === 19) {
    this.tileLayer.setTileValueAt(index, randomWater);
  }

  // if the tile above is 19 and the tile below is crack, set the core tile to 19
  if (
    aboveTileValue >= 17 &&
    aboveTileValue <= 24 &&
    belowTileValue >= 26 &&
    belowTileValue <= 38
  ) {
    this.tileLayer.setTileValueAt(index, randomWater);
  }
};

/**
 * This method creates cracks around a specific tile index.
 * @param {number} index The index of the tile to create cracks around.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_createCracksAround = function (index) {
  var coreTile = this.tileLayer.getTileAt(index);

  var offsets = [
    { x: 0, y: -32, direction: 25 }, // Above
    { x: 0, y: 96, direction: 29 }, // Below
    { x: -32, y: 0, direction: 31 }, // Left
    { x: 96, y: 0, direction: 27 }, // Right
    { x: -32, y: -32, direction: 32 }, // Above left
    { x: 96, y: -32, direction: 26 }, // Above righ
    { x: -32, y: 96, direction: 30 }, // Below left
    { x: 96, y: 96, direction: 28 }, // Below right
  ];

  // Shuffle the offsets array
  offsets.sort(function () {
    return 0.5 - Math.random();
  });

  // Take the first three elements
  for (var i = 0; i < 3; i++) {
    var offset = offsets[i];
    var tileIndex = this.tileLayer.getTileIndexOfPoint({
      x: coreTile.x + offset.x,
      y: coreTile.y + offset.y,
    });
    var tileValue = this.tileLayer.getTileValueAt(tileIndex);

    if (tileValue >= 1 && tileValue <= 8) {
      this.tileLayer.setTileValueAt(tileIndex, offset.direction);
      this.m_createTimer(
        2000,
        (function (index) {
          return function () {
            this.m_breakIce(index);
          };
        })(tileIndex),
        tileIndex
      );
    }
  }
};

/**
 * This method creates an animation block for the repair process.
 * @param {ArcticMadness.entity.Player} player The player object.
 * @param {number} tileValue The value of the tile.
 * @param {rune.tilemap.Tile} playerTile The tile object.
 * @param {number} playerTileIndex The index of the player's tile.
 * @param {rune.timer.Timer} timer The timer object.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_createAnimationBlock = function (
  player,
  tileValue,
  playerTile,
  playerTileIndex,
  timer
) {
  player.animationBlock = new rune.tilemap.Block(this.map, tileValue);
  player.animationBlock.x = playerTile.x;
  player.animationBlock.y = playerTile.y;
  var animationFrames = [];
  for (var i = tileValue - 1; i >= 31; i--) {
    animationFrames.push(i);
  }
  var lastFrame = animationFrames.length - 1;
  player.animationBlock.animation.create(
    "crackToIce",
    animationFrames,
    2,
    false
  );
  player.animationBlock.animation.current.scripts.add(
    lastFrame,
    function () {
      this.m_repairIce(player, tileValue, playerTileIndex, timer);
      if (
        player.animationBlock &&
        player.animationBlock.animation &&
        player.animationBlock.animation.current
      ) {
        player.animationBlock.animation.current.scripts.remove(lastFrame);
      }
    },
    this
  );
  this.game.stage.addChildAt(player.animationBlock, 0);
};

//------------------------------------------------------------------------------
// Private methods related to the players interaction with the map
//------------------------------------------------------------------------------

/**
 * This method handles sound related to the player
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_initSound = function () {
  this.crackSound = this.map.application.sounds.sound.get("fastcrack");
  this.crackSound.loop = false;
  this.helpSound = this.map.application.sounds.sound.get("help");
  this.helpSound.loop = false;
  this.completedSound = this.map.application.sounds.sound.get("repaircomplete");
  this.completedSound.loop = false;
  this.revivedSound = this.map.application.sounds.sound.get("saved");
  this.revivedSound.loop = false;
};

/**
 * This method checks if the player is standing on a water tile.
 * @param {ArcticMadness.entity.Player} player The player object.
 * @returns {boolean} Returns true if the player is standing on water.
 * @returns {boolean} Returns false if the player is not standing on water.
 * @private
 */

ArcticMadness.map.Map.prototype.m_isPlayerInWater = function (player) {
  var tileValue = this.tileLayer.getTileValueOf(
    player.centerX,
    player.centerY + 18
  );

  if (tileValue >= 9 && tileValue <= 24) {
    return true;
  }

  return false;
};

/**
 * This method updates the player's state when standing on a water tile.
 * @param {ArcticMadness.entity.Player} player The player object.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_updatePlayerState = function (player) {
  if (player != null && player.isAlive) {
    var alivePlayers = this.players.filter(function (p) {
      return p.isAlive === true;
    });

    player.isInWater = true;
    player.velocity.x = 0;
    player.velocity.y = 0;

    var playerTile = this.tileLayer.getTileOf(
      player.centerX,
      player.centerY + 18
    );

    if (!player.falling) {
      this.game.tweenWater(player, playerTile);
      player.gun.alpha = 0;
    }

    var playerTileIndex = this.tileLayer.getTileIndexOf(
      player.centerX,
      player.centerY + 18
    );
    player.inWaterTile = playerTileIndex;
    player.isRevivable = true;

    if (alivePlayers.length === 1 && player.isInWater && player.health < 235) {
      player.health = 0;
    } else {
      player.health -= 1;
    }

    if (player.revivingTileSet === false && player.health < 234) {
      this.m_setReviveTile(player);
    }

    if (player.health == 125) {
      this.helpSound.play();
    }
    if (player.health <= 0) {
      this.m_killPlayer(player);
      this.removeReviveTile(player);
    }
  }
};

/**
 * This method checks if the player is standing on a revive tile.
 * @param {ArcticMadness.entity.Player} player The player object.
 * @returns {boolean} Returns true if the player is standing on a revive tile.
 * @returns {boolean} Returns false if the player is not standing on a revive tile.
 * @private
 */

ArcticMadness.map.Map.prototype.m_isPlayerOnReviveTile = function (player) {
  var tileValue = this.tileLayer.getTileValueOf(
    player.centerX,
    player.centerY + 18
  );

  if (tileValue === 38) {
    return true;
  }
  return false;
};

/**
 * This method sets a revive tile for the player.
 * @param {ArcticMadness.entity.Player} player The player object.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_setReviveTile = function (player) {
  player.revivingTileSet = true;
  var offsets = [
    { x: 0, y: -32 }, // Above
    { x: 0, y: 96 }, // Below
    { x: -32, y: 0 }, // Left
    { x: 96, y: 0 }, // Right
  ];

  if (player.isRevivable && player.inWaterTile != null) {
    var playerWaterTile = this.tileLayer.getTileAt(player.inWaterTile);

    for (var i = 0; i < offsets.length; i++) {
      var offset = offsets[i];
      var tileIndex = this.tileLayer.getTileIndexOfPoint({
        x: playerWaterTile.x + offset.x,
        y: playerWaterTile.y + offset.y,
      });
      if (tileIndex >= 0) {
        var tileValue = this.tileLayer.getTileValueAt(tileIndex);
        if (tileValue >= 1 && tileValue <= 8) {
          this.tileLayer.setTileValueAt(tileIndex, 38);
          return;
        }
      }
    }
  }
};

/**
 * This method kills the player.
 * @param {ArcticMadness.entity.Player} player The player object.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_killPlayer = function (player) {
  player.animation.gotoAndPlay("death", 0);
  this.killplayerTimer = this.game.timers
    .create({
      duration: 2000,
      onComplete: function () {
        player.isAlive = false;
        player.isRevivable = false;
      },
      scope: this,
    })
    .start();
};

/**
 * This method handles the input from the gamepad.
 * @param {ArcticMadness.entity.Player} player The player object.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_handleInputGamepad = function (player) {
  var gamepad = player.gamepad;
  var playerTile = this.tileLayer.getTileOf(player.centerX, player.centerY);
  var playerTileIndex = playerTile.index;
  var tileValue = this.tileLayer.getTileValueAt(playerTileIndex);
  var timer = this.tileTimers[playerTileIndex];

  if (gamepad.pressed(0) && timer && player.isRepairing === false) {
    this.m_startRepair(player, timer, tileValue, playerTile, playerTileIndex);
  } else if (gamepad.justReleased(0)) {
    this.m_stopRepair(player, timer);
  }
};

/**
 * This method starts the repair process.
 * @param {ArcticMadness.entity.Player} player The player object.
 * @param {object} timer The timer object.
 * @param {number} tileValue The value of the tile.
 * @param {object} playerTile The tile object.
 * @param {number} playerTileIndex The index of the player's tile.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_startRepair = function (
  player,
  timer,
  tileValue,
  playerTile,
  playerTileIndex
) {
  timer.pause();
  player.isRepairing = true;
  player.currentTileTimer = timer; // Set the current tile timer
  player.velocity.x = 0;
  player.velocity.y = 0;
  player.animation.gotoAndPlay("repair");
  player.gun.alpha = 0; // Hide the gun

  this.m_createAnimationBlock(
    player,
    tileValue,
    playerTile,
    playerTileIndex,
    timer
  );
};

/**
 * This method stops the repair process and resumes the timer when the player releases the repair button.
 * @param {ArcticMadness.entity.Player} player The player object.
 * @param {object} timer The timer object.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_stopRepair = function (player, timer) {
  if (timer) {
    timer.resume();
  }

  if (player.isRepairing) {
    player.isRepairing = false;
    player.currentTileTimer = null; // Reset the current tile timer
    player.gun.alpha = 1; // Show the gun
    player.animation.gotoAndPlay("idle");
  }

  if (player.animationBlock !== null) {
    this.game.stage.removeChild(player.animationBlock, true);
    player.animationBlock = null;
  }
};

/**
 * This method repairs the ice at the player's position.
 *
 * @param {ArcticMadness.entity.Player} player The player object.
 * @param {number} tileValue The value of the tile.
 * @param {number} playerTileIndex The index of the player's tile.
 * @param {object} timer The timer object.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_repairIce = function (
  player,
  tileValue,
  playerTileIndex,
  timer
) {
  if (!player.isRepairing) {
    return;
  }

  timer.stop();
  delete this.tileTimers[playerTileIndex];

  if (tileValue >= 25 && tileValue <= 37) {
    this.tileLayer.setTileValueAt(playerTileIndex, 1);
    this.completedSound.play();
    this.repairedTilesScore += 10;
    this.repairedWaveScore += 10;
    this.game.updateScore(10);
  }
  // Remove the animation block from the stage
  this.game.stage.removeChild(player.animationBlock, true);
  player.isRepairing = false;
  player.animation.gotoAndPlay("idle");
  player.gun.alpha = 1; // Show the gun
};

/**
 * This method revives the nearest player.
 * @param {ArcticMadness.entity.Player} revivingPlayer The player object.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_reviveNearestPlayer = function (
  revivingPlayer
) {
  var nearestPlayer = null;
  var nearestDistance = Infinity;

  for (var i = 0; i < this.game.players.length; i++) {
    var player = this.game.players[i];
    if (player.isRevivable) {
      var distance = this.m_getDistanceBetween(revivingPlayer, player);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestPlayer = player;
      }
    }
  }

  if (nearestPlayer) {
    this.game.revivePlayer(nearestPlayer);
    this.revivedSound.play();
  }
};

//------------------------------------------------------------------------------
// Private utility methods related to the tilemap
//------------------------------------------------------------------------------

/**
 * This method gets the distance between two entities.
 * @param {object} entity1 The first entity object.
 * @param {object} entity2 The second entity object.
 * @returns {number} The distance between the two entities.
 * @private
 */

ArcticMadness.map.Map.prototype.m_getDistanceBetween = function (
  entity1,
  entity2
) {
  var x2, y2;

  // If the second entity is a tile, use its position
  if (entity2 instanceof rune.tilemap.Tile) {
    x2 = entity2.x;
    y2 = entity2.y;
  } else {
    // Otherwise, assume it's a player and use the player's position
    x2 = entity2.x;
    y2 = entity2.y;
  }

  var dx = entity1.x - x2;
  var dy = entity1.y - y2;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * This method creates a timer for a tile.
 * @param {number} time The duration of the timer.
 * @param {function} callback The callback function.
 * @param {number} tileIndex The index of the tile.
 * @returns {undefined}
 * @private
 */

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
 * This method stops the new enemy timer.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_stopNewEnemyTimer = function () {
  if (this.game.enemies.newEnemyTimer) {
    this.game.enemies.newEnemyTimer.stop();
  }
};
