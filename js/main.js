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

  spawnPlayer();

  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function touchlava() {
    player.kill();
    spawnPlayer();
}

function update() {
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(player, lava, touchlava, null, this);

  // run player input & movement code
  playerMovement();

  // player animations
  updateAnimations();
}

function render() {
  game.debug.cameraInfo(game.camera, 32, 32);
  game.debug.spriteCoords(player, 32, 500);
}
