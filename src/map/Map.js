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
  }
};

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

// ArcticMadness.map.Map.prototype.m_getDistanceBetween = function (player1, player2) {
//   var dx = player1.x - player2.x;
//   var dy = player1.y - player2.y;
//   return Math.sqrt(dx * dx + dy * dy);
// };

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
        if (tileValue === 17) {
          this.tileLayer.setTileValueAt(tileIndex, 2);
          return;
        }
      }
    }
  }
};

ArcticMadness.map.Map.prototype.getNearestIceTileIndex = function (player) {
  var nearestTileIndex = null;
  var nearestDistance = Infinity;

  // Loop through all tiles
  for (var i = 0; i < this.tileLayer.data.length; i++) {
    var tileIndex = this.tileLayer.data[i];
    // If the tile value is 2 (ice tile)
    if (tileIndex === 2) {
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

//------------------------------------------------------------------------------
// Control Waves
//------------------------------------------------------------------------------

ArcticMadness.map.Map.prototype.resetMap = function () {
  // this.map.clear();

  var tileValues = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
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

//--------------------------------------------------------------------------
// Private methods
//--------------------------------------------------------------------------

ArcticMadness.map.Map.prototype.m_stopTileTimers = function () {
  for (var key in this.tileTimers) {
    var timer = this.tileTimers[key];
    timer.stop();
  }
};

ArcticMadness.map.Map.prototype.m_reviveAllPlayers = function () {
  for (var i = 0; i < this.players.length; i++) {
    var player = this.players[i];
    this.game.revivePlayer(player);
  }
};

ArcticMadness.map.Map.prototype.m_disposeEnemies = function () {
  this.game.enemies.disposeEnemies();
};

ArcticMadness.map.Map.prototype.m_stopNewCrackTimer = function () {
  if (this.newCrackTimer) {
    this.newCrackTimer.stop();
  }
};

ArcticMadness.map.Map.prototype.m_stopNewEnemyTimer = function () {
  if (this.game.enemies.newEnemyTimer) {
    this.game.enemies.newEnemyTimer.stop();
  }
}

/**
 * This method checks if the player is standing on a water tile.
 * @returns {boolean} Returns true if the player is standing on water.
 */

ArcticMadness.map.Map.prototype.m_isPlayerInWater = function (player) {
  var tileValue = this.tileLayer.getTileValueOf(
    player.centerX,
    player.centerY + 18
  );

  if (tileValue === 1) {
    return true;
  }

  return false;
};

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

ArcticMadness.map.Map.prototype.m_isPlayerOnReviveTile = function (player) {
  var tileValue = this.tileLayer.getTileValueOf(
    player.centerX,
    player.centerY + 18
  );

  if (tileValue === 17) {
    return true;
  }
  return false;
};

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
      console.log(tileIndex);
      if (tileIndex >= 0) {
        var tileValue = this.tileLayer.getTileValueAt(tileIndex);
        if (tileValue === 2) {
          this.tileLayer.setTileValueAt(tileIndex, 17);
          return;
        }
      }
    }
  }
};

ArcticMadness.map.Map.prototype.m_killPlayer = function (player) {
  player.isAlive = false;
  player.isRevivable = false;
  player.animation.gotoAndPlay("death");
  //this.game.gameOver();
};

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
  this.tileLayer.setTileValueAt(index, 4); // Denna raden är de som är knasig, hoppar över "tiles".
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
 */

ArcticMadness.map.Map.prototype.m_removeIce = function (index) {
  this.tileLayer.setTileValueAt(index, 1);
};

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

    if (tileValue === 2) {
      this.tileLayer.setTileValueAt(tileIndex, 3);
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
    this.crackSound = this.map.application.sounds.sound.get("cracking");
    // this.crackSound.play();
    this.crackSound.loop = false;
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

/**
 * This method handles the input from the gamepad.
 * @param {object} player The player object.
 * @returns {undefined}
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
 * This method creates an animation block for the repair process.
 * @param {object} player The player object.
 * @param {number} tileValue The value of the tile.
 * @param {object} playerTile The tile object.
 * @param {number} playerTileIndex The index of the player's tile.
 * @param {object} timer The timer object.
 * @returns {undefined}
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

  var animationFrames = [];
  for (var i = tileValue - 1; i >= 1; i--) {
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

/**
 * This method stops the repair process and resumes the timer when the player releases the repair button.
 * @param {object} player The player object.
 * @param {object} timer The timer object.
 * @returns {undefined}
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
    tileValue === 3 ||
    tileValue === 4 ||
    tileValue === 5 ||
    tileValue === 6 ||
    tileValue === 7
  ) {
    this.tileLayer.setTileValueAt(playerTileIndex, 2);
    this.completedSound =
      this.map.application.sounds.sound.get("repaircomplete");
    this.completedSound.play();
    this.completedSound.loop = false;
  }
  // animationBlock.dispose();  fixa så att animationBlock försvinner med dispose
  this.game.stage.removeChild(player.animationBlock, true);
  player.isRepairing = false;
  player.animation.gotoAndPlay("idle");
  player.gun.alpha = 1; // Show the gun
};
