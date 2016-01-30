function processInput() {
  var run = runButton.isDown;
  var jump = jumpButton.isDown || cursors.up.isDown;
  var left = cursors.left.isDown;
  var right = cursors.right.isDown;

  if (gamepadConnected) {
    run |= buttonX.isDown;
    jump |= buttonA.isDown;
    left |= buttonDPadLeft.isDown;
    right |= buttonDPadRight.isDown;
  }

  return {
    run: run,
    jump: jump,
    left: left,
    right: right
  };
}

function playerMovement() {
  var input = processInput();

  // set acceleration to 0.
  // below code will set it to something else if we still want to move
  player.body.acceleration.x = 0;

  if(input.run) {
    player.body.maxVelocity.x = runSpeed;  
  } else {
    player.body.maxVelocity.x = maxSpeed;
  }

  if (input.left) {
    //  Move to the left
    player.body.acceleration.x = input.run ? -runAccel : -accel;

    // turn instantly if we're on the ground
    if (player.body.touching.down) {
      if (player.body.velocity.x > 0) {
        player.body.velocity.x = 0;
      }
    }
  } else if (input.right) {
    //  Move to the right
    player.body.acceleration.x = input.run ? runAccel : accel;

    // turn instantly if we're on the ground
    if (player.body.touching.down) {
      if (player.body.velocity.x < 0) {
        player.body.velocity.x = 0;
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

  //  Allow the player to jump if they are touching the ground.
  if (input.jump && player.body.touching.down) {
    player.body.velocity.y = -jumpSpeed;
  }

  // walljumps TODO: only works if holding left/right :(
  else if (input.jump && player.body.touching.left) {
    player.body.velocity.y = -jumpSpeed;
    player.body.velocity.x = input.run ? runSpeed : maxSpeed;
  } else if (input.jump && player.body.touching.right) {
    player.body.velocity.y = -jumpSpeed;
    player.body.velocity.x = input.run ? -runSpeed : -maxSpeed;
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
}
