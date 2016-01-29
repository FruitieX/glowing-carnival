function playerMovement() {
  if (cursors.left.isDown) {
    //  Move to the left
    player.body.acceleration.x = -accel;

    // turn instantly if we're on the ground
    if (player.body.touching.down) {
      if (player.body.velocity.x > 0) {
        player.body.velocity.x = 0;
      }
    }
  } else if (cursors.right.isDown) {
    //  Move to the right
    player.body.acceleration.x = accel;

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

  var jump = jumpButton.isDown || cursors.up.isDown;

  //  Allow the player to jump if they are touching the ground.
  if (jump && player.body.touching.down) {
    player.body.velocity.y = -jumpSpeed;
  }

  // walljumps TODO: only works if holding left/right :(
  else if (jump && player.body.touching.left) {
    player.body.velocity.y = -jumpSpeed;
    player.body.velocity.x = maxSpeed;
  } else if (jump && player.body.touching.right) {
    player.body.velocity.y = -jumpSpeed;
    player.body.velocity.x = -maxSpeed;
  }

  // clamp x speeds to maximum values
  if (player.body.velocity.x > maxSpeed) {
    player.body.velocity.x = maxSpeed;
  } else if (player.body.velocity.x < -maxSpeed) {
    player.body.velocity.x = -maxSpeed;
  }
}

function spawnPlayer() {
  player = game.add.sprite(playerSpawn.x, playerSpawn.y, 'player');
  player.scale.setTo(0.25, 0.25);

  //  We need to enable physics on the player
  game.physics.arcade.enable(player);

  //  Player physics properties. Give the little guy a slight bounce.
  //player.body.bounce.y = 0.2;
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
