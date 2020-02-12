"use strict";
const WIDTH = 800;
const HEIGHT = 600;

function make_main_game_state( game )
{

    function preload() {
        // Load an image and call it 'logo'.
        //game.load.image( 'logo', 'assets/phaser.png' );
        game.load.image( 'player', 'assets/player_sprite1.png');
        game.load.image( 'world_block', 'assets/block1.png');
        game.load.image( 'bullet', 'assets/bullet.png');
        game.load.image( 'enemy', 'assets/enemy_sprite.png');
    }
    
    //var bouncy;
    var block;
    var player;
    var weapon;
    var fireButton;
    var cursors;
    var platforms;
    var enemies;


    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        //bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
        
        // Platforms
        game.physics.startSystem(Phaser.Physics.ARCADE);
        platforms = game.add.group();
        platforms.enableBody = true;
        for (let i = 0; i < WIDTH/32; i++) {
            block = platforms.create(32*i, game.world.height - 32, 'world_block');
            block.body.immovable = true;
        }
        for (let i = 0; i < (WIDTH/32)/3; i++) {
            block = platforms.create(32*i, game.world.height - 64 - (game.world.height*0.2), 'world_block');
            block.body.immovable = true;
            block = platforms.create(game.world.width - (32*i), game.world.height - 64 - (game.world.height*0.1), 'world_block');
            block.body.immovable = true;
            
        }
        /*Enemies Section
        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
        for (let i = 0; i < 3; i++) {
            var enemy = enemies.create(Math.random() % game.world.width, Math.random() % game.world.height - 90, 'enemy');
        }*/

        //Weapon Section
        weapon = game.add.weapon(30, 'bullet');
        weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        weapon.bulletLifespan = 2000;
        weapon.bulletSpeed = 600;
        weapon.fireRate = 100;
        weapon.bulletAngleVariance = 7;
        weapon.multiFire = true;
        weapon.bulletCollideWorldBounds = true;
        game.physics.enable(Phaser.Bullet, Phaser.Physics.ARCADE);
        weapon.bullets.setAll('body.bounce.x', 1);
        weapon.bullets.setAll('body.bounce.y', 1);

        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
       // bouncy.anchor.setTo( 0.5, 0.5 );

       //Player Section
        player = game.add.sprite(7, HEIGHT-100, 'player'); 
        player.anchor.setTo(0.5, 0.5);
        // Turn on the arcade physics engine for this sprite.
        //game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        game.physics.enable( player, Phaser.Physics.ARCADE);
        
        // Make it bounce off of the world bounds.
        player.body.bounce.y = 0.1;
        player.body.gravity.y = 900;
        player.body.collideWorldBounds = true;
        weapon.trackSprite(player, 0, 0, true);

        cursors = this.input.keyboard.createCursorKeys();
        fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
        text.anchor.setTo( 0.5, 0.0 );
    }
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        // bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
        
        player.body.velocity.x = 0;
        var hitPlatform = game.physics.arcade.collide(player, platforms);
        //var bulletWorldHit = game.physics.arcade.collide(weapon.bullets, World.bounds);

        if (cursors.left.isDown) {
            player.body.velocity.x = -200;
        }
        else if (cursors.right.isDown) {
            player.body.velocity.x = 200;
        }

        if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
            player.body.velocity.y = -500;
        }
    
        if (fireButton.isDown)
        {
            weapon.fireAtPointer(game.input.activePointer);
           // Shotgun it
           //weapon.fireAtPointer(game.input.activePointer);
           // weapon.fireAtPointer(game.input.activePointer);
        }

        
    }
    
    return { "preload": preload, "create": create, "update": update };
}


window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/v2.6.2/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( WIDTH, HEIGHT, Phaser.AUTO, 'game' );
    
    game.state.add( "main", make_main_game_state( game ) );
    
    game.state.start( "main" );
};
