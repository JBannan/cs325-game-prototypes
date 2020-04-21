"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var player = null;
    var cursors = null, leftKey, rightKey;
    var platformGroup = null;
    var playerCollisionGroup = null, platformCollisionGroup = null, enemyCollisionGroup = null, bulletCollisionGroup, tileCollisionGroup;
    var enemyGroup = null;
    var weapon = null, shot, fireButton, bulletGroup;
    var grappleDeployed = false;
    var map;
    var layer;
    var boom, hop, bgm;
    var tiles, tileGroup;
    var line, drawLine = false, mouse, mouseSpring;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        player.destroy();
        platformGroup.destroy();
        enemyGroup.destroy();
        //  Then let's go back to the main menu.
        game.state.start('MainMenu');
        
    }
    
    return {
    
        create: function () {
            
    
            // Fit 1600x1200 BG image
            game.world.setBounds(0,0,1600,1200);
            game.add.tileSprite(0,0, 1600, 1200, 'bigBG');
            game.camera.setPosition(0, 600);

            hop = game.add.audio('hop');
            boom = game.add.audio('boom');
            //bgm = game.add.audio('intro');
            //bgm.loop = true;
            //bgm.play();

            
            // Initializing Physics System(s)
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.arcade.gravity.y = 800;
            /*game.physics.startSystem(Phaser.Physics.P2JS);
            game.physics.p2.gravity.y = 0;
            game.physics.p2.setImpactEvents(true);
            game.physics.p2.defaultRestitution = 0.1;
            game.physics.p2.gravity.y = 1200;*/

            map = game.add.tilemap('map',16,16);
            map.addTilesetImage('tiles');

            layer = map.createLayer(0);
            //layerBG = map.createLayer('Tile Layer 2');
            
            layer.resizeWorld();

            map.setCollisionBetween(1, 467);
            //layer.debug = true;
            
            //tiles = game.physics.p2.convertTilemap(map, layer);
            //console.log(map.collision);
            //tileCollisionGroup = game.physics.p2.createCollisionGroup();
            //tileGroup = game.add.group(game, null, 'tileGroup', false, true, Phaser.Physics.P2JS);
            //tileGroup.addMultiple(tiles);
            //console.log('added');
            

            /* P2 Collision Groups
            playerCollisionGroup = game.physics.p2.createCollisionGroup();
            enemyCollisionGroup = game.physics.p2.createCollisionGroup();
            platformCollisionGroup = game.physics.p2.createCollisionGroup();*/
            //game.physics.p2.updateBoundsCollisionGroup();// Enable Bounds Collision
            

            // Enemy Section ---------------------------------------------------------------------------------------
            //enemyGroup = game.add.group();
            //enemyGroup.enableBody = true;
            //createEnemies();
            // -----------------------------------------------------------------------------------------------------


            // Player Section --------------------------------------------------------------------------------------
            player = game.add.sprite( 60, game.world.height - 50, 'segments', 1);
            game.physics.enable(player, Phaser.Physics.ARCADE);
            player.anchor.setTo(0.5, 0.5);
            player.body.collideWorldBounds = true;
            //game.physics.p2.enable(player);
            //game.physics.p2.setBoundsToWorld(true, true, true, true, false);
            //player.body.setRectangleFromSprite();
            //player.body.fixedRotation = true;
            //player.body.setCollisionGroup(playerCollisionGroup);
            
            // What Player Collides With
            //player.body.collides(platformCollisionGroup);
            //player.body.collides(enemyCollisionGroup);
            //player.body.damping = 0.1;

            //bulletGroup = game.add.group();
            //bulletGroup.enableBodyDebug = true;

            // weapon = game.add.weapon(100, 'bullet', null, bulletGroup);
            // //weapon.bullets.enableBody = true;
            // //weapon.bullets.physicsBodyType = Phaser.Physics.P2JS;
            // weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
            // weapon.bulletSpeed = 650;
            // weapon.fireAngle = Phaser.ANGLE_DOWN;
            // weapon.bulletAngleVariance = 20;
            // weapon.multiFire = true;
            // //weapon.bulletGravity.y = 600;
            // //bulletCollisionGroup = game.physics.p2.createCollisionGroup(bulletGroup);
            // weapon.trackSprite(player, 0, 16);


            
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
            leftKey = game.input.keyboard.addKey(Phaser.KeyCode.A);
            rightKey = game.input.keyboard.addKey(Phaser.KeyCode.D);

            fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            game.input.keyboard.addKeyCapture(Phaser.KeyCode.SPACEBAR);
            mouse = Phaser.Input.activePointer;
        },

         /*createEnemies: function () {

         },*/
    
        update: function () {
            var playerDown = game.physics.arcade.collide(player, layer);
            game.physics.arcade.collide(weapon.bullets, layer, this.bulletLayerHit);

            if (game.input.keyboard.justPressed(Phaser.Keyboard.W) && playerDown) {
                hop.play();
                player.body.velocity.y = -300;
            }
            if (rightKey.isDown) {
                player.body.velocity.x = 400;
            }
            else if (leftKey.isDown) {
                player.body.velocity.x = -400;
            }
            else {
                player.body.velocity.x = 0;
            }

            if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
                
                player.body.velocity.y -= 200;
                var angle = game.physics.arcade.angleToPointer(player, mouse);
                var point = game.physics.arcade.velocityFromAngle(angle, 200);
                player.body.velocity.x -= point.x;
                player.body.velocity.y -= point.y;

                boom.play();
                weapon.fire();
                weapon.fire();
                weapon.fire();
                weapon.fire();
                weapon.fire();
                weapon.fire();
                weapon.fire();
                console.log("fire");
            }
            
        },

        bulletLayerHit: function (bullet, lay) {
            bullet.kill();
        },

        render: function () {

            //weapon.debug();
            //game.debug.cameraInfo(game.camera, 32, 32);

        }
    };
};
