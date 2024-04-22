//--------------------------------
// Constructor scope
//--------------------------------

ArcticMadness.map.Map = function (map) {
  this.map = map;
  this.tiles = this.map.back.m_data;
  

  ArcticMadness.map.Map.prototype.init.call(this);
};

//------------------------------------------------------------------------------

ArcticMadness.map.Map.prototype.init = function () {
  console.log(this.map);

  
};

ArcticMadness.map.Map.prototype.changeRandomTile = function () {
  for (var i = 0; i < this.tiles.length; i++) {
    if (this.tiles[i] == 3) {
      if (Math.random() < 0.03) {
        this.tiles[i] = 4;
        break;
      }
    }
  }
};
//--------------------------------------------------------------------------
// Private methods
//--------------------------------------------------------------------------




