var scale = 32;

var lavaTile = 73;
var cpTile = 131;
var gvTile = 244;

function loadLevel(levelId) {
  game.world.removeAll();

  // Add the background
  background = game.add.sprite(0, 0, 'bg0');
  //game.add.sprite(0, 0, 'bg1');

  map = game.add.tilemap('level' + levelId);

  // what we call the tileset in Tiled vs in preload()
  map.addTilesetImage('tileset', 'tiles');

  // layer name in Tiled
  groundLayer = map.createLayer('ground');

  groundLayer.resizeWorld();

  // collisions vs all the tiles
  map.setCollisionBetween(0, 523);

  // ... except these
  map.setCollision(lavaTile, false);
  map.setCollision(cpTile, false);
  map.setCollision(gvTile, false);

  var spawn = game.add.group();
  map.createFromObjects('spawn', 'spawn', '', 0, false, false, spawn);

  spawn.forEach(function(spawnPoint) {
    playerSpawn = {
      x: spawnPoint.x + spawnPoint.width  / 2,
      y: spawnPoint.y + spawnPoint.height / 2
    }
  });
  
    var temp = game.add.group();
    temp.enableBody = true;
    map.createFromObjects('grabbables', 'grabbable', '', 0, false, false, temp);
    console.log(temp.length);
    
    grabbables = game.add.group();
    grabbables.enableBody = true;
    
    temp.forEach(function(grabbable) {
        console.log("doing");
        var g = game.add.sprite(grabbable.x + grabbable.width, grabbable.y + grabbable.height, 'grabbable');
        game.physics.arcade.enable(g);
        //g.body.immovable = true;
        //g.scale.setTo(scale/64, scale/64);
        g.body.gravity.y = bouncyGravity;
        g.body.bounce.y = 0.5;
        grabbables.add(g);
    })

  lavaGroup = game.add.group();
  lavaGroup.enableBody = true;
  map.createFromTiles(lavaTile, null, '', 'ground', lavaGroup);

  lavaGroup.forEach(function(tile) {
    tile.body.immovable = true;
    tile.renderable = false;
  });

  cpGroup = game.add.group();
  cpGroup.enableBody = true;
  map.createFromTiles(cpTile, null, '', 'ground', cpGroup);

  cpGroup.forEach(function(tile) {
    tile.body.immovable = true;
    tile.renderable = false;
  });
  
  gvGroup = game.add.group();
  gvGroup.enableBody = true;
  map.createFromTiles(gvTile, null, '', 'ground', gvGroup);

  gvGroup.forEach(function(tile) {
    tile.body.immovable = true;
    tile.renderable = false;
  })
  /*
  platforms = game.add.group();
  platforms.enableBody = true;

  lava = game.add.group();
  lava.enableBody = true;
  
  checkpoints = game.add.group();
  checkpoints.enableBody = true;
  
  grabbables = game.add.group();
  grabbables.enableBody = true;

  gravities = game.add.group();
  gravities.enableBody = true;

  sanics = game.add.group();
  sanics.enableBody = true;

  var scale = 32;

  // Indexing variables
  var x = 0;
  var y = 0;

  var mapArray = [];
  var rowArray = [];

  // Parsing the string into a two-dimensional array
  for (var i = 0; i < levels[levelId].map.length; i++) {
    var cur = levels[levelId].map.charAt(i); // Current character
    if (cur == "\n") {
      mapArray.push(rowArray);
      rowArray = [];
    } else {
      rowArray.push(cur);
    }
  }

  background.width = 64 * scale * (mapArray[0].length + 1);
  
  for (var y = 0; y < mapArray.length; y++) {
    for (var x = 0; x < mapArray[y].length; x++) {
      if (mapArray[y][x] == "#") {
        // Creating a tile! Determining whether it has any neighbors
        var left = false;
        var up = false;
        var right = false;
        var down = false;

        // Vertical checks
        if (x == 0) {
          left = true;
          if (mapArray[y][x+1] == "#") right = true;
        }
        else if (x == mapArray[y].length-1) {
          right = true;
          if (mapArray[y][x-1] == "#") left = true;
        }
        else {
          if (mapArray[y][x-1] == "#") left = true;
          if (mapArray[y][x+1] == "#") right = true;
        }

        // Horizontal checks
        if (y == 0) {
          up = true;
          if (mapArray[y+1][x] == "#") down = true;
        }
        else if (y == mapArray.length-1) {
          down = true;
          if (mapArray[y-1][x] == "#") up = true;
        }
        else {
          if (mapArray[y-1][x] == "#") up = true;
          if (mapArray[y+1][x] == "#") down = true;
        }


        tileImage = 'ground1_';
        tileImage += !left ? 'l' : '';
        tileImage += !up ? 't' : '';
        tileImage += !right ? 'r' : '';
        tileImage += !down ? 'b' : '';

        var tile = platforms.create(x * scale, y * scale, tileImage);
        tile.scale.setTo(scale/64, scale/64);
        tile.body.immovable = true;

        // Preventing impossible collisions
        tile.body.checkCollision.up = !up;
        tile.body.checkCollision.down = !down;
        tile.body.checkCollision.left = !left;
        tile.body.checkCollision.right = !right;
      } else if (mapArray[y][x] == '*') {
        playerSpawn = {
          x: x * scale,
          y: y * scale
        }
      } else if (mapArray[y][x] == 'L') {
        var lavaTile = lava.create(x * scale, y * scale, 'lava');
        lavaTile.body.immovable = true;
        lavaTile.scale.setTo(scale/64, scale/64);
      } else if (mapArray[y][x] == 'C') {
        var checkpoint = checkpoints.create(x * scale, y * scale, 'checkpoint');
        checkpoint.body.immovable = true;
        checkpoint.scale.setTo(scale/64, scale/64);
      } else if (mapArray[y][x] == 'B') {
        var grabbable = grabbables.create(x * scale, y * scale, 'bouncy');
        //bouncy.body.immovable = true;
        grabbable.body.bounce.y = 0.5;
        grabbable.body.gravity.y = bouncyGravity;
        grabbable.scale.setTo(scale/64, scale/64);
      } else if (mapArray[y][x] == 'G') {
        var gravity = gravities.create(x * scale, y * scale, 'gravity');
        gravity.body.immovable = true;
        gravity.scale.setTo(scale/64, scale/64);
      } else if (mapArray[y][x] == 'S') {
        var sanic = sanics.create(x * scale, y * scale, 'sanic');
        sanic.body.immovable = true;
        sanic.scale.setTo(scale/64, scale/64);
      }
    }
  }
 */

  //game.world.setBounds(0, 0, x * scale, y * scale);
}
