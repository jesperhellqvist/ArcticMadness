//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Creates a new game scene.
 *
 * @constructor
 * @extends rune.scene.Scene
 * @param {number} numberOfPlayers
 * @param {rune.sound.Sound} menuSound // ?? matihas?
 * @param {Array} gamepads
 *
 * @class
 * @classdesc
 *
 * Game scene.
 */
ArcticMadness.scene.Game = function (numberOfPlayers, menuSound, gamepads) {
  this.startFadeOut = true;
  this.numberOfPlayers = numberOfPlayers;
  this.map = null;
  this.player = null;
  this.enemies = null;
  this.players = [];
  this.gamepadsFromJoin = gamepads;
  this.gamepadsConected = [];
  this.menuSound = menuSound;
  this.currentWave = 1;
  this.waveTimer = null;
  this.liveScore = null;
  this.bonusContainer = null;
  this.duration = 45000;
  this.highscoreList = this.numberOfPlayers - 1;
  this.enemyScore = 0;
  this.colors = [
    { r: 133, g: 144, b: 255 }, // Player 1 orignal Blue
    { r: 244, g: 40, b: 45 }, // Player 2 Red
    { r: 16, g: 152, b: 86 }, // Player 3 Green
    { r: 255, g: 250, b: 5 }, // Player 4 Yellow
  ];

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
  this.cameras.getCameraAt(0).flash.start(2000);
  this.m_initLiveScore();
  this.m_initWaveText();
  this.m_initSound();
  this.m_initPlayers();
  this.m_initEnemies();
  this.m_initMap();
  this.m_startWaveTimer();
};

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
  this.m_checkIfPlayersAreDead();
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
  this.stage.removeChild(this.timerText, true);
  this.stage.removeChild(this.liveScore, true);
  this.stage.removeChild(this.map, true);
  this.stage.removeChild(this.enemies, true);
  this.enemies.dispose(); // kolla upp detta med henrik
  this.enemies = null;

  for (var i = 0; i < this.players.length; i++) {
    this.stage.removeChild(this.players[i], true);
  }
  rune.scene.Scene.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Public prototype methods
//------------------------------------------------------------------------------

ArcticMadness.scene.Game.prototype.resetPlayer = function (
  player,
  fromWaveComplete
) {
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
  // player.x = nearestIceTile.x;
  // player.y = nearestIceTile.y;
  player.gun.alpha = 1;
  player.flicker.start();
  player.animation.gotoAndPlay("idle");

  if (fromWaveComplete) {
    player.x = 540 + player.id * 50;
    player.y = 50;
  } else {
    player.x = nearestIceTile.x;
    player.y = nearestIceTile.y;
  }
};

ArcticMadness.scene.Game.prototype.revivePlayer = function (
  player,
  fromWaveComplete
) {
  this.map.removeReviveTile(player);
  this.resetPlayer(player, fromWaveComplete);
};

ArcticMadness.scene.Game.prototype.updateScore = function (score) {
  this.liveScore.score += score;
  this.liveScore.updateScoreText();
};

//------------------------------------------------------------------------------
// Private prototype init methods
//------------------------------------------------------------------------------

ArcticMadness.scene.Game.prototype.m_initLiveScore = function () {
  this.liveScore = new ArcticMadness.entity.LiveScore(this);
  this.highscore = this.application.highscores.get(0, this.numberOfPlayers - 1).score;
  this.allTimeHighscoreText = new rune.text.BitmapField(
    "HIGHSCORE;" + this.highscore,
    "thefont"
  );
  this.allTimeHighscoreText.autoSize = true;
  this.allTimeHighscoreText.width = 200;
  this.allTimeHighscoreText.height = 100;
  this.allTimeHighscoreText.scaleX = 2;
  this.allTimeHighscoreText.scaleY = 2;
  this.allTimeHighscoreText.x = 20;
  this.allTimeHighscoreText.y = 20;
  this.stage.addChild(this.allTimeHighscoreText);
  
};

ArcticMadness.scene.Game.prototype.m_initWaveText = function () {
  this.timerText = new rune.text.BitmapField(
    "WAVE; " + this.currentWave +" "+ Math.floor(this.duration / 1000),
    "thefont"
  );
  this.timerText.autoSize = false;
  this.timerText.width = 200;
  this.timerText.height = 100;
  this.timerText.scaleX = 2;
  this.timerText.scaleY = 2;
  this.timerText.x = 450;
  this.timerText.y = 20;
  this.stage.addChild(this.timerText);
  
};



