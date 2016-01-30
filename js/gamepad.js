var buttonA;
var buttonB;
var buttonX;
var buttonY;

var buttonDPadLeft;
var buttonDPadDown;
var buttonDPadUp;
var buttonDPadRight;

var gamepadConnected = false;

function addButtons() {
  gamepadConnected = true;

  //  We can't do this until we know that the gamepad has been connected and is started
  buttonA = gamepad.getButton(Phaser.Gamepad.XBOX360_A);
  buttonA.onDown.add(jump, this);

  buttonB = gamepad.getButton(Phaser.Gamepad.XBOX360_B);
  buttonX = gamepad.getButton(Phaser.Gamepad.XBOX360_X);
  buttonR2 = gamepad.getButton(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER);
  buttonY = gamepad.getButton(Phaser.Gamepad.XBOX360_Y);

  /*
  buttonA.onDown.add(onDown, this);
  buttonB.onDown.add(onDown, this);
  buttonX.onDown.add(onDown, this);
  buttonY.onDown.add(onDown, this);

  buttonA.onUp.add(onUp, this);
  buttonB.onUp.add(onUp, this);
  buttonX.onUp.add(onUp, this);
  buttonY.onUp.add(onUp, this);
  */

  //  These won't work in Firefox, sorry! It uses totally different button mappings
  /* TODO: then what works? */
  buttonDPadLeft = gamepad.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT);
  buttonDPadRight = gamepad.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT);
  buttonDPadUp = gamepad.getButton(Phaser.Gamepad.XBOX360_DPAD_UP);
  buttonDPadDown = gamepad.getButton(Phaser.Gamepad.XBOX360_DPAD_DOWN);

  /*
  buttonDPadLeft.onDown.add(onDown, this);
  buttonDPadRight.onDown.add(onDown, this);
  buttonDPadUp.onDown.add(onDown, this);
  buttonDPadDown.onDown.add(onDown, this);

  buttonDPadLeft.onUp.add(onUp, this);
  buttonDPadRight.onUp.add(onUp, this);
  buttonDPadUp.onUp.add(onUp, this);
  buttonDPadDown.onUp.add(onUp, this);
  */
}
