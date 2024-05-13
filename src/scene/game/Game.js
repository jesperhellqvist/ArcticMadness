//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Creates a new object.
 *
 * @constructor
 * @extends rune.scene.Scene
 *
 * @class
 * @classdesc
 *
 * Game scene.
 */
ArcticMadness.scene.Game = function () {
  this.map = null;
  this.player = null;
  this.enemies = null;
  this.players = [];
  this.gamepadsConected = [];
  this.currentWave = 1;
  this.waveTimer = null;
  this.liveScore = null;
  this.duration = 45000;
  //--------------------------------------------------------------------------
  // Super call
  //--------------------------------------------------------------------------

  /**
   * Calls the constructor method of the super class.
   */
  rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

ArcticMadness.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
ArcticMadness.scene.Game.prototype.constructor = ArcticMadness.scene.Game;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated.
 * The method is used to create objects to be used within the scene.
 *
 * @returns {undefined}
 */
ArcticMadness.scene.Game.prototype.init = function () {
  rune.scene.Scene.prototype.init.call(this);
  this.stage.map.load("map");
  this.m_initLiveScore();
  this.m_initWaveText();


  if (this.gamepads.get(0) != null) {
    this.player = new ArcticMadness.entity.Player(
      700,
      100,
      "64_penguin_nogun",
      {
        r: "250",
        g: "0",
        b: "0",
      },
      {
        left: "A",
        right: "D",
        up: "W",
        down: "S",
        shoot: "SPACE",
      },
      this.gamepads.get(0),
      0
    );
    this.players.push(this.player);
    this.gamepadsConected.push(this.gamepads.get(0));
  }
  if (this.gamepads.get(1) != null) {
    this.player = new ArcticMadness.entity.Player(
      700,
      100,
      "64_penguin_nogun",
      {
        r: "0",
        g: "250",
        b: "0",
      },
      {
        left: "LEFT",
        right: "RIGHT",
        up: "UP",
        down: "DOWN",
        shoot: "ENTER",
      },
      this.gamepads.get(1),
      1
    );
    this.players.push(this.player);
    this.gamepadsConected.push(this.gamepads.get(1));
  }
  // if (this.gamepads.get(2) != null) {
  //   this.player = new ArcticMadness.entity.Player(
  //     700,
  //     100,
  //     "64_penguin_nogun",
  //     {
  //       r: "0",
  //       g: "0",
  //       b: "250",
  //     },
  //     {
  //       left: "J",
  //       right: "L",
  //       up: "I",
  //       down: "K",
  //       shoot: "O",
  //     },
  //     this.gamepads.get(2),
  //     2
  //   );
  //   this.players.push(this.player);
  //   this.gamepadsConected.push(this.gamepads.get(2));
  // }

  this.enemies = new ArcticMadness.entity.Enemies(this, this.players);

  this.map = new ArcticMadness.map.Map(
    this.stage.map,
    this.players,
    this,
    this.gamepadsConected,
    this.enemies
  );

  this.m_addPlayersToStage();
  this.m_startWaveTimer();
  //this.stage.addChild(this.player);
};

//------------------------------------------------------------------------------
// Private prototype init methods
//------------------------------------------------------------------------------

ArcticMadness.scene.Game.prototype.m_initLiveScore = function () {
  this.liveScore = new ArcticMadness.entity.LiveScore(this);
}

ArcticMadness.scene.Game.prototype.m_initWaveText = function () {
  this.timerText = new rune.text.BitmapField("wave " + this.currentWave + Math.floor(this.duration / 1000), "thefont");
  this.timerText.autoSize = false;
  this.timerText.width = 200;
  this.timerText.height = 100;
  this.timerText.scaleX = 2;
  this.timerText.scaleY = 2;
  this.timerText.x = 700;
  this.timerText.y = 20;
  this.stage.addChild(this.timerText);
}

/**
 * This method is automatically executed once per "tick". The method is used for
 * calculations such as application logic.
 *
 * @param {number} step Fixed time step.
 *
 * @returns {undefined}
 */
ArcticMadness.scene.Game.prototype.update = function (step) {
  rune.scene.Scene.prototype.update.call(this, step);
  this.m_checkBullet();
  this.map.update(step);
  this.enemies.update(step);
  this.timerText.text = "wave " + this.currentWave + " " + Math.floor(this.duration / 1000);
  this.duration -= step;
  if (this.duration <= 0) {
    this.timerText.text = "";
    this.duration = 45000;

  };
};

ArcticMadness.scene.Game.prototype.gameOver = function () {
  var text = new rune.text.BitmapField("game over", "thefont");
  text.center = this.application.screen.center;
  text.autoSize = true;
  text.scaleX = 4;
  text.scaleY = 4;
  this.stage.addChild(text);
};

ArcticMadness.scene.Game.prototype.tweenWater = function (player, playerTile) {
  player.falling = true;
  this.tweens.create({
    target: player,
    scope: this,
    duration: 550,
    onUpdate: function (player) {
      player.animation.gotoAndPlay("falling");
      this.drownSoundEffect = this.application.sounds.sound.get("Splash");
      this.drownSoundEffect.play();
      this.drownSoundEffect.loop = false;
    },
    onDispose: function (player) {
      player.isInWater = true;
      player.velocity.x = 0;
      player.velocity.y = 0;
      if (player.isInWater && player.falling) {
        player.animation.gotoAndPlay("drown");
      }
    },
    args: {
      x: playerTile.x,
      y: playerTile.y,
    },
  });
};

ArcticMadness.scene.Game.prototype.resetPlayer = function (player) {

  var nearestIceTileIndex = this.map.getNearestIceTileIndex(player);
  var nearestIceTile = this.map.tileLayer.getTileAt(nearestIceTileIndex);


  player.isInWater = false;
  player.isRevivable = false;
  player.isAlive = true;
  player.isAttacked = false;
  player.falling = false;
  player.inWaterTile = null;
  player.revivingTileSet = false;
  player.health = 250; // Or whatever the max health is
  player.x = nearestIceTile.x;
  player.y = nearestIceTile.y;
  player.animation.gotoAndPlay("idle");
};

ArcticMadness.scene.Game.prototype.revivePlayer = function (player) {
  this.map.removeReviveTile(player);
  this.resetPlayer(player);
};

/**
 * This method is automatically called once just before the scene ends. Use
 * the method to reset references and remove objects that no longer need to
 * exist when the scene is destroyed. The process is performed in order to
 * avoid memory leaks.
 *
 * @returns {undefined}
 */
ArcticMadness.scene.Game.prototype.dispose = function () {
  rune.scene.Scene.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Private prototype methods
//------------------------------------------------------------------------------

ArcticMadness.scene.Game.prototype.m_checkBullet = function () {
  for (var i = 0; i < this.players.length; i++) {
    var player = this.players[i];
    for (var j = 0; j < player.gun.bullets.length; j++) {
      if (player.gun.bullets[j] != null) {
        this.m_checkBulletHitEnemy(player.gun.bullets[j]);
      }
    }
  }
};

ArcticMadness.scene.Game.prototype.m_checkBulletHitEnemy = function (bullet) {
  for (var i = 0; i < this.enemies.enemies.length; i++) {
    if (bullet.hitTestObject(this.enemies.enemies[i])) {
      bullet.dispose();
      this.stage.removeChild(this.enemies.enemies[i], true);
      this.enemies.enemies.splice(i, 1);
      
      this.updateScore(10);
      
    //   this.enemies.enemies[i].animation.create("death", [8,9,10,11,12,13], 5, false);
    //   this.enemies.enemies[i].animation.gotoAndPlay("death");
    //  this.enemies.enemies[i].animation.current.scripts.add(13, function () {
    //   console.log("enemy killed");
    //   this.stage.removeChild(this.enemies.enemies[i], true);
    //   this.enemies.enemies.splice(i, 1);
    //  }, this);
    //  console.log(this.enemies.enemies[i].animation.current.name);
    }
  }
};

ArcticMadness.scene.Game.prototype.updateScore = function (score) {
 
  this.liveScore.score += score;
  this.liveScore.updateScoreText();
  
}

ArcticMadness.scene.Game.prototype.m_addPlayersToStage = function () {
  for (var i = 0; i < this.players.length; i++) {
    this.stage.addChild(this.players[i]);
  }
};


ArcticMadness.scene.Game.prototype.m_startWaveTimer = function () {

  this.waveTimer = this.timers.create({
    duration: 45000,
    scope: this,
    onComplete: function () {
      this.currentWave++;
      this.map.resetMap();
      this.waveCompleteSoundEffect = this.application.sounds.sound.get("wavecomplete");
      this.waveCompleteSoundEffect.play();
      this.waveCompleteSoundEffect.loop = false;
      this.m_showWaveText(this.currentWave);
    },
    onUpdate: function (step) {
      
      this.updateScore();
    }
  });
  this.waveTimer.start();
}

ArcticMadness.scene.Game.prototype.m_showWaveText = function (wave) {
  var text = new rune.text.BitmapField("wave " + wave + " completed!", "thefont");
  text.autoSize = true;
  text.scaleX = 4;
  text.scaleY = 4;
  text.center = this.application.screen.center;

  this.stage.addChild(text);
  this.timers.create({
    duration: 3000,
    scope: this,
    onComplete: function () {
      this.stage.removeChild(text, true);
      this.m_countDown(wave);
    },
  }).start();
};

ArcticMadness.scene.Game.prototype.m_countDown = function (wave) {
  var createText = function (textString) {
    var text = new rune.text.BitmapField(textString, "thefont");
    text.center = this.application.screen.center;
    text.autoSize = true;
    text.scaleX = 4;
    text.scaleY = 4;
    return text;
  }.bind(this);

  var text = createText("3");
  this.stage.addChild(text);

  this.timers.create({
    duration: 1000,
    scope: this,
    onComplete: function () {
      this.stage.removeChild(text, true);
      text = createText("2");
      this.stage.addChild(text);

      this.timers.create({
        duration: 1000,
        scope: this,
        onComplete: function () {
          this.stage.removeChild(text, true);
          text = createText("1");
          this.stage.addChild(text);

          this.timers.create({
            duration: 1000,
            scope: this,
            onComplete: function () {
              this.stage.removeChild(text, true);
              this.m_startWaveTimer();
              this.m_startNextWave(wave);
            },
          }).start();
        },
      }).start();
    },
  }).start();
};


ArcticMadness.scene.Game.prototype.m_startNextWave = function () {
  this.enemies.startNewEnemyTimer();
  this.map.crackRandomTile(this.currentWave);
  this.map.setCrackTimer(this.currentWave);
};