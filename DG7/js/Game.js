"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var player = null;
    var cursors = null, leftKey, rightKey, jumping = false;
    var platformGroup = null;
    var playerCollisionGroup = null, platformCollisionGroup = null, enemyCollisionGroup = null, bulletCollisionGroup, tileCollisionGroup;
    var enemyGroup = null, enemiesMade = false;
    var weapon = null, shot = 1, fireButton, bulletGroup, switchFire, bulletsPerShot, holdFire = false, recoil = 0;
    var sgPower, riflePower, mgPower;
    var grappleDeployed = false, firestate = false;
    var map, map2, map3, objectMap;
    var layer, layer2, layer3;
    var killCount = 0;
    var boom, hop, bgm, dead, laser, laserWeapon, MG, pistol, shotgun, weaponList = [], currentWeapon, wString = 'Pistol';
    var tiles, tileGroup, tileHits = [];
    var text, style, text2;
    var line, line2, ray, drawLine = false, mouse, mouseSpring;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        
        //  Then let's go back to the main menu.
        game.state.start('MainMenu');
        bgm.stop();
        
    }
    
    return {
    
        create: function () {
            
            // line = new Phaser.Line();
            // line2 = new Phaser.Line();


            // Fit 1600x1200 BG image
            game.world.setBounds(0,0,1600,1200);
            game.add.tileSprite(0,0, 1600, 1200, 'bigBG');
            game.camera.setPosition(0, 600);

            dead = game.add.audio('kill_boom');
            laser = game.add.audio('laser');
            hop = game.add.audio('hop');
            boom = game.add.audio('boom');
            bgm = game.add.audio('intro');
            bgm.loop = true;
            bgm.play();


            game.physics.arcade.gravity.y = 800;

            map = game.add.tilemap('map');
            map.addTilesetImage('tiles');
            map.addTilesetImage('powerups');
            
            map.setCollisionBetween(1, 700, true, 'Tile Layer 1');
            
            map.setCollisionBetween(299, 378, true, 'Tile Layer 3');

            layer2 = map.createLayer('Tile Layer 2');
            

            layer = map.createLayer('Tile Layer 1');
            layer3 = map.createLayer('Tile Layer 3');
            layer.resizeWorld();

            
            // map2 = game.add.tilemap('bgTiles', 16, 16);
            // map3 = game.add.tilemap('finishBox', 16, 16);
            // map2.addTilesetImage('tiles');
            // map3.addTilesetImage('tiles');
            // map = game.add.tilemap('platforms1',16,16);
            // map.addTilesetImage('tiles');

            
            // layer2 = map2.createLayer(0);
            // layer3 = map3.createLayer(0);
            // layer = map.createLayer(0);
            // layer.resizeWorld();

            // map.setCollisionBetween(1, 700);
            // map3.setCollisionBetween(200,400);

            sgPower = game.add.group();
            sgPower.enableBody = true;
            map.createFromObjects('PowerUps', 810, 'powerups', 2, true, false, sgPower);

            mgPower = game.add.group();
            mgPower.enableBody = true;
            map.createFromObjects('PowerUps', 808, 'powerups', 0, true, false, mgPower);

            riflePower = game.add.group();
            riflePower.enableBody = true;
            map.createFromObjects('PowerUps', 809, 'powerups', 1, true, false, riflePower);
 
            enemyGroup = game.add.group();
            enemyGroup.enableBody = true;
            this.placeEnemies();
            enemiesMade = true;

            // objectMap = game.add.tilemap('objectMap');
            // objectMap.createFromObjects('Objects', 1, 'segments', 0, true, false, enemyGroup);
            

            // Player Section --------------------------------------------------------------------------------------
            player = game.add.sprite( 60, game.world.height - 50, 'segments', 1);
            game.physics.enable(player, Phaser.Physics.ARCADE);
            player.anchor.setTo(0.5, 0.5);
            player.body.collideWorldBounds = true;
            player.body.gravity.y = 900;
            
            
            weapon = game.add.weapon(100, 'bullet', null, bulletGroup);
            //weapon.bullets.enableBody = true;
            laserWeapon = {
                killType: Phaser.Weapon.KILL_LIFESPAN,
                lifespan: 7000,
                speed: 1050,
                gravity: 200,
                angleVariance: 0,
                tint: 0x22FFFF,
                multiple: false,
                speedVariance: 0,
                fireRate: 1,
                bulletCount: 1,
                hold: false,
                weaponRecoil: -150,
                name: 'Rifle'
            };

            MG = {
                killType: Phaser.Weapon.KILL_LIFESPAN,
                lifespan: 3000,
                speed: 780,
                gravity: 400,
                angleVariance: 10,
                tint: 0x11ff22,
                multiple: true,
                speedVariance: 0,
                fireRate: 30,
                bulletCount: 1,
                hold: true,
                weaponRecoil: -60,
                name: 'Machine Gun'
            };

            shotgun = {
                killType: Phaser.Weapon.KILL_LIFESPAN,
                lifespan: 700,
                speed: 650,
                gravity: 900,
                angleVariance: 20,
                tint: 0xFFFFFF,
                multiple: true,
                speedVariance: 80,
                fireRate: 4,
                bulletCount: 7,
                hold: false,
                weaponRecoil: -600,
                name: 'Shotgun'
            };

            pistol = {
                killType: Phaser.Weapon.KILL_LIFESPAN,
                lifespan: 3000,
                speed: 780,
                gravity: 400,
                angleVariance: 10,
                tint: 0xFF2222,
                multiple: true,
                speedVariance: 0,
                fireRate: 15,
                bulletCount: 1,
                hold: false,
                weaponRecoil: -10,
                name: 'Pistol'
            };

            style = { font: "20px Verdana", fill: "#ffffff", align: "center" };
            text = game.add.text( 15, 15, killCount, style );
            text.fixedToCamera = true;
            text2 = game.add.text( game.world.width-15, game.world.height-15, wString, style );
            text2.fixedToCamera = true;

            this.setWeapon(pistol);
            weaponList.push(pistol);
            currentWeapon = pistol;
            // -----------------------------------------------------------------------------------------------------

            // Add some text using a CSS style.
            // Center it in X, and position its top 15 pixels from the top of the world.
            
            

            game.camera.follow(player);

            game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);

            cursors = game.input.keyboard.createCursorKeys();
            leftKey = game.input.keyboard.addKey(Phaser.KeyCode.A);
            rightKey = game.input.keyboard.addKey(Phaser.KeyCode.D);
            switchFire = game.input.keyboard.addKey(Phaser.KeyCode.X);

            fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            
            game.input.keyboard.addKeyCapture(Phaser.KeyCode.SPACEBAR);
            mouse = this.game.input.activePointer;
        },

        setWeapon: function (weaponType) {
            weapon.bulletKillType = weaponType.killType;
            weapon.bulletLifespan = weaponType.lifespan;
            weapon.bulletSpeed = weaponType.speed;
            weapon.fireAngle = Phaser.ANGLE_DOWN;
            weapon.bulletAngleVariance = weaponType.angleVariance;
            weapon.multiFire = weaponType.multiple;
            weapon.bulletGravity.y = weaponType.gravity;
            weapon.trackSprite(player, 0, 0);
            weapon.bulletSpeedVariance = weaponType.speedVariance;
            weapon.bullets.setAll('tint', weaponType.tint);
            bulletsPerShot = weaponType.bulletCount;
            holdFire = weaponType.hold;
            recoil = weaponType.weaponRecoil;
            wString = weaponType.name;
            text2.destroy();
            
            text2 = game.add.text( game.world.width-15, game.world.height-15, wString, style );
            text2.fixedToCamera = true;
        },

        placeEnemies: function () {
            for (var i = 0; i < 15; i++) {
                let randX = Math.random() * 1600;
                let randY = Math.random() * 1200;
                if (map.getTileWorldXY(randX, randY, 16, 16, layer) != null) {
                    randX = Math.random() * 1580;
                    randY = Math.random() * 120;
                }
                enemyGroup.create(randX, randY, 'segments', 0);
            }
        },

        addSG: function (player, weaponType) {
            weaponType.kill();
            weaponList.push(shotgun);
        },

        addMG: function (player, weaponType) {
            weaponType.kill();
            weaponList.push(MG);
        },

        addRifle: function (player, weaponType) {
            weaponType.kill();
            weaponList.push(laserWeapon);
        },

        cycleWeapon: function () {
            if (weaponList.length > 1) {
                var i = weaponList.indexOf(currentWeapon);
                i++;
                if (i >= weaponList.length) {
                    i=0;
                }
                currentWeapon = weaponList[i];
                this.setWeapon(currentWeapon);
            }
        },

        finishLine: function () {
            quitGame();
        },
    
        update: function () {
            var playerDown = game.physics.arcade.collide(player, layer);
            game.physics.arcade.collide(player, layer3, this.finishLine);
            game.physics.arcade.collide(sgPower, layer);
            game.physics.arcade.collide(mgPower, layer);
            game.physics.arcade.collide(riflePower, layer);
            game.physics.arcade.collide(sgPower, player, this.addSG);
            game.physics.arcade.collide(mgPower, player, this.addMG);
            game.physics.arcade.collide(riflePower, player, this.addRifle);
            game.physics.arcade.collide(weapon.bullets, layer);
            game.physics.arcade.collide(enemyGroup, layer);
            game.physics.arcade.collide(enemyGroup, weapon.bullets, this.enemyHit);
            
            if (enemyGroup.countLiving() < 1 && enemiesMade) {
                quitGame();
            }


            if (game.input.keyboard.justPressed(Phaser.Keyboard.W) && playerDown) {
                hop.play();
                player.body.velocity.y = -350;
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
                    player.body.drag.x = 300;
                }
            }

            if (game.input.keyboard.justPressed(Phaser.Keyboard.X)) {
                weapon.killAll();
                this.cycleWeapon();
            }

            if (holdFire) {
                if (fireButton.isDown) {
                    game.physics.arcade.moveToPointer(player, recoil);
                    boom.play();
                    for (var i = 0; i < bulletsPerShot; i++) {
                        weapon.fireAtPointer(this.game.input.activePointer);
                    }
                }
            }
            else {
                if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
                    game.physics.arcade.moveToPointer(player, recoil);
                    boom.play();
                    for (var i = 0; i < bulletsPerShot; i++) {
                        weapon.fireAtPointer(this.game.input.activePointer);
                    }
                }
            }
        },

        enemyHit: function (enemy, bullet) {
            dead.play();
            enemy.kill();
            bullet.kill();
            killCount = enemyGroup.countDead();
            text.destroy();
            text = game.add.text( 15, 15, killCount, style );
            text.fixedToCamera = true;
        },

        render: function () {

        }
    };
};
