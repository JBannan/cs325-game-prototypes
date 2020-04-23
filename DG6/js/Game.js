"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var player = null;
    var cursors = null, leftKey, rightKey, jumping = false;
    var platformGroup = null;
    var playerCollisionGroup = null, platformCollisionGroup = null, enemyCollisionGroup = null, bulletCollisionGroup, tileCollisionGroup;
    var enemyGroup = null;
    var weapon = null, shot, fireButton, bulletGroup;
    var grappleDeployed = false, firestate = false;
    var map;
    var layer;
    var killCount = 0;
    var boom, hop, bgm;
    var tiles, tileGroup, tileHits = [];
    var line, line2, ray, drawLine = false, mouse, mouseSpring;
    
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
            
            // line = new Phaser.Line();
            // line2 = new Phaser.Line();


            // Fit 1600x1200 BG image
            game.world.setBounds(0,0,1600,1200);
            game.add.tileSprite(0,0, 1600, 1200, 'bigBG');
            game.camera.setPosition(0, 600);

            hop = game.add.audio('hop');
            boom = game.add.audio('boom');
            bgm = game.add.audio('intro');
            bgm.loop = true;
            bgm.play();

            // this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
            // this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
            // this.bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
            // this.game.add.image(0, 0, this.bitmap);

            // Initializing Physics System(s)
            //game.physics.startSystem(Phaser.Physics.ARCADE);
            //game.physics.arcade.gravity.y = 800;
            // game.physics.startSystem(Phaser.Physics.P2JS);
            // game.physics.p2.gravity.y = 0;
            // game.physics.p2.setImpactEvents(true);
            // game.physics.p2.defaultRestitution = 0.1;
            // game.physics.p2.gravity.y = 1200;

            map = game.add.tilemap('map',16,16);
            map.addTilesetImage('tiles');

            layer = map.createLayer(0);
            //layerBG = map.createLayer('Tile Layer 2');
            
            layer.resizeWorld();

            map.setCollisionBetween(1, 467);
            //layer.debug = true;
            
            //game.physics.p2.convertTilemap(map, layer);
            //console.log(map.collision);
            //tileCollisionGroup = game.physics.p2.createCollisionGroup();
            // tileGroup = game.add.group(game, null, 'tileGroup', false, true, Phaser.Physics.P2JS);
            // tileGroup.addMultiple(tiles);
            //console.log('added');
            

            // P2 Collision Groups
            // playerCollisionGroup = game.physics.p2.createCollisionGroup();
            // enemyCollisionGroup = game.physics.p2.createCollisionGroup();
            // platformCollisionGroup = game.physics.p2.createCollisionGroup();
            // game.physics.p2.updateBoundsCollisionGroup();// Enable Bounds Collision

            enemyGroup = game.add.group();
            enemyGroup.enableBody = true;
            this.placeEnemies();
            enemyGroup.setAll('body.gravity.y', 900);
            
            

            // Player Section --------------------------------------------------------------------------------------
            player = game.add.sprite( 60, game.world.height - 50, 'segments', 1);
            game.physics.enable(player, Phaser.Physics.ARCADE);
            player.anchor.setTo(0.5, 0.5);
            player.body.collideWorldBounds = true;
            player.body.gravity.y = 900;
            //game.physics.p2.enable(player);
            //player.body.setRectangleFromSprite();
            //game.physics.p2.setBoundsToWorld(true, true, true, true, false);
            
            //player.body.fixedRotation = true;
            
            weapon = game.add.weapon(35, 'bullet', null, bulletGroup);
            //weapon.bullets.enableBody = true;
            weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
            weapon.bulletLifespan = 700;
            weapon.bulletSpeed = 650;
            weapon.fireAngle = Phaser.ANGLE_DOWN;
            weapon.bulletAngleVariance = 20;
            weapon.multiFire = true;
            weapon.bulletGravity.y = 900;
            weapon.trackSprite(player, 0, 0);
            weapon.bulletSpeedVariance = 80;
            // -----------------------------------------------------------------------------------------------------

            // Add some text using a CSS style.
            // Center it in X, and position its top 15 pixels from the top of the world.
            var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
            var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
            text.anchor.setTo( 0.5, 0.0 );
            

            game.camera.follow(player);

            game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);

            cursors = game.input.keyboard.createCursorKeys();
            leftKey = game.input.keyboard.addKey(Phaser.KeyCode.A);
            rightKey = game.input.keyboard.addKey(Phaser.KeyCode.D);

            fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            
            game.input.keyboard.addKeyCapture(Phaser.KeyCode.SPACEBAR);
            mouse = this.game.input.activePointer;
        },

        placeEnemies: function () {
            for (var i = 0; i < 15; i++) {
                let randX = Math.random() * 1600;
                let randY = Math.random() * 1200;
                if (map.getTileWorldXY(randX, randY, 16, 16, layer) != null) {
                    randX = Math.random() * 1600;
                    randY = Math.random() * 1200;
                }
                enemyGroup.create(randX, randY, 'segments', 0);
            }
        },
    
        update: function () {
            var playerDown = game.physics.arcade.collide(player, layer);
            game.physics.arcade.collide(weapon.bullets, layer);
            game.physics.arcade.collide(enemyGroup, layer);
            game.physics.arcade.collide(enemyGroup, weapon.bullets, this.enemyHit);
            

            if (game.input.keyboard.justPressed(Phaser.Keyboard.W) && playerDown) {
                hop.play();
                player.body.velocity.y = -300;
            }
            if (rightKey.isDown && playerDown) {
                player.body.velocity.x = 200;
            }
            else if (leftKey.isDown && playerDown) {
                player.body.velocity.x = -200;
            }
            else {
                if (playerDown) {
                    player.body.velocity.x = 0;
                }
                else {
                    player.body.drag.x = 400;
                }
            }

            if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
                
                game.physics.arcade.moveToPointer(player, -500);

                boom.play();
                weapon.fireAtPointer(this.game.input.activePointer);
                weapon.fireAtPointer(this.game.input.activePointer);
                weapon.fireAtPointer(this.game.input.activePointer);
                weapon.fireAtPointer(this.game.input.activePointer);
                weapon.fireAtPointer(this.game.input.activePointer);
                weapon.fireAtPointer(this.game.input.activePointer);
                weapon.fireAtPointer(this.game.input.activePointer);
                console.log("fire");
            }
        },

        enemyHit: function (enemy, bullet) {
            enemy.kill();
            killCount++;
        },

        render: function () {

            // if (drawLine) {
            //     game.debug.geom(line);
            // }
            //weapon.debug();
            //game.debug.cameraInfo(game.camera, 32, 32);

        }
    };
};
