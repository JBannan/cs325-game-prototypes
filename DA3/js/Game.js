"use strict";

GameStates.makeGame = function (game, shared) {
    // Create your own variables.
    
    var chicken = null;
    var cursors = null;
    var score = 0;
    var line;
    var drawLine = false;
    var mouse;
    var mouseSpring;
    var snakeHead; //head of snake sprite
    var snakeSection = new Array(); //array of sprites that make the snake body sections
    var snakePath = new Array(); //arrary of positions(points) that have to be stored for the path the sections follow
    var numSnakeSections = 20; //number of snake body sections
    var snakeSpacer = 6; //parameter that sets the spacing between sections
    var hasDead = false;
    var space;
    var egg;
    var chickenCollisionGroup;
    var eggCollisionGroup;
    var snakeCollisionGroup;
    var style;
    var text;
    //var eggGroup;

    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        score = 0;
        game.state.start('MainMenu');

    }

    return {

        create: function () {

            game.world.setBounds(0, 0, 800, 600);
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.startSystem(Phaser.Physics.P2JS);
            game.physics.p2.gravity.y = 0;
            game.physics.p2.setImpactEvents(true);
            game.physics.p2.restitution = 0.8;

            //  Create our collision groups. One for the player, one for the pandas
            chickenCollisionGroup = game.physics.p2.createCollisionGroup();
            eggCollisionGroup = game.physics.p2.createCollisionGroup();
            snakeCollisionGroup = game.physics.p2.createCollisionGroup();

            //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
            //  (which we do) - what this does is adjust the bounds to use its own collision group.
            game.physics.p2.updateBoundsCollisionGroup();

            //eggGroup = game.add.group();
            //eggGroup.enableBody = true;
            //eggGroup.physicsBodyType = Phaser.Physics.P2JS;

            this.spawnEgg();

            // Create a sprite at the center of the screen using the 'logo' image.
            chicken = game.add.sprite(100, 100, 'chickens');
            chicken.setScaleMinMax(1.5);
            chicken.animations.add('white_down', [0, 1, 2, 1], 13, true);
            chicken.animations.add('white_up', [36, 37, 38, 37], 13, true);
            chicken.animations.add('white_left', [12, 13, 14, 13], 13, true);
            chicken.animations.add('white_right', [24, 25, 26, 25], 13, true);

            snakeHead = game.add.sprite(400, 300, 'segments', 0);
            snakeHead.anchor.setTo(0.5, 0.5);
            game.physics.p2.enable(snakeHead, false);
            snakeHead.body.setCircle(8);
            snakeHead.body.setCollisionGroup(snakeCollisionGroup);

            snakeHead.body.collides(eggCollisionGroup, this.snakeEgg, this);

            //  Init snakeSection array
            for (var i = 1; i <= numSnakeSections - 1; i++) {
                snakeSection[i] = game.add.sprite(400, 300, 'segments', 1);

                snakeSection[i].anchor.setTo(0.5, 0.5);
                //snakeSection[i].frame(2);
            }

            //  Init snakePath array
            for (var i = 0; i <= numSnakeSections * snakeSpacer; i++) {
                snakePath[i] = new Phaser.Point(400, 300);
            }



            // Anchor the sprite at its center, as opposed to its top-left corner.
            // so it will be truly centered.
            chicken.anchor.setTo(0.5, 0.5);
            // Turn on the arcade physics engine for this sprite.
            game.physics.p2.enable(chicken, false);
            
            chicken.body.setCircle(25);
            chicken.body.fixedRotation = true;
            chicken.body.setCollisionGroup(chickenCollisionGroup);

            chicken.body.collides(eggCollisionGroup, this.hitEgg, this);

            chicken.body.damping = 0.5;

            mouse = game.add.sprite(100, 100, 'ball');
            game.physics.p2.enable(mouse, true);
            mouse.body.static = true;
            mouse.body.setCircle(10);
            mouse.body.data.shapes[0].sensor = true;

            // Add some text using a CSS style.
            // Center it in X, and position its top 15 pixels from the top of the world.
            style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
            text = game.add.text(game.world.centerX, 15, ("Score: " + score.toString()), style);
            text.anchor.setTo(0.5, 0.0);

            // When you click on the sprite, you go back to the MainMenu.
            line = new Phaser.Line(chicken.x, chicken.y, mouse.x, mouse.y);

            game.input.onDown.add(this.click, this);
            game.input.onUp.add(this.release, this);
            game.input.addMoveCallback(this.move, this);

            cursors = this.input.keyboard.createCursorKeys();
            space = game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
            //game.input.keyboard.onUpCallback = function (e) {
            // These can be checked against Phaser.Keyboard.UP, for example.
            //    chicken.body.velocity.x = 0;
            //    chicken.body.velocity.y = 0;
            //    chicken.animations.stop();
            //};
        },

        hitEgg: function () {
            egg.destroy();
            hasDead = true;
            this.bumpScore();
            this.spawnEgg();
            console.log('hit');
        },

        bumpScore: function () {
            score = score + 1;
            text.setText("Score: " + score);
        },

        snakeEgg: function () {
            egg.destroy();
            this.decScore();
            this.spawnEgg();
        },

        snakeChicken: function () {
            this.decScore();
            this.decScore();
        },

        decScore: function () {
            score = score - 5;
            text.setText("Score: " + score);
        },

        spawnEgg: function () {
            egg = game.add.sprite(this.game.world.randomX, this.game.world.randomY, 'egg2');
            game.physics.p2.enable(egg, false);
            egg.body.clearShapes();
            egg.body.loadPolygon('physics2', 'egg2');
            egg.body.fixedRotation = true;
            egg.body.velocity.x = Math.random();
            egg.body.velocity.y = Math.random();
            //  Tell the egg to use the eggCollisionGroup 
            egg.body.setCollisionGroup(eggCollisionGroup);

            //  eggs will collide against the player
            //  If you don't set this they'll not collide with anything.
            //  The first parameter is either an array or a single collision group.
            egg.body.collides([chickenCollisionGroup, snakeCollisionGroup]);
        },

        click: function (pointer) {

            //var bodies = game.physics.p2.hitTest(pointer.position, [ chicken.body ]);
            var bodies = game.physics.p2.getBody(chicken);

            //if (bodies.length)
            //{
            //  Attach to the first body the mouse hit
            mouseSpring = game.physics.p2.createSpring(mouse, bodies, 0, 30, 1);
            line.setTo(chicken.x, chicken.y, mouse.x, mouse.y);
            drawLine = true;
            //}

        },

        release: function () {
            drawLine = false;
            game.physics.p2.removeSpring(mouseSpring);



        },

        move: function (pointer, x, y, isDown) {

            mouse.body.x = x;
            mouse.body.y = y;
            line.setTo(chicken.x, chicken.y, mouse.x, mouse.y);

        },

        preRender: function () {

            if (line) {
                line.setTo(chicken.x, chicken.y, mouse.x, mouse.y);
            }

        },

        render: function () {

            if (drawLine) {
                game.debug.geom(line, 'red');
            }
            else {
                game.debug.geom(line, 'green');
            }

        },

        update: function () {

            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

            // Accelerate the 'logo' sprite towards the cursor,
            // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
            // in X or Y.
            // This function returns the rotation angle that makes it visually match its
            // new trajectory.


            //snakeHead.body.velocity.setTo(0, 0);
            //snakeHead.body.angularVelocity = 0;

            //snakeHead.rotation = game.physics.arcade.angleToXY(snakeHead, chicken.x, chicken.y);

            //snakeHead.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(snakeHead.angle, (score + 50)));

            // Everytime the snake head moves, insert the new location at the start of the array, 
            // and knock the last position off the end

            this.accelerateToObject(snakeHead, egg, score * 2);

            var part = snakePath.pop();

            part.setTo(snakeHead.x, snakeHead.y);

            snakePath.unshift(part);

            for (var i = 1; i <= numSnakeSections - 1; i++) {
                snakeSection[i].x = (snakePath[i * snakeSpacer]).x;
                snakeSection[i].y = (snakePath[i * snakeSpacer]).y;
            }

            if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR))
            {
                quitGame();
            }

            /*
            if (cursors.left.isDown) {
                chicken.body.velocity.x = -200;
                chicken.animations.play('white_left');
            }
            else if (cursors.right.isDown) {
                chicken.body.velocity.x = 200;
                chicken.animations.play('white_right');
            }
    
            if (cursors.up.isDown) {
                chicken.body.velocity.y = -200;
                chicken.animations.play('white_up');
            }
            else if (cursors.down.isDown) {
                chicken.body.velocity.y = 200;
                chicken.animations.play('white_down');
            }*/
        },

        accelerateToObject: function (obj1, obj2, speed) {
            if (typeof speed === 'undefined') { speed = 60; }
            var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
            obj1.body.rotation = angle + game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
            obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject 
            obj1.body.force.y = Math.sin(angle) * speed;
        }

    };
};
