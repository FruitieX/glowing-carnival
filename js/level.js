function loadLevel(level) {
  platforms = game.add.group();

  platforms.enableBody = true;

  var scale = 32;

  // Indexing variables
  var x = 0;
  var y = 0;
  for (var i = 0; i < level.map.length; i++) {
    var cur = level.map.charAt(i); // Current character
    if (cur == "\n") {
      x = 0;
      y++;
    } else {
      console.log("x="+x+"y="+y);
      if (cur == "#") {
        var tile = platforms.create(x * scale, y * scale, 'ground1_t');
        tile.scale.setTo(scale/64, scale/64);
        tile.body.immovable = true;
      }
      x++;
    }
  }

  game.world.setBounds(0, 0, x * scale, (y+1) * scale);
}
