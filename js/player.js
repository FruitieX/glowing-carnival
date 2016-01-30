function processInput() {
  var jump = jumpButton.isDown || cursors.up.isDown;
  var run = runButton.isDown;
  var left = cursors.left.isDown;
  var right = cursors.right.isDown;
  var reset = resetButton.isDown;

  if (gamepadConnected) {
    jump |= buttonA.isDown;
    run |= buttonX.isDown || buttonR2.isDown;
    left |= buttonDPadLeft.isDown;
    right |= buttonDPadRight.isDown;
  }

  return {
    jump: jump,
    run: run,
    left: left,
    right: right,
    reset: reset
  };
}

var grabbing;

function grab(box) {
    grabbing = box;
}

var wallClingTime = 200;
var wallClingMaxVelocity = 30000; // disabled :>

var leftPressedTime = 0;
function onLeft() {
  leftPressedTime = Date.now();
}
var rightPressedTime = 0;
function onRight() {
  rightPressedTime = Date.now();
}

function jump() {
  if (curState != 'Game') {
    return;
  }

  var input = processInput();

  //  Allow the player to jump if they are touching the ground.
  if (player.body.touching.down) {
    player.body.velocity.y = -jumpSpeed;
  } else {
    // walljumps
    var walljumpPlayer = game.add.sprite(player.body.position.x,
                                     player.body.position.y, 'player');
    //walljumpPlayerRight = game.add.sprite(player.body.position.x,
    //                                      player.body.position.y, 'player');

    walljumpPlayer.scale.setTo(0.25, 0.25);

    walljumpPlayer.renderable = false;
    walljumpPlayer.immovable = true;

    game.physics.arcade.enable(walljumpPlayer);

    walljumpPlayer.body.checkCollision.up = false;
    walljumpPlayer.body.checkCollision.down = false;

    walljumpPlayer.body.position.x = walljumpPlayer.position.x - 3;

    game.physics.arcade.collide(walljumpPlayer, platforms);

    // TODO: this is retarded but doing it right took too much time!
    // why did position.x -= 1, width += 2 not work?!?!?!
    if (walljumpPlayer.body.touching.left) {
      player.body.velocity.y = -jumpSpeed;
      player.body.velocity.x = input.run ? runSpeed : maxSpeed;
    } else {

      walljumpPlayer.body.position.x = walljumpPlayer.position.x + 6;
      game.physics.arcade.collide(walljumpPlayer, platforms);
      if (walljumpPlayer.body.touching.right) {
        player.body.velocity.y = -jumpSpeed;
        player.body.velocity.x = input.run ? -runSpeed : -maxSpeed;
      }
    }

    walljumpPlayer.destroy();
  }
}

