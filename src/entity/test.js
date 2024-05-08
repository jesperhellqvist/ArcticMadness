
ArcticMadness.map.Map.prototype.update = function (step) {
    for (var i = 0; i < this.players.length; i++) {
      var player = this.players[i];
      if (player.isAlive) {
        var playerInWater = this.m_isPlayerInWater(player);
        this.m_updatePlayerState(playerInWater);
  
        if (!player.isInWater) {
          this.m_handleInputGamepad(player);
        }
      }
    }
  };

ArcticMadness.map.Map.prototype.m_updatePlayerState = function (player) {
    if (player != null && player.isAlive) {
      var playerTile = this.tileLayer.getTileOf(
        player.centerX,
        player.centerY + 18
      );
  
      if (!player.falling) {
        this.game.tweenWater(player, playerTile);
        player.gun.alpha = 0;
      }
    }
  };
  
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
      player.isInWater = true;
      player.health -= 1;
      var playerTile = this.tileLayer.getTileIndexOf(player.centerX, player.centerY);
      player.inWaterTile = playerTile;
  
      if (player.health <= 0) {
        this.m_killPlayer(player);
      }
  
      return player;
    }
  
    player.isInWater = false;
    return null;
  };



  ArcticMadness.map.Map.prototype.update = function (step) {
    

    for (var i = 0; i < this.players.length; i++) {
      var player = this.players[i];
      if (player.isAlive) {
        if (this.m_isPlayerInWater(player)) {
          this.m_updatePlayerState(player);
        } else {
          player.isInWater = false;
          player.inWaterTile = null;
          if (this.m_isPlayerOnReviveTile(player)) {
            this.game.revivePlayer(player);
          }
  
          this.m_handleInputGamepad(player);
        }
      }
    }
  };