function menuPreload() {
  normalText = {
    font: 'Liberation Mono',
    fontSize: '52px',
    fill: '#fff'
  };
}

function menuCreate() {
  title = game.add.text(40, 80, '[insert game title here]', {font: 'Liberation Mono', fontSize: '64px', fill: '#fff'});
  play = game.add.text(90, 260, '[A] Play', normalText);
  highscores = game.add.text(90, 340, '[B] Highscores', normalText);

  var startButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

  game.input.gamepad.start();
  gamepad = game.input.gamepad.pad1;
  gamepad.addCallbacks(this, { onConnect: addButtons });
  //this.state.start('Game');

  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  jumpButton.onDown.add(jump, this);

  runButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
  resetButton = game.input.keyboard.addKey(Phaser.Keyboard.R);

  cursors = game.input.keyboard.createCursorKeys();
  cursors.up.onDown.add(jump, this);
}

function menuUpdate() {
  var input = processInput();

  if (input.jump) {
    curState = 'Game';
    game.state.start("Game");
  }
}
