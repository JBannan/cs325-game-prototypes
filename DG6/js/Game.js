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
            
            line = new Phaser.Line();
            line2 = new Phaser.Line();


            // Fit 1600x1200 BG image
            game.world.setBounds(0,0,1600,1200);
            game.add.tileSprite(0,0, 1600, 1200, 'bigBG');
            game.camera.setPosition(0, 600);

            hop = game.add.audio('hop');
            boom = game.add.audio('boom');
            bgm = game.add.audio('intro');
            bgm.loop = true;
            bgm.play();

            this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
            this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
            this.bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
            this.game.add.image(0, 0, this.bitmap);
            // Initializing Physics System(s)
            //game.physics.startSystem(Phaser.Physics.ARCADE);
            //game.physics.arcade.gravity.y = 800;
            game.physics.startSystem(Phaser.Physics.P2JS);
            game.physics.p2.gravity.y = 0;
            game.physics.p2.setImpactEvents(true);
            game.physics.p2.defaultRestitution = 0.1;
            game.physics.p2.gravity.y = 1200;

            map = game.add.tilemap('map',16,16);
            map.addTilesetImage('tiles');

            layer = map.createLayer(0);
            //layerBG = map.createLayer('Tile Layer 2');
            
            layer.resizeWorld();

            map.setCollisionBetween(1, 467);
            layer.debug = true;
            
            game.physics.p2.convertTilemap(map, layer);
            //console.log(map.collision);
            //tileCollisionGroup = game.physics.p2.createCollisionGroup();
            // tileGroup = game.add.group(game, null, 'tileGroup', false, true, Phaser.Physics.P2JS);
            // tileGroup.addMultiple(tiles);
            //console.log('added');
            

            // P2 Collision Groups
            playerCollisionGroup = game.physics.p2.createCollisionGroup();
            enemyCollisionGroup = game.physics.p2.createCollisionGroup();
            platformCollisionGroup = game.physics.p2.createCollisionGroup();
            game.physics.p2.updateBoundsCollisionGroup();// Enable Bounds Collision
            

            // Player Section --------------------------------------------------------------------------------------
            player = game.add.sprite( 60, game.world.height - 50, 'segments', 1);
            //game.physics.enable(player, Phaser.Physics.ARCADE);
            player.anchor.setTo(0.5, 0.5);
            //player.body.collideWorldBounds = true;
            game.physics.p2.enable(player);
            player.body.setRectangleFromSprite();
            game.physics.p2.setBoundsToWorld(true, true, true, true, false);
            
            player.body.fixedRotation = true;
            //player.body.setCollisionGroup(playerCollisionGroup);
            
            // What Player Collides With
            // player.body.collides(platformCollisionGroup);
            // player.body.collides(enemyCollisionGroup);
            //player.body.damping = 0.1;

            // Experimental P2JS weapon system
            // bulletGroup = game.add.group();
            // bulletGroup.enableBody = true;
            // bulletGroup.physicsBodyType = Phaser.Physics.P2JS;
            // bulletGroup.enableBodyDebug = true;
            // bulletGroup.createMultiple(1, 'bullet');

            // bulletGroup.setAll('anchor.x', 0.5);
            // bulletGroup.setAll('anchor.y', 0.5);
            // bulletGroup.setAll('outOfCameraBoundsKill', true);
 
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
            //fireButton.addCallbacks(this, this.startLine(player), this.raycast(mouse));
        },
    
        update: function () {
            //var playerDown = game.physics.arcade.collide(player, layer);
            //game.physics.arcade.collide(weapon.bullets, layer, this.bulletLayerHit);
            
            

            if (game.input.keyboard.justPressed(Phaser.Keyboard.W) && player.body.velocity.y <= 0.01 && jumping==false) {
                jumping = true;
                hop.play();
                player.body.velocity.y = -300;
            }
            if (player.body.velocity.y >= 6) {
                jumping = false;
            }
            if (rightKey.isDown) {
                player.body.velocity.x = 200;
            }
            else if (leftKey.isDown) {
                player.body.velocity.x = -200;
            }
            else {
                player.body.velocity.x = 0;
            }
            this.bitmap.context.clearRect(0, 0, this.game.width, this.game.height);
            if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
                ray = new Phaser.Line(player.x, player.y, mouse.worldX, mouse.worldY);
                var intersect = this.getWallIntersection(ray);

                if (intersect) {
                    this.bitmap.context.beginPath();
                    this.bitmap.context.moveTo(player.x, player.y);
                    this.bitmap.context.lineTo(mouse.x, mouse.y);
                    this.bitmap.context.stroke();
                    drawLine = true;
                }
                else {
                    this.bitmap.context.beginPath();
                    this.bitmap.context.moveTo(player.x, player.y);
                    this.bitmap.context.lineTo(mouse.x, mouse.y);
                    this.bitmap.context.stroke();
                    drawLine = false;
                }
                this.bitmap.dirty = true;
            }
            // if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
            //     this.startLine(player);
            //     this.raycast(mouse);
            // }
        },

        getWallIntersection: function (ray) {
            var distanceToWall = Number.POSITIVE_INFINITY;
            var closestIntersection = null;
            //tileHits = layer.getRayCastTiles(ray, 4, false, false);
            map.tiles.forEach(function(wall) {
                var lines = [
                    new Phaser.Line(wall.x, wall.y, wall.x + wall.width, wall.y),
                    new Phaser.Line(wall.x, wall.y, wall.x, wall.y + wall.height),
                    new Phaser.Line(wall.x + wall.width, wall.y,
                        wall.x + wall.width, wall.y + wall.height),
                    new Phaser.Line(wall.x, wall.y + wall.height,
                        wall.x + wall.width, wall.y + wall.height)
                ];

                for (var i = 0; i < lines.length; i++) {
                    var intersect = Phaser.Line.intersects(ray, lines[i]);
                    if (intersect) {
                        var distance = this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
                        if (distance < distanceToWall) {
                            distanceToWall = distance;
                            closestIntersection = intersect;
                        }
                    }
                }
            }, this);
            return closestIntersection;
        },

        // startLine: function (player) {
        //     if (tileHits.length > 0) {
        //         for (var i = 0; i < tileHits.length; i++)
        //         {
        //             tileHits[i].debug = false;
        //         }

        //         layer.dirty = true;
        //     }

        //     line.start.set(player.body.x, player.body.y);
        // },

        // raycast: function (pointer) {
        //     line.end.set(pointer.worldX, pointer.worldY);

        //     tileHits = layer.getRayCastTiles(line, 4, false, false);

        //     var closest;
        //     var dist;

        //     if (tileHits.length > 0)
        //     {
        //         closest = tileHits[0];
        //         dist = Phaser.Math.distanceSq(player.worldX, player.worldY, tileHits[0].worldX, tileHits[0].worldY);
        //         //  Just so we can visually see the tiles
        //         for (var i = 0; i < tileHits.length; i++)
        //         {
        //             console.log(dist);
        //             //tileHits[i].debug = true;
        //             var newDist = Phaser.Math.distanceSq(player.worldX, player.worldY, 
        //                 tileHits[i].worldX, tileHits[i].worldY);
        //             if (newDist < dist) {
        //                 closest = tileHits[i];
        //             }
        //         } 
        //         console.log(tileHits.length-1)
        //         //line.length = dist;
        //         closest.debug = true;
        //         //line2.setTo(player.worldX, player.worldY, closest.worldX+8, closest.worldY+8);
        //         line2.setTo(player.x, player.y, tileHits[tileHits.length-1].worldX+8, tileHits[tileHits.length-1].worldY+8);

        //         layer.dirty = true;
        //     }
        // },

        render: function () {

            if (drawLine) {
                game.debug.geom(ray);
            }
            //weapon.debug();
            //game.debug.cameraInfo(game.camera, 32, 32);

        }
    };
};
