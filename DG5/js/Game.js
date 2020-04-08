"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var player = null;
    var cursors = null;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
    
            // Fit 1600x1200 BG image
            game.world.setBounds(0,0,1600,1200);
            game.add.tileSprite(0,0, 1600, 1200, 'bigBG');
            game.camera.setPosition(0, 600);

            
            
            game.physics.startSystem(Phaser.Physics.ARCADE);

            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            // Create a sprite at the center of the screen using the 'logo' image.
            //bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
            // Anchor the sprite at its center, as opposed to its top-left corner.
            // so it will be truly centered.
            //bouncy.anchor.setTo( 0.5, 0.5 );

            player = game.add.sprite( 60, game.world.height - 45, 'segments', 1);
            player.anchor.setTo(0.5, 0.5);
            
            // Turn on the arcade physics engine for this sprite.
            game.physics.enable( player, Phaser.Physics.ARCADE );
            // Make it bounce off of the world bounds.
            player.body.collideWorldBounds = true;
            player.body.gravity.y = 200;

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
    
        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            // Accelerate the 'logo' sprite towards the cursor,
            // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
            // in X or Y.
            // This function returns the rotation angle that makes it visually match its
            // new trajectory.
            // bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );

            if (game.input.keyboard.justPressed(Phaser.Keyboard.UP) && player.body.touching.down) {
                player.body.velocity.y = -550;
            }
            /*else if (cursors.down.isDown) {
                player.body.velocity.y = 500;
            }
            else {
                player.body.velocity.y = 0;
            }*/

            if (cursors.right.isDown) {
                player.body.velocity.x = 200;
            }
            else if (cursors.left.isDown) {
                player.body.velocity.x = -200;
            }
            else {
                player.body.velocity.x = 0;
            }
        },

        render: function () {

            game.debug.cameraInfo(game.camera, 32, 32);

        }
    };
};