ArcticMadness.scene.Game.prototype.m_initSound = function () {
  this.gameMusic = this.application.sounds.master.get("music_bg");
  this.drownSoundEffect = this.application.sounds.sound.get("splash");
  this.drownSoundEffect.loop = false;
  this.waveCompleteSoundEffect = this.application.sounds.sound.get("wavecomplete");
  this.waveCompleteSoundEffect.loop = false;
  this.quakeSoundEffect = this.application.sounds.sound.get("quake");
  this.quakeSoundEffect.loop = false;
  this.gameMusic.volume = 0;
  this.gameMusic.fade(1, 3000);
  this.gameMusic.play();
  this.gameMusic.loop = true;
};

ArcticMadness.scene.Game.prototype.m_initPlayers = function () {
  for (var i = 0; i < this.numberOfPlayers; i++) {
    this.player = new ArcticMadness.entity.Player(
      540 + i * 50,
      360,
      "penguin_texture_64x64",
      {
        r: this.colors[i].r,
        g: this.colors[i].g,
        b: this.colors[i].b,
      },
      this.gamepads.get(this.gamepadsFromJoin[i]),
      i
    );
    this.players.push(this.player);
    this.gamepadsConected.push(this.gamepads.get(0));
    this.stage.addChild(this.players[i]);
  }
};

ArcticMadness.scene.Game.prototype.m_initEnemies = function () {
  this.enemies = new ArcticMadness.entity.Enemies(this, this.players);
  console.log(this.enemies);
};

ArcticMadness.scene.Game.prototype.m_initMap = function () {
  this.map = new ArcticMadness.map.Map(
    this.stage.map,
    this.players,
    this,
    this.gamepadsConected,
    this.enemies
  );
  this.map.resetMap();
};

