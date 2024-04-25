//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.map.Map = function (map, player, enemy, game, gamepad) {
  this.map = map;
  this.tiles = this.map.back.m_data; // Array of tile values
  this.tile = this.map.back.m_tmpTile; // Temporary tile object
  this.tileLayer = this.map.back; // Reference to the tile layer
  this.player = player; // Reference to the player object
  this.enemy = enemy; // Reference to the enemy object
  this.game = game; // Reference to the game object
  this.gamepad = gamepad; // Reference to the gamepad object
  this.tileTimers = {};
  this.repairTimer = null;

  ArcticMadness.map.Map.prototype.init.call(this);
};

//------------------------------------------------------------------------------

ArcticMadness.map.Map.prototype.init = function () {
  this.player.animation.create("idle", [0, 1, 2, 3], 8, true);
  this.player.animation.create("drown", [20, 21], 8, true);
  this.player.animation.create("repair", [25, 26, 27, 28], 8, true);
  
  this.changeRandomTile();

};


ArcticMadness.map.Map.prototype.update = function (step) {
  this.m_checkPlayerInWater();
  this.m_handleInputGamepad();
};

ArcticMadness.map.Map.prototype.changeRandomTile = function () {
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

ArcticMadness.map.Map.prototype.repairIce = function () {
  console.log("Repairing ice");
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
      timer.stop();
      delete this.tileTimers[playerTileIndex];
      this.changeRandomTile();
    }
  }
  this.player.animation.gotoAndPlay("idle");
  this.repairTimer = null;
};

//--------------------------------------------------------------------------
// Private methods
//--------------------------------------------------------------------------

ArcticMadness.map.Map.prototype.m_handleInputGamepad = function () {
  if(this.player.animation.currentAnimation === "drown") {
    return;
  }

  if (this.gamepad.pressed(2)) {
    if (!this.repairTimer) {
      this.player.animation.gotoAndPlay("repair");
      
      this.player.gun.alpha = 0; // Hide the gun
      this.repairTimer = this.game.timers.create(
        {
          duration: 2000,
          onComplete: function () {
            this.repairIce();
            this.repairTimer = null;
          },
          scope: this,
        },
        true
      );
    }
  } else {
    if (this.repairTimer) {
      this.player.animation.gotoAndPlay("idle");
      this.repairTimer.stop();
      this.repairTimer = null;
    }
    this.player.gun.alpha = 1; // Show the gun
  }
};

ArcticMadness.map.Map.prototype.m_checkPlayerInWater = function () {
  if (this.m_isPlayerInWater()) {
    var playerTile = this.tileLayer.getTileOf(
      this.player.centerX,
      this.player.centerY + 18
    );
    this.player.x = playerTile.x;
    this.player.y = playerTile.y;
    this.player.health -= 1;
    
    this.player.animation.gotoAndPlay("drown");
    console.log("Player health: " + this.player.health);
    
    if (this.player.health <= 0) {
      
      
    }
  } 
};

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

  if (time > 60) {
    this.tileTimers[tileIndex] = timer;
  }
};

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

ArcticMadness.map.Map.prototype.m_removeIce = function (index) {
  this.tileLayer.setTileValueAt(index, 1);
  this.changeRandomTile();
};

ArcticMadness.map.Map.prototype.m_isPlayerInWater = function () {
  // Check if the player is standing on a water tile
  var tileValue = this.tileLayer.getTileValueOf(
    this.player.centerX,
    this.player.centerY + 18
  );

  // If the tile value is 1, the player is standing on water
  if (tileValue === 1) {
    return true;
  } else {
    return false;
  }
};
