// "constants"
var accel = 2000;
var runAccel = 3000;
var gravity = 2000;
var bouncyGravity = 1000;
var bouncyThrowMultiplier = 1.5;
var maxSpeed = 500;
var runSpeed = 700;
var jumpSpeed = 650;
var maxYVelocity = 2000;

var stillDelta = 1; // 1 is pretty slow

var game = new Phaser.Game(1280, 600, Phaser.AUTO, '');

game.state.add('MainMenu', {
  preload: menuPreload,
  create: menuCreate,
  update: menuUpdate
});

game.state.add('Game', {
  preload: preload,
  create: create,
  update: update,
  render: render
});


game.state.start('MainMenu');

function preload() {
  game.load.image('bg0', 'assets/Background/sky.png');
  game.load.image('bg1', 'assets/Background/bg_layer4.png');

  game.load.image('lava', 'assets/Tiles/tile_15.png');
  game.load.image('checkpoint', 'assets/Tiles/tile_214.png');
  game.load.image('bouncy', 'assets/Tiles/tile_03.png');

  game.load.image('ground1_tb', 'assets/Tiles/tile_111.png');
  game.load.image('ground1_trb', 'assets/Tiles/tile_114.png');
  game.load.image('ground1_lrb', 'assets/Tiles/tile_115.png');
  game.load.image('ground1_lt', 'assets/Tiles/tile_116.png');
  game.load.image('ground1_tr', 'assets/Tiles/tile_117.png');
  game.load.image('ground1_lr', 'assets/Tiles/tile_138.png');
  game.load.image('ground1_ltr', 'assets/Tiles/tile_141.png');
  game.load.image('ground1_ltb', 'assets/Tiles/tile_142.png');
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

var levelId = 0;

var timer;

function create() {
  //game.world.setBounds(0, 0, 1920, 1920);

  //  We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  loadLevel(levelId);

  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  spawnPlayer();

  //game.input.gamepad.start();
  //gamepad = game.input.gamepad.pad1;
  //gamepad.addCallbacks(this, { onConnect: addButtons });

  cursors = game.input.keyboard.createCursorKeys();
  cursors.up.onDown.add(jump, this);

  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  jumpButton.onDown.add(jump, this);
  if (gamepadConnected) {
    buttonA.onDown.add(jump, this);
  }
  runButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);

  //timer = startTimer(game);
  startTimer();
}

function touchlava() {
    player.kill();
    startTimer();
    spawnPlayer();
}

function passCheckpoint(player, checkpoint) {
    playerSpawn = {
        x: checkpoint.body.position.x,
        y: checkpoint.body.position.y - 64
    }
}

function touchBouncy(pl, bouncy) {
    if (runButton.isDown) {
        console.log(player);
        grab(bouncy);
    }
}

function update() {
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(player, lava, touchlava, null, this);
  game.physics.arcade.collide(player, bouncyTiles, touchBouncy, null, this);
  game.physics.arcade.collide(bouncyTiles, platforms);
  game.physics.arcade.overlap(player, checkpoints, passCheckpoint, null, this);

  // run player input & movement code
  playerMovement();

  // player animations
  updateAnimations();
}

function render() {
  //game.debug.cameraInfo(game.camera, 32, 32);
  //game.debug.spriteCoords(player, 32, 500);
  renderTimer();
}