ArcticMadness.scene.Game.prototype.tweenWater = function (player, playerTile) {
  player.falling = true;
  this.tweens.create({
    target: player,
    scope: this,
    duration: 550,
    onUpdate: function (player) {
      player.animation.gotoAndPlay("falling");
      this.drownSoundEffect.play();
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

ArcticMadness.scene.Game.prototype.resetPlayer = function (
  player,
  fromWaveComplete
) {
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
  player.gun.alpha = 1;
  player.flicker.start();
  player.animation.gotoAndPlay("idle");

  if (fromWaveComplete) {
    player.x = 540 + player.id * 50;
    player.y = 100;
  } else {
    player.x = nearestIceTile.x;
    player.y = nearestIceTile.y;
  }
};

ArcticMadness.scene.Game.prototype.revivePlayer = function (
  player,
  fromWaveComplete
) {
  this.map.removeReviveTile(player);
  this.resetPlayer(player, fromWaveComplete);
};

ArcticMadness.scene.Game.prototype.reviveAllPlayers = function () {
  for (var i = 0; i < this.players.length; i++) {
    this.revivePlayer(this.players[i], true);
  }
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
  console.log("dispose game scene");
  for (var i = 0; i < this.players.length; i++) {
    this.stage.removeChild(this.players[i], true);
  }
  this.stage.removeChild(this.timerText, true);
  this.stage.removeChild(this.liveScore, true);
  this.map.dispose();
  this.stage.removeChild(this.map, true);
  this.enemies.dispose();
  this.stage.removeChild(this.enemies, true);

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
        this.m_checkBulletHitEnemy(player.gun.bullets[j], player, j);
      }
    }
  }
};

ArcticMadness.scene.Game.prototype.m_checkBulletHitEnemy = function (bullet, player, index) {
  for (var i = 0; i < this.enemies.enemies.length; i++) {
    if (bullet.hitTestObject(this.enemies.enemies[i])) {
      this.stage.removeChild(bullet, true);
      player.gun.bullets.splice(index, 1);
      this.enemies.enemies[i].killenemy();
      this.enemies.enemies.splice(i, 1);
      this.enemyScore += 5;
      this.updateScore(5);
    }
  }
};

ArcticMadness.scene.Game.prototype.m_startWaveTimer = function () {
  this.cameras.getCameraAt(0).shake.start(1500, 5, 5, true);
  this.quakeSoundEffect.play();
  this.lastScoreUpdate = 0;
  this.waveTimer = this.timers.create({
    duration: 45000,
    scope: this,
    onComplete: function () {
      this.currentWave++;
      this.duration = 45000;
      this.m_updateWaveTimerText();
      this.map.resetMap();
      this.map.stopWave();
      this.reviveAllPlayers();
      this.waveCompleteSoundEffect.play();
      this.m_showWaveText(this.currentWave - 1);
    },
    onUpdate: function () {
      if (
        Math.floor(this.waveTimer.progressTotal * 45) > this.lastScoreUpdate
      ) {
        this.m_updateWaveTimerText();
        this.updateScore(1);
        this.lastScoreUpdate = Math.floor(this.waveTimer.progressTotal * 45);
      }
    },
  });
  this.waveTimer.start();
};

ArcticMadness.scene.Game.prototype.m_stopWaveTimer = function () {
  if (this.waveTimer != null) {
    this.waveTimer.stop();
  }
};

ArcticMadness.scene.Game.prototype.m_showWaveText = function (wave) {
  this.bonusContainer = new ArcticMadness.entity.BonusContainer(this);
  this.stage.addChild(this.bonusContainer);
  this.bonusContainer.updateWavesCompleted(wave);
  this.bonusContainer.updateEnemyScore(this.enemyScore);
  this.bonusContainer.updateScore(this.map.repairedWaveScore);
  this.bonusContainer.updateTotalScore(
    this.enemyScore,
    this.map.repairedWaveScore
  );
  // in this state players are not moveable
  for (var i = 0; i < this.players.length; i++) {
    this.players[i].moveable = false;
  }

  this.timers
    .create({
      duration: 6000,
      scope: this,
      onComplete: function () {
        this.stage.removeChild(this.bonusContainer, true);
        this.map.repairedWaveScore = 0;
        this.enemyScore = 0;
        for (var i = 0; i < this.players.length; i++) {
          this.players[i].moveable = true;
        }
        this.m_countDown(wave);
      },
    })
    .start();
};

ArcticMadness.scene.Game.prototype.m_updateWaveTimerText = function () {
  this.timerText.text = "WAVE;" + this.currentWave + " TIME;" + this.duration / 1000;
  this.duration -= 1000;

  if (this.duration === 5000) {
    if (this.countDown !== null) {
      this.stage.removeChild(this.countDown, true);
      this.countDown = null;
    }

    this.countDown = new ArcticMadness.entity.CountDown(this);
    this.stage.addChild(this.countDown);
    this.countDown.playCountDown5();

    this.timers
      .create({
        duration: 5000,
        scope: this,
        onComplete: function () {
          this.stage.removeChild(this.countDown, true);
          this.countDown = null;
        },
      })
      .start();
  }
};
ArcticMadness.scene.Game.prototype.m_countDown = function (wave) {
  if (this.countDown !== null) {
    this.stage.removeChild(this.countDown, true);
    this.countDown = null;
  }

  this.countDown = new ArcticMadness.entity.CountDown(this);
  this.stage.addChild(this.countDown);
  this.countDown.playCountDown3();
  this.timers
    .create({
      duration: 3000,
      scope: this,
      onComplete: function () {
        this.m_startWaveTimer();
        this.m_startNextWave(wave);
        this.stage.removeChild(this.countDown, true);
      },
    })
    .start();
};

ArcticMadness.scene.Game.prototype.m_startNextWave = function () {
  this.enemies.startNewEnemyTimer(this.currentWave);
  this.map.callCrackRandomTile(this.currentWave);
  this.map.setCrackTimer(this.currentWave);
};

ArcticMadness.scene.Game.prototype.m_checkIfPlayersAreDead = function () {
  var allPlayersDead = true;
  var allPlayersInWater = true;
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].isAlive === true) {
      allPlayersDead = false;
    }
    if (!this.players[i].isInWater) {
      allPlayersInWater = false;
    }
  }
  if (allPlayersDead || allPlayersInWater) {
    this.gameMusic.fade();
    this.m_stopWaveTimer();
    this.timers
      .create({
        duration: 3000,
        scope: this,
        onComplete: function () {
          this.m_checkIfNewHighscore();
        },
      })
      .start();
  }
};

ArcticMadness.scene.Game.prototype.m_checkIfNewHighscore = function () {
if (
    this.application.highscores.test(
      this.liveScore.score,
      this.numberOfPlayers - 1
    ) != -1
  ) {
    var bestScore = false;
    if (
      this.liveScore.score >
      this.application.highscores.get(0, this.numberOfPlayers - 1).score
    ) {
      bestScore = true;
    }
    if (this.startFadeOut == true) {
      this.startFadeOut = false;
      this.cameras.getCameraAt(0).fade.out(800, function () {
        this.application.scenes.load([
          new ArcticMadness.scene.NewHighscore(
            this.liveScore.score,
            this.numberOfPlayers,
            bestScore,
            this.menuSound
          ),
        ]);
      }, this);
    }
  } else {
    if (this.startFadeOut == true) {
      this.startFadeOut = false;
      this.cameras.getCameraAt(0).fade.out(800, function () {
        this.application.scenes.load([
          new ArcticMadness.scene.GameOver(this.liveScore.score, this.menuSound),
        ]);
      }, this);
    }
  }
};