function playerMovement() {
  if (grabbing) {
      grabbing.body.position = new Phaser.Point(player.body.position.x + 10, player.body.position.y - 10);
  }
  var input = processInput();

  check_input(input);

  if (input.reset) {
      reset();
  }
  if (grabbing && !input.run) {
      grabbing.body.velocity.x = player.body.velocity.x * bouncyThrowMultiplier;
      grabbing = null;
  }

  // set acceleration to 0.
  // below code will set it to something else if we still want to move
  player.body.acceleration.x = 0;

  if(input.run) {
    player.body.maxVelocity.x = runSpeed;
  } else {
    player.body.maxVelocity.x = maxSpeed;
  }

  if (input.left) {
    var skipMove = false;

    if (!player.body.touching.down && player.body.velocity.y < wallClingMaxVelocity) {
      // check for wall touch to the right
      var walljumpPlayer = game.add.sprite(player.body.position.x,
                                           player.body.position.y, 'player');
      walljumpPlayer.scale.setTo(0.25, 0.25);
      walljumpPlayer.renderable = false;
      walljumpPlayer.immovable = true;
      game.physics.arcade.enable(walljumpPlayer);
      walljumpPlayer.body.checkCollision.up = false;
      walljumpPlayer.body.checkCollision.left = false;
      walljumpPlayer.body.checkCollision.down = false;
      walljumpPlayer.body.position.x = walljumpPlayer.position.x + 3;
      game.physics.arcade.collide(walljumpPlayer, platforms);

      if (walljumpPlayer.body.touching.right) {
        // touching wall to the right, don't move to left right away to
        // make wall jumps easier
        if (Date.now() < leftPressedTime + wallClingTime) {
          skipMove = true;
        }
      }
      walljumpPlayer.destroy();
    }

    if (!skipMove) {
      //  Move to the left
      player.body.acceleration.x = input.run ? -runAccel : -accel;

      // turn instantly if we're on the ground
      if (player.body.touching.down) {
        if (player.body.velocity.x > 0) {
          player.body.velocity.x = 0;
        }
      }
    }
  } else if (input.right) {
    var skipMove = false;

    if (!player.body.touching.down && player.body.velocity.y < wallClingMaxVelocity) {
      // check for wall touch to the left
      var walljumpPlayer = game.add.sprite(player.body.position.x,
                                           player.body.position.y, 'player');
      walljumpPlayer.scale.setTo(0.25, 0.25);
      walljumpPlayer.renderable = false;
      walljumpPlayer.immovable = true;
      game.physics.arcade.enable(walljumpPlayer);
      walljumpPlayer.body.checkCollision.up = false;
      walljumpPlayer.body.checkCollision.right = false;
      walljumpPlayer.body.checkCollision.down = false;
      walljumpPlayer.body.position.x = walljumpPlayer.position.x - 3;
      game.physics.arcade.collide(walljumpPlayer, platforms);

      if (walljumpPlayer.body.touching.left) {
        // touching wall to the right, don't move to left right away to
        // make wall jumps easier
        if (Date.now() < rightPressedTime + wallClingTime) {
          skipMove = true;
        }
      }
      walljumpPlayer.destroy();
    }

    if (!skipMove) {
      //  Move to the right
      player.body.acceleration.x = input.run ? runAccel : accel;

      // turn instantly if we're on the ground
      if (player.body.touching.down) {
        if (player.body.velocity.x < 0) {
          player.body.velocity.x = 0;
        }
      }
    }
  } else {
    if (player.body.touching.down) {
      player.body.velocity.x = 0;
    }
    //  Stand still
    //player.animations.stop();

    //player.frame = 4;
  }

  if (!input.jump) {
    player.body.velocity.y = Math.max(0, player.body.velocity.y);
  }

  // out of bounds check for player, acts as win condition
  if (player.body.position.x + player.body.width  < game.world.bounds.x ||
      player.body.position.y + player.body.height < game.world.bounds.y ||
      player.body.position.x > game.world.bounds.width ||
      player.body.position.y > game.world.bounds.height) {
    if (++levelId == levels.length) {
      console.log('YOU\'RE WINNER!');
      levelId = 0;
    }
    saveTime(levelId - 1);
    loadLevel(levelId);
    startTimer();
    spawnPlayer();
  }
}

function spawnPlayer() {
  player = game.add.sprite(playerSpawn.x, playerSpawn.y, 'player');
  player.scale.setTo(0.25, 0.25);

  //  We need to enable physics on the player
  game.physics.arcade.enable(player);

  //  Player physics properties. Give the little guy a slight bounce.
  //player.body.bounce.y = 0.2;
  player.body.maxVelocity.x = maxSpeed;
  player.body.maxVelocity.y = maxYVelocity;
  player.body.gravity.y = gravity;

  // We allow out of bounds as that is our current win condition
  player.body.collideWorldBounds = false;

  //  Our two animations, walking left and right.
  player.animations.add('left', [3, 2], 10, true);
  player.animations.add('right', [0, 1], 10, true);
  player.animations.add('jump', [4], 10, true);
  player.animations.add('stand', [5], 10, true);

  game.camera.follow(player);
  
  clear_triggers();
  set_trigger({"jump": true, "run": false, "left": false, "right": false, "reset": false}, 3, function() {console.log("Triple jump trigger")});
}
