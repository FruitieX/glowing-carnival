function updateAnimations() {
  if (player.body.touching.down) {
    if (player.body.velocity.x > stillDelta) {
      player.animations.play('right');
    } else if (player.body.velocity.x < -stillDelta) {
      player.animations.play('left');
    } else {
      player.animations.play('stand');
    }
  } else {
    player.animations.play('jump');
  }
}
