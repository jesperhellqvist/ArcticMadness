//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.map.Map = function (map, player, enemy, game) {
  this.map = map;
  this.tiles = this.map.back.m_data; // Array of tile values
  this.tile = this.map.back.m_tmpTile; // Temporary tile object
  this.tileLayer = this.map.back; // Reference to the tile layer
  this.player = player; // Reference to the player object
  this.enemy = enemy; // Reference to the enemy object
  this.game = game; // Reference to the game object
  ArcticMadness.map.Map.prototype.init.call(this);
};

//------------------------------------------------------------------------------

ArcticMadness.map.Map.prototype.init = function () {
  this.changeRandomTile();

  this.startUpdate();
};

ArcticMadness.map.Map.prototype.startUpdate = function () {
  this.createTimer(60, function () {
    this.update();
    this.startUpdate();
  });
};

ArcticMadness.map.Map.prototype.update = function (step) {
  console.log("Map update");
  this.checkPlayerInWater();
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
    this.createTimer(1000, function () {
      this.m_breakIce(randomIndex);
    }); // Create a timer for this tile
  }
};

ArcticMadness.map.Map.prototype.checkPlayerInWater = function () {
  if (this.isPlayerInWater()) {
    this.player.health -= 1;
    console.log("Player health: " + this.player.health);
  }
};

//--------------------------------------------------------------------------
// Private methods
//--------------------------------------------------------------------------

ArcticMadness.map.Map.prototype.createTimer = function (time, callback) {
  this.game.timers.create(
    {
      duration: time,
      onTick: callback,
      scope: this,
    },
    true
  );
};

// ArcticMadness.map.Map.prototype.m_checkMap = function () {
//   console.log(this.tiles);
//   for (var i = 0; i < this.tiles.length; i++) {
//     if (this.tiles[i] == 20) {
//       var index = i;
//       this.game.timers.create(
//         {
//           duration: 1000,
//           onTick: function () {
//             this.m_breakIce(index);
//           },

//           scope: this,
//         },
//         true
//       );
//       break;
//     }
//   }
// };

ArcticMadness.map.Map.prototype.m_breakIce = function (index) {
  this.tileLayer.setTileValueAt(index, 15);
  this.createTimer(1000, function () {
    this.m_removeIce(index);
  });
};

ArcticMadness.map.Map.prototype.m_removeIce = function (index) {
  this.tileLayer.setTileValueAt(index, 1);
  this.changeRandomTile();
};

ArcticMadness.map.Map.prototype.isPlayerInWater = function () {

  // if(this.tileLayer.hitTestAndSeparate(this.player)){
  //   return true;
  // }else{
  //   return false;
  // }

  var tileValue = this.tileLayer.getTileValueOf(
    this.player.centerX,
    this.player.centerY
  );

  if (tileValue === 1) {
    return true;
  } else {
    return false;
  }
};
