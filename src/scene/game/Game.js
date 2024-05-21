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
ArcticMadness.scene.Game = function (numberOfPlayers, menuSound, gamepads) {
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
    { r: 255, g: 0, b: 0 },
    { r: 0, g: 255, b: 0 },
    { r: 0, g: 0, b: 255 },
    { r: 0, g: 255, b: 255 },
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
  this.m_initLiveScore();
  this.m_initWaveText();
  this.m_music();
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
  for (var i = 0; i < this.players.length; i++) {
    this.stage.removeChild(this.players[i], true);
  }
  this.stage.removeChild(this.timerText, true);
  this.stage.removeChild(this.liveScore, true);
  this.stage.removeChild(this.map, true);
  this.stage.removeChild(this.enemies, true);

  rune.scene.Scene.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Public prototype methods
//------------------------------------------------------------------------------

ArcticMadness.scene.Game.prototype.tweenWater = function (player, playerTile) {
  player.falling = true;
  this.tweens.create({
    target: player,
    scope: this,
    duration: 550,
    onUpdate: function (player) {
      player.animation.gotoAndPlay("falling");
      console.log("falling");
      this.drownSoundEffect = this.application.sounds.sound.get("splash");
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
  player.gun.alpha = 1;
  player.flicker.start();
  player.animation.gotoAndPlay("idle");
};

ArcticMadness.scene.Game.prototype.revivePlayer = function (player) {
  this.map.removeReviveTile(player);
  this.resetPlayer(player);
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
};

ArcticMadness.scene.Game.prototype.m_initWaveText = function () {
  this.timerText = new rune.text.BitmapField(
    "wave " + this.currentWave + Math.floor(this.duration / 1000),
    "thefont"
  );
  this.timerText.autoSize = false;
  this.timerText.width = 200;
  this.timerText.height = 100;
  this.timerText.scaleX = 2;
  this.timerText.scaleY = 2;
  this.timerText.x = 700;
  this.timerText.y = 20;
  this.stage.addChild(this.timerText);
};

ArcticMadness.scene.Game.prototype.m_timerCountdown = function () {
  this.timerText = new rune.text.BitmapField(
    "wave " + this.currentWave + Math.floor(this.duration / 1000),
    "thefont"
  );
  this.timerText.autoSize = false;
  this.timerText.width = 200;
  this.timerText.height = 100;
  this.timerText.scaleX = 2;
  this.timerText.scaleY = 2;
  this.timerText.x = 700;
  this.timerText.y = 20;
  this.stage.addChild(this.timerText);
};

ArcticMadness.scene.Game.prototype.m_music = function () {
  this.gameMusic = this.application.sounds.master.get("music_bg");
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
      0
    );
    this.players.push(this.player);
    this.gamepadsConected.push(this.gamepads.get(0));
  }

  this.m_addPlayersToStage();
};

ArcticMadness.scene.Game.prototype.m_initEnemies = function () {
  this.enemies = new ArcticMadness.entity.Enemies(this, this.players);
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
      console.log("falling");
      this.drownSoundEffect = this.application.sounds.sound.get("splash");
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
  player.gun.alpha = 1;
  player.flicker.start();
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
  console.log("dispose");
  for (var i = 0; i < this.players.length; i++) {
    this.stage.removeChild(this.players[i], true);
  }
  this.stage.removeChild(this.timerText, true);
  this.stage.removeChild(this.liveScore, true);
  this.stage.removeChild(this.map, true);
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
        this.m_checkBulletHitEnemy(player.gun.bullets[j]);
      }
    }
  }
};

ArcticMadness.scene.Game.prototype.m_checkBulletHitEnemy = function (bullet) {
  for (var i = 0; i < this.enemies.enemies.length; i++) {
    if (bullet.hitTestObject(this.enemies.enemies[i])) {
      bullet.dispose();
      this.enemies.enemies[i].killenemy();
      this.enemies.enemies.splice(i, 1);
      this.enemyScore += 5;
      this.updateScore(5);
    }
  }
};

ArcticMadness.scene.Game.prototype.m_addPlayersToStage = function () {
  for (var i = 0; i < this.players.length; i++) {
    this.stage.addChild(this.players[i]);
  }
};

ArcticMadness.scene.Game.prototype.m_startWaveTimer = function () {
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
      this.map.reviveAllPlayers();
      this.waveCompleteSoundEffect =
        this.application.sounds.sound.get("wavecomplete");
      this.waveCompleteSoundEffect.play();
      this.waveCompleteSoundEffect.loop = false;
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
  this.bonusContainer.updateWavesCompleted(wave);
  this.bonusContainer.updateEnemyScore(this.enemyScore);
  this.bonusContainer.updateScore(this.map.repairedWaveScore);
  this.bonusContainer.updateTotalScore(
    this.enemyScore,
    this.map.repairedWaveScore
  );

  this.timers
    .create({
      duration: 6000,
      scope: this,
      onComplete: function () {
        this.bonusContainer.dispose(); //remove bonuscontainer
        this.map.repairedWaveScore = 0;
        this.enemyScore = 0;
        this.m_countDown(wave);
      },
    })
    .start();
};

ArcticMadness.scene.Game.prototype.m_updateWaveTimerText = function () {
  this.timerText.text = "wave " + this.currentWave + " " + this.duration / 1000;
  this.duration -= 1000;
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
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].isAlive === true) {
      allPlayersDead = false;
      break;
    }
  }
  if (allPlayersDead) {
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
  console.log(this.numberOfPlayers - 1);
  console.log(this.application.highscores);

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
    this.application.scenes.load([
      new ArcticMadness.scene.NewHighscore(
        this.liveScore.score,
        this.numberOfPlayers,
        bestScore,
        this.menuSound
      ),
    ]);
  } else {
    this.application.scenes.load([
      new ArcticMadness.scene.GameOver(this.liveScore.score, this.menuSound),
    ]);
  }
};
