// "constants"
var accel = 2000;
var runAccel = 3500;
var gravity = 2000;
var bouncyGravity = 1000;
var bouncyThrowMultiplier = 1.5;
var fast = 100;
var maxSpeed = 6 * fast;
var runSpeed = 10 * fast;
var jumpSpeed = 8 * fast;
var maxYVelocity = 20 * fast;

var createdLevels = 7;

var stillDelta = 1; // 1 is pretty slow

var levels = 0;

var game = new Phaser.Game(1920, 1080, Phaser.AUTO, '');

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

var curState = 'MainMenu';
game.state.start('MainMenu');

function preload() {
  game.load.image('bg0', 'assets/Background/bg_layer1.png');
  game.load.image('bg1', 'assets/Background/bg_layer4.png');

  game.load.image('lava', 'assets/Obstacles/spikes_a.png');
  game.load.image('checkpoint', 'assets/Tiles/tile_214.png');
  game.load.image('grabbable', 'assets/Tiles/tile_03.png');
  game.load.image('gravity', 'assets/Tiles/tile_341.png');

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
  game.load.image('ground1_ltrb', 'assets/Tiles/tile_196.png');

  game.load.spritesheet('player', 'assets/Players/bunny1.png', 150, 200);
  for(var i = 1; i <= createdLevels; ++i) {
    createLevel(i);
  }
  game.load.image('tiles', 'assets/Tiles/tilemap.png');
}

function createLevel(id) {
  game.load.tilemap('level' + id, 'levels/level' + id + '.json', null, Phaser.Tilemap.TILED_JSON);
  levels++;
}

var playerSpawn = {
  x: 0,
  y: 0
};

var levelId = 1;

var timer;

function create() {
  game.world.setBounds(0, 0, 1920, 1920);

  //  We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // increase this if you get tunneling
  game.physics.arcade.TILE_BIAS = 80;

  loadLevel(levelId);

  //jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  //jumpButton.onDown.add(jump, this);

  //runButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);

  //cursors = game.input.keyboard.createCursorKeys();
  
  cursors.up.onDown.add(jump, this);

  cursors.left.onDown.add(onLeft, this);
  cursors.right.onDown.add(onRight, this);

  spawnPlayer();

  startTimer();
}

function reset() {
    player.kill();
    spawnPlayer();
}

function touchlava() {
    reset();
}

function passCheckpoint(player, checkpoint) {
    playerSpawn = {
        x: checkpoint.body.position.x,
        y: checkpoint.body.position.y - 64
    }
    return false;
}

var grabbable = [];

function touchGrabbable(player, grabbable) {
    console.log("touching");
  var input = processInput();
  if (input.run) {
    grab(grabbable);
  }
}

var gravityTimer;

function touchGravity(player, gravityBox) {
    if (!gravityTimer) {
        if (player.body.gravity.y == gravity) {
            player.body.gravity.y = gravity / 2;
        } else {
            player.body.gravity.y = gravity;
        }
        gravityTimer = game.time.create(false);
        gravityTimer.add(1000, killtimer, this);
        gravityTimer.start();
    }
}

function killtimer() {
    gravityTimer = null;
}

function retardateGrabbables() {
  /*
    for (var i = 0; i < grabbables.children.length; ++i) {
        var speed = grabbables.children[i].body.velocity.x
        grabbables.children[i].body.acceleration.x = -(speed && speed / Math.abs(speed)) * 500;
    }
    */
}

var sanicTimer;

var oldMax = maxSpeed;
var oldRun = runSpeed;

function goFast(player, sanic) {
  if (!sanicTimer) {
    maxSpeed = 1000 * fast;
    runSpeed = 1000 * fast;
  }
  sanicTimer = game.time.create(false);
  sanicTimer.add(3000, goSlow, this);
  sanicTimer.start();
}

function goSlow() {
  sanicTimer = null;
  maxSpeed = oldMax;
  runSpeed = oldRun;
}

function update() {
  game.physics.arcade.collide(player, groundLayer);
  //game.physics.arcade.collide(player, platforms);

  game.physics.arcade.collide(player, lavaGroup, touchlava, null, this);
  game.physics.arcade.collide(player, grabbables, touchGrabbable, null, this);
  game.physics.arcade.collide(grabbables, groundLayer);
  game.physics.arcade.collide(grabbables, gvGroup);
  game.physics.arcade.collide(player, gvGroup, touchGravity, null, this);
  //game.physics.arcade.overlap(player, checkpoints, passCheckpoint, null, this);
  game.physics.arcade.overlap(player, cpGroup, null, passCheckpoint, this);
  //game.physics.arcade.collide(player, sanics, goFast, null, this);

  // run player input & movement code
  playerMovement();

  // player animations
  updateAnimations();
  
  // Retardate grabbables
  retardateGrabbables();
}

function render() {
  //game.debug.cameraInfo(game.camera, 32, 32);
  //game.debug.spriteCoords(player, 32, 500);
  //renderTimer();
  //game.debug.bodyInfo(player, 32, 40);
  //game.debug.body(player);
  //game.debug.bodyInfo(player, 32, 32);
  //game.debug.body(player);
  //game.debug.body(groundLayer);
}
