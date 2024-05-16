#!/bin/bash

npx google-closure-compiler \
--language_in ECMASCRIPT5_STRICT \
--language_out ECMASCRIPT5_STRICT \
--warning_level DEFAULT \
--compilation_level WHITESPACE_ONLY \
--isolation_mode IIFE \
--js "./../../lib/rune.js" \
--js "./../../src/scope/Manifest.js" \
--js "./../../src/data/resource/Requests.js" \
--js "./../../src/entity/HighscoreList.js" \
--js "./../../src/scene/gameover/NewHighscore.js" \
--js "./../../src/scene/gameover/GameOver.js" \
--js "./../../src/entity/LiveScore.js" \
--js "./../../src/entity/Bullet.js" \
--js "./../../src/entity/Gun.js" \
--js "./../../src/entity/Enemy.js" \
--js "./../../src/entity/Enemies.js" \
--js "./../../src/entity/Player.js" \
--js "./../../src/entity/Players.js" \
--js "./../../src/map/Map.js" \
--js "./../../src/scene/game/Game.js" \
--js "./../../src/scene/joinGame/JoinGame.js" \
--js "./../../src/scene/menu/Menu.js" \
--js "./../../src/system/Main.js" \
--js "./../../src/scope/Alias.js" \
--js_output_file "./../../dist/ArcticMadness.js";