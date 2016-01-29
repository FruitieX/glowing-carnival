// "constants"
var gravity = 800;
var accel = 2000;
var maxSpeed = 400;
var jumpSpeed = 500;

// animation code considers speeds slower than this to be = still
var stillDelta = 1; // 1 is pretty slow

var game = new Phaser.Game(1024, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
});

function preload() {
  game.load.image('bg0', 'assets/Background/bg_layer1.png');
  game.load.image('bg1', 'assets/Background/bg_layer4.png');

  game.load.image('ground1_tb', 'assets/Tiles/tile_111.png');
  game.load.image('ground1_trb', 'assets/Tiles/tile_114.png');
  game.load.image('ground1_lrb', 'assets/Tiles/tile_115.png');
  game.load.image('ground1_lt', 'assets/Tiles/tile_116.png');
  game.load.image('ground1_tr', 'assets/Tiles/tile_117.png');
  game.load.image('ground1_lr', 'assets/Tiles/tile_138.png');
  game.load.image('ground1_ltr', 'assets/Tiles/tile_141.png');
  game.load.image('ground1_lrb', 'assets/Tiles/tile_142.png');
  game.load.image('ground1_lb', 'assets/Tiles/tile_143.png');
  game.load.image('ground1_rb', 'assets/Tiles/tile_144.png');
  game.load.image('ground1_l', 'assets/Tiles/tile_167.png');
  game.load.image('ground1_r', 'assets/Tiles/tile_168.png');
  game.load.image('ground1_', 'assets/Tiles/tile_169.png');
  game.load.image('ground1_t', 'assets/Tiles/tile_194.png');
  game.load.image('ground1_b', 'assets/Tiles/tile_195.png');

  game.load.spritesheet('player', 'assets/Players/bunny1.png', 150, 200);
}

var playerSpawn = {
  x: 0,
  y: 0
};

function create() {
  // Add the background
  game.add.sprite(0, 0, 'bg0');
  game.add.sprite(0, 0, 'bg1');

  //game.world.setBounds(0, 0, 1920, 1920);

  //  We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  loadLevel(level1);

  /*
   * Player
   */

  spawnPlayer();

  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function spawnPlayer() {
  player = game.add.sprite(playerSpawn.x, playerSpawn.y, 'player');
  player.scale.setTo(0.25, 0.25);

  //  We need to enable physics on the player
  game.physics.arcade.enable(player);

  //  Player physics properties. Give the little guy a slight bounce.
  //player.body.bounce.y = 0.2;
  player.body.gravity.y = gravity;
  player.body.collideWorldBounds = true;

  //  Our two animations, walking left and right.
  player.animations.add('left', [3, 2], 10, true);
  player.animations.add('right', [0, 1], 10, true);
  player.animations.add('jump', [4], 10, true);
  player.animations.add('stand', [5], 10, true);

  game.camera.follow(player);
}

function touchlava() {
    player.kill();
    spawnPlayer();
}

function update() {
  game.physics.arcade.collide(player, platforms);

  game.physics.arcade.collide(player, lava, touchlava, null, this);

  if(player.body.touching)

  //  Reset the players velocity (movement)
  player.body.acceleration.x = 0;

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

  // animations
  if (player.body.touching.down) {
    if (player.body.velocity.x > stillDelta) {
      player.animations.play('right');
    } else if (player.body.velocity.x < -stillDelta) {
      player.animations.play('left');
    } else {
      player.animations.play('stand');
    }
  } else {
    player.animations.play('jump');
  }
}

function render() {
  game.debug.cameraInfo(game.camera, 32, 32);
  game.debug.spriteCoords(player, 32, 500);
}
