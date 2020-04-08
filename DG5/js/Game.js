"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var player = null;
    var cursors = null;
    var platformGroup = null;
    var enemyGroup = null;
    var weapon = null;
    var map;
    var layerCollide;
    var layerBG;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        player.destroy();
        platformGroup.destroy();
        enemyGroup.destroy();
        weaopon.destroy();
        //  Then let's go back to the main menu.
        game.state.start('MainMenu');
        
    }
    
    return {
    
        create: function () {
    
            // Fit 1600x1200 BG image
            game.world.setBounds(0,0,1600,1200);
            game.add.tileSprite(0,0, 1600, 1200, 'bigBG');
            game.camera.setPosition(0, 600);

            
            // Initializing Physics System(s)
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.startSystem(Phaser.Physics.P2JS);
            game.physics.p2.gravity.y = 0;
            game.physics.p2.setImpactEvents(true);
            game.physics.p2.defaultRestitution = 0.1;

            map = game.add.tilemap('map');
            map.addTileSetImage('tiles');

            layerCollide = map.createLayer('Tile Layer 1');
            //layerBG = map.createLayer('Tile Layer 2');
            
            layerCollide.resizeWorld();

            map.setCollisionBetween(1, 467, true, layerCollide);
            game.physics.p2.convertTilemap(map, layerCollide);


            // P2 Collision Groups
            playerCollisionGroup = game.physics.p2.createCollisionGroup();
            enemyCollisionGroup = game.physics.p2.createCollisionGroup();
            platformCollisionGroup = game.physics.p2.createCollisionGroup();
            game.physics.p2.updateBoundsCollisionGroup();// Enable Bounds Collision

            // Enemy Section ---------------------------------------------------------------------------------------
            //enemyGroup = game.add.group();
            //enemyGroup.enableBody = true;
            //createEnemies();
            // -----------------------------------------------------------------------------------------------------


            // Player Section --------------------------------------------------------------------------------------
            player = game.add.sprite( 60, game.world.height - 45, 'segments', 1);
            player.anchor.setTo(0.5, 0.5);
            game.physics.p2.enable(player);

            player.body.setRectangleFromSprite();
            player.body.fixedRotation = true;
            player.body.setCollisionGroup(playerCollisionGroup);
            
            // What Player Collides With
            player.body.collides(platformCollisionGroup);
            player.body.collides(enemyCollisionGroup);

            player.body.damping = 0.1;

            // Turn on the arcade physics engine for this sprite.
            //          game.physics.enable( player, Phaser.Physics.ARCADE );
            // Make it bounce off of the world bounds in ARCADE.
            //          player.body.collideWorldBounds = true;
            //          player.body.gravity.y = 1380;
            // -----------------------------------------------------------------------------------------------------

            // Platform Section ------------------------------------------------------------------------------------
            /*platformGroup = game.add.group();
            platformGroup.enableBody = true;
            this.buildPlatforms();
            platformGroup.setAll('body.immovable', true);*/
            // -----------------------------------------------------------------------------------------------------

            // Add some text using a CSS style.
            // Center it in X, and position its top 15 pixels from the top of the world.
            var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
            var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
            text.anchor.setTo( 0.5, 0.0 );
            
            // When you click on the sprite, you go back to the MainMenu.
            //bouncy.inputEnabled = true;
            //bouncy.events.onInputDown.add( function() { quitGame(); }, this );

            game.camera.follow(player);

            game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);

            cursors = game.input.keyboard.createCursorKeys();
        },

         /*createEnemies: function () {

         },*/

         canJump: function () {

         },
    
        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            // Accelerate the 'logo' sprite towards the cursor,
            // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
            // in X or Y.
            // This function returns the rotation angle that makes it visually match its
            // new trajectory.
            // bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );

            if (game.input.keyboard.justPressed(Phaser.Keyboard.UP) && canJump()) {
                player.body.moveUp(250);
            }
            if (cursors.right.isDown) {
                player.body.moveRight(300);
            }
            else if (cursors.left.isDown) {
                player.body.moveLeft(300);
            }
            else {
                player.body.velocity.x = 0;
            }
        },

        render: function () {

            //game.debug.cameraInfo(game.camera, 32, 32);

        }
    };
};
