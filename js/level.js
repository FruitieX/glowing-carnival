function loadLevel(level) {
  platforms = game.add.group();
  platforms.enableBody = true;

  lava = game.add.group();
  lava.enableBody = true;

  var scale = 32;

  // Indexing variables
  var x = 0;
  var y = 0;

  var mapArray = [];
  var rowArray = [];

  // Parsing the string into a two-dimensional array
  for (var i = 0; i < level.map.length; i++) {
    var cur = level.map.charAt(i); // Current character
    if (cur == "\n") {
      mapArray.push(rowArray);
      rowArray = [];
    } else {
      rowArray.push(cur);
    }
  }
  mapArray.push(rowArray);

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
      }
    }
  }

  game.world.setBounds(0, 0, x * scale, (y+1) * scale);
}
