function menuPreload() {
  caption = {
    font: 'Liberation Mono',
    fontSize: '64px',
    fill: '#fff'
  }; 
  normalText = {
    font: 'Liberation Mono',
    fontSize: '52px',
    fill: '#fff'
  };
}

var title, play, highscores;

function menuCreate() {
  game.input.gamepad.start();
  gamepad = game.input.gamepad.pad1;
  gamepad.addCallbacks(this, { onConnect: addButtons });
  //this.state.start('Game');

  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  title = game.add.text(40, 80, '[insert game title here]', caption);
  
  if (!gamepadConnected) {
    whichA = 'Enter';
    whichX = 'F';
  }
 
  enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  fButton = game.input.keyboard.addKey(Phaser.Keyboard.F);
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  jumpButton.onDown.add(jump, this);

  runButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
  resetButton = game.input.keyboard.addKey(Phaser.Keyboard.R);
  escButton = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

  cursors = game.input.keyboard.createCursorKeys();
  cursors.up.onDown.add(jump, this);

  cursors.left.onDown.add(onLeft, this);
  cursors.right.onDown.add(onRight, this);
}

var highscoresStatus = false;
function menuUpdate() {
  var input = processInput();
  if (!highscoresStatus) {
    if (play) play.destroy();
    play = game.add.text(90, 260, '[' + whichA + '] Play', normalText);
    if (highscores) highscores.destroy();
    highscores = game.add.text(90, 340, '[' + whichX + '] Highscores', normalText);

    if (input.jump || enterButton.isDown) {
      curState = 'Game';
      game.state.start("Game");
    }
  }

  if (input.X || fButton.isDown) {
    highscoresStatus = true;
    if (title) title.destroy();
    title = game.add.text(40, 80, 'Highscores', caption);
    if (play) play.destroy();
    if (highscores) highscores.destroy();

    highscoresData = game.add.text(90, 180, getHighscores(), normalText);
  }
}

function getHighscores() {
  output = '';
  for (var i = 0; i < localStorage.length; i++) {
    try {
      obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
      if (obj) {
        console.log(obj);
        if (obj.time) output += ("Level " + (obj.level+1) + ": " + obj.time + "\n");
      }
    } catch (SyntaxError) {}
  }
  return output;
}
