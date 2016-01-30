function menuPreload() {
  normalText = {
    font: 'Liberation Mono',
    fontSize: '52px',
    fill: '#fff'
  };
}

function menuCreate() {
  game.input.gamepad.start();
  gamepad = game.input.gamepad.pad1;
  gamepad.addCallbacks(this, { onConnect: addButtons });
  //this.state.start('Game');

  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  title = game.add.text(40, 80, '[insert game title here]', {font: 'Liberation Mono', fontSize: '64px', fill: '#fff'});
  
  if (!gamepadConnected) {
    whichA = 'Enter';
    whichX = 'F';
  }
 
  enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

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

var play, highscores;

function menuUpdate() {
  var input = processInput();
  if (play) play.destroy();
  play = game.add.text(90, 260, '[' + whichA + '] Play', normalText);
  if (highscores) highscores.destroy();
  highscores = game.add.text(90, 340, '[' + whichX + '] Highscores', normalText);

  if (input.jump || enterButton.isDown) {
    curState = 'Game';
    game.state.start("Game");
  }
}
