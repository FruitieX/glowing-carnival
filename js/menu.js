function menuPreload() {
  game.input.gamepad.start();
  gamepad = game.input.gamepad.pad1;
  gamepad.addCallbacks(this, { onConnect: addButtons });
  
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


  //this.state.start('Game');
}

function menuUpdate() {
  if (gamepadConnected) {
    console.log("gamepad");
    startButton |= buttonA;
  }

  game.state.start("Game");
}
