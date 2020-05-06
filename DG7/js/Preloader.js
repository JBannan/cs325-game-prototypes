"use strict";

GameStates.makePreloader = function( game ) {

	var background = null;
	var preloadBar = null;

	var ready = false;

    return {
    
        preload: function () {
    
            //	These are the assets we loaded in Boot.js
            //	A nice sparkly background and a loading progress bar
            background = game.add.sprite(0, 0, 'preloaderBackground');
            preloadBar = game.add.sprite(300, 400, 'preloaderBar');
    
            //	This sets the preloadBar sprite as a loader sprite.
            //	What that does is automatically crop the sprite from 0 to full-width
            //	as the files below are loaded in.
            game.load.setPreloadSprite(preloadBar);
    
            //	Here we load the rest of the assets our game needs.
            //	As this is just a Project Template I've not provided these assets, swap them for your own.
            game.load.image('titlePage', 'assets/backgrounds/title.jpg');
            game.load.atlas('playButton', 'assets/ui/play_button.png', 'assets/json/play_button.json');
            game.load.audio('titleMusic', ['assets/audio/01 Intro.mp3']);
            //	+ lots of other required assets here
            game.load.image( 'logo', 'assets/phaser.png' );
            game.load.image('CityFire', 'assets/backgrounds/Skyline_flames.png');
            game.load.image('startButton', 'assets/ui/StartButton.png');
            game.load.image('optionsButton', 'assets/ui/OptionsButton.png');
            game.load.image('bigBG', 'assets/backgrounds/Big_Silo.png');
            game.load.spritesheet( 'segments', 'assets/segments.png', 16, 32);
            game.load.image('tiles', 'assets/tiles/scifi_platformTiles_16x16.png');
            game.load.tilemap('map', 'assets/tiles/map2_1.csv', null, Phaser.Tilemap.CSV);
            game.load.tilemap('platforms1', 'assets/tiles/map2_1_Tile Layer 1.csv', null, Phaser.Tilemap.CSV);
            game.load.tilemap('bgTiles1', 'assets/tiles/map2_1_Tile Layer 2.csv', null, Phaser.Tilemap.CSV);
            game.load.tilemap('finishBox', 'assets/tiles/map2_1_Tile Layer 3.csv', null, Phaser.Tilemap.CSV);
            game.load.image('bullet', 'assets/bullet.png');
            game.load.audio('boom', 'assets/audio/Explosion.wav');
            game.load.audio('hop', 'assets/audio/Jump.wav');
            game.load.audio('intro', 'assets/audio/fight.wav');
            game.load.audio('hit_hurt', 'assets/audio/Hit_Hurt.wav');
            game.load.audio('kill_boom', 'assets/audio/Kill_Boom.wav');
            game.load.audio('laser', 'assets/audio/Laser_Shoot.wav');

        },
    
        create: function () {
    
            //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
            preloadBar.cropEnabled = false;
    
        },
    
        update: function () {
    
            //	You don't actually need to do this, but I find it gives a much smoother game experience.
            //	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
            //	You can jump right into the menu if you want and still play the music, but you'll have a few
            //	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
            //	it's best to wait for it to decode here first, then carry on.
            
            //	If you don't have any music in your game then put the game.state.start line into the create function and delete
            //	the update function completely.
            
            if (game.cache.isSoundDecoded('titleMusic') && ready == false)
            {
                ready = true;
                game.state.start('MainMenu');
            }
    
        }
    
    };
};
