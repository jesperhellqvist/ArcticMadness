//--------------------------------
// Constructor scope
//--------------------------------

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
  this.enemies = enemies; // Reference to the enemies object
  this.numRandamCracks = 0;
  this.repairedTilesScore = 0;

  ArcticMadness.map.Map.prototype.init.call(this);
};

//------------------------------------------------------------------------------
// Public prototype methods
//------------------------------------------------------------------------------

// This is the init method, which is called when the object is created.

ArcticMadness.map.Map.prototype.init = function () {
  this.crackRandomTile();
  this.setCrackTimer();
};

// This is the update method, which is called every frame from the Game.

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
      } else {
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
    if (
      this.tiles[i] === 9 ||
      this.tiles[i] === 10 ||
      this.tiles[i] === 11 ||
      this.tiles[i] === 12 ||
      this.tiles[i] === 13 ||
      this.tiles[i] === 14 ||
      this.tiles[i] === 15 ||
      this.tiles[i] === 16 ||
      this.tiles[i] === 17 ||
      this.tiles[i] === 18 ||
      this.tiles[i] === 19 ||
      this.tiles[i] === 20 ||
      this.tiles[i] === 21 ||
      this.tiles[i] === 22 ||
      this.tiles[i] === 23 ||
      this.tiles[i] === 24
    ) {
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
 * @param {object} player The player object.
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
          this.tileLayer.setTileValueAt(tileIndex, 1);
          return;
        }
      }
    }
  }
};

/**
 * This method returns the index of the nearest ice tile.
 * @param {object} player The player object.
 * @returns {number} The index of the nearest ice tile.
 */

ArcticMadness.map.Map.prototype.getNearestIceTileIndex = function (player) {
  var nearestTileIndex = null;
  var nearestDistance = Infinity;

  // Loop through all tiles
  for (var i = 0; i < this.tileLayer.data.length; i++) {
    var tileIndex = this.tileLayer.data[i];
    // If the tile value is 2 (ice tile)
    if (
      tileIndex === 1 ||
      tileIndex === 2 ||
      tileIndex === 3 ||
      tileIndex === 4 ||
      tileIndex === 5 ||
      tileIndex === 6 ||
      tileIndex === 7 ||
      tileIndex === 8
    ) {
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

ArcticMadness.map.Map.prototype.setCrackTimer = function (currentWave) {
  this.newCrackTimer = this.game.timers.create(
    {
      duration: 2000,
      onTick: function () {
        this.crackRandomTile();
        this.setCrackTimer();
      },
      scope: this,
    },
    true
  );
};

/**
 * This method changes a random ice tile to a crack tile.
 * @returns {undefined}
 */

ArcticMadness.map.Map.prototype.crackRandomTile = function (currentWave) {
  var iceTiles = [];
  if(currentWave != undefined){
    this.numRandamCracks = currentWave;
    this.m_callCrackRandomTile(this.numRandamCracks);
  }

  // Find all tiles with with ice
  for (var i = 0; i < this.tiles.length; i++) {
    if (
      this.tiles[i] === 1 ||
      this.tiles[i] === 2 ||
      this.tiles[i] === 3 ||
      this.tiles[i] === 4 ||
      this.tiles[i] === 5 ||
      this.tiles[i] === 6 ||
      this.tiles[i] === 7 ||
      this.tiles[i] === 8
    ) {
      iceTiles.push(i);
    }
  }

  if (iceTiles.length > 0) {
    // Randomly select one of the ice tiles
    var randomIndex = iceTiles[Math.floor(Math.random() * iceTiles.length)];
    this.crackSound = this.map.application.sounds.sound.get("cracking");
    // this.crackSound.play();
    this.crackSound.loop = false;
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

ArcticMadness.map.Map.prototype.m_callCrackRandomTile = function (currentWave) {
  currentWave *= 2;
  console.log(currentWave);
  for (var i = 0; i < currentWave; i++) {
    this.crackRandomTile();
  }
}

/**
 * This method resets the map to its original state. Then it revives all players, disposes all enemies, and stops the new crack and enemy timers.
 * @returns {undefined}
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

  this.m_stopTileTimers();
  this.m_reviveAllPlayers();
  this.m_disposeEnemies();
  this.m_stopNewCrackTimer();
  this.m_stopNewEnemyTimer();
};

//------------------------------------------------------------------------------
// Public methods related to the enemies
//------------------------------------------------------------------------------

ArcticMadness.map.Map.prototype.checkIfEnemyInWater = function (enemy) {
  var tileValue = this.tileLayer.getTileValueOf(enemy.centerX, enemy.centerY);
  if (
    tileValue === 9 ||
    tileValue === 10 ||
    tileValue === 11 ||
    tileValue === 12 ||
    tileValue === 13 ||
    tileValue === 14 ||
    tileValue === 15 ||
    tileValue === 16 ||
    tileValue === 17 ||
    tileValue === 18 ||
    tileValue === 19 ||
    tileValue === 20 ||
    tileValue === 21 ||
    tileValue === 22 ||
    tileValue === 23 ||
    tileValue === 24
  ) {
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
 * This method removes the ice at a specific tile index.
 * @param {number} index The index of the tile to remove.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_removeIce = function (index) {
  this.tileLayer.setTileValueAt(index, 20);
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
    { x: 0, y: -32 }, // Above
    { x: 0, y: 96 }, // Below
    { x: -32, y: 0 }, // Left
    { x: 96, y: 0 }, // Right
    { x: -32, y: -32 }, // Above left
    { x: 96, y: -32 }, // Above right
    { x: -32, y: 96 }, // Below left
    { x: 96, y: 96 }, // Below right
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

    if (
      tileValue === 1 ||
      tileValue === 2 ||
      tileValue === 3 ||
      tileValue === 4 ||
      tileValue === 5 ||
      tileValue === 6 ||
      tileValue === 7 ||
      tileValue === 8
    ) {
      this.tileLayer.setTileValueAt(tileIndex, 33);
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
 * @param {object} player The player object.
 * @param {number} tileValue The value of the tile.
 * @param {object} playerTile The tile object.
 * @param {number} playerTileIndex The index of the player's tile.
 * @param {object} timer The timer object.
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
  this.animationBlock = new rune.tilemap.Block(this.map, tileValue);
  this.animationBlock.x = playerTile.x;
  this.animationBlock.y = playerTile.y;
  console.log(tileValue);
  var animationFrames = [];
  for (var i = tileValue - 1; i >= 31; i--) {
    animationFrames.push(i);
  }
  var lastFrame = animationFrames.length - 1;
  this.animationBlock.animation.create("crackToIce", animationFrames, 2, false);
  this.animationBlock.animation.current.scripts.add(
    lastFrame,
    function () {
      this.m_repairIce(player, tileValue, playerTileIndex, timer);
      if (
        this.animationBlock &&
        this.animationBlock.animation &&
        this.animationBlock.animation.current
      ) {
        this.animationBlock.animation.current.scripts.remove(lastFrame);
      }
    },
    this
  );

  this.game.stage.addChildAt(this.animationBlock, 0);
  player.animationBlock = this.animationBlock;
};

//------------------------------------------------------------------------------
// Private methods related to the players interaction with the map
//------------------------------------------------------------------------------

/**
 * This method checks if the player is standing on a water tile.
 * @param {object} player The player object.
 * @returns {boolean} Returns true if the player is standing on water.
 * @returns {boolean} Returns false if the player is not standing on water.
 * @private
 */

ArcticMadness.map.Map.prototype.m_isPlayerInWater = function (player) {
  var tileValue = this.tileLayer.getTileValueOf(
    player.centerX,
    player.centerY + 18
  );

  if (
    tileValue === 9 ||
    tileValue === 10 ||
    tileValue === 11 ||
    tileValue === 12 ||
    tileValue === 13 ||
    tileValue === 14 ||
    tileValue === 15 ||
    tileValue === 16 ||
    tileValue === 17 ||
    tileValue === 18 ||
    tileValue === 19 ||
    tileValue === 20 ||
    tileValue === 21 ||
    tileValue === 22 ||
    tileValue === 23 ||
    tileValue === 24
  ) {
    return true;
  }

  return false;
};

/**
 * This method updates the player's state when standing on a water tile.
 * @param {object} player The player object.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_updatePlayerState = function (player) {
  if (player != null && player.isAlive) {
    player.isInWater = true;
    player.velocity.x = 0;
    player.velocity.y = 0;
    player.health -= 1;
    var playerTile = this.tileLayer.getTileOf(
      player.centerX,
      player.centerY + 18
    );

    var playerTileIndex = this.tileLayer.getTileIndexOf(
      player.centerX,
      player.centerY + 18
    );
    player.inWaterTile = playerTileIndex;
    player.isRevivable = true;
    if (player.revivingTileSet === false) {
      this.m_setReviveTile(player);
    }

    if (player.health == 125) {
      this.helpSound = this.map.application.sounds.sound.get("help");
      this.helpSound.play();
      this.helpSound.loop = false;
    }
    if (player.health <= 0) {
      this.m_killPlayer(player);
      this.removeReviveTile(player);
    }

    if (!player.falling) {
      this.game.tweenWater(player, playerTile);
      player.gun.alpha = 0;
    }
  }
};

/**
 * This method checks if the player is standing on a revive tile.
 * @param {object} player The player object.
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
 * @param {object} player The player object.
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
        if (
          tileValue === 1 ||
          tileValue === 2 ||
          tileValue === 3 ||
          tileValue === 4 ||
          tileValue === 5 ||
          tileValue === 6 ||
          tileValue === 7 ||
          tileValue === 8
        ) {
          this.tileLayer.setTileValueAt(tileIndex, 38);
          return;
        }
      }
    }
  }
};

/**
 * This method kills the player.
 * @param {object} player The player object.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_killPlayer = function (player) {
  player.isAlive = false;
  player.isRevivable = false;
  player.animation.gotoAndPlay("death",0);
  //this.game.gameOver();
};

/**
 * This method handles the input from the gamepad.
 * @param {object} player The player object.
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
 * @param {object} player The player object.
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
 * @param {object} player The player object.
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
 * @returns {undefined}
 * @param {object} player The player object.
 * @param {number} tileValue The value of the tile.
 * @param {number} playerTileIndex The index of the player's tile.
 * @param {object} timer The timer object.
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

  if (
    tileValue === 33 ||
    tileValue === 34 ||
    tileValue === 35 ||
    tileValue === 36 ||
    tileValue === 37
  ) {
    this.tileLayer.setTileValueAt(playerTileIndex, 1);
    this.completedSound =
      this.map.application.sounds.sound.get("repaircomplete");
    this.completedSound.play();
    this.completedSound.loop = false;
    this.repairedTilesScore += 10;
    this.game.updateScore(10);

  }
  // animationBlock.dispose();  fixa så att animationBlock försvinner med dispose
  this.game.stage.removeChild(player.animationBlock, true);
  player.isRepairing = false;
  player.animation.gotoAndPlay("idle");
  player.gun.alpha = 1; // Show the gun
};

/**
 * This method revives the nearest player.
 * @param {object} revivingPlayer The player object.
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
    this.revivedSound = this.map.application.sounds.sound.get("saved");
    this.revivedSound.play();
    this.revivedSound.loop = false;
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

//------------------------------------------------------------------------------
// Private utility methods related to the game, waves and enemies
//------------------------------------------------------------------------------

/**
 * This method revives all players.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_reviveAllPlayers = function () {
  for (var i = 0; i < this.players.length; i++) {
    var player = this.players[i];
    this.game.revivePlayer(player);
  }
};

/**
 * This method disposes all enemies.
 * @returns {undefined}
 * @private
 */

ArcticMadness.map.Map.prototype.m_disposeEnemies = function () {
  this.game.enemies.disposeEnemies();
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
