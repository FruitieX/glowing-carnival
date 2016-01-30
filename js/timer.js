var timer;

function startTimer() {
  timer = game.time.create(false);
    
  timer.start();
    
  return timer;
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function renderTimer() {
  var minutes = timer.ms / (1000 * 60)
  var seconds = timer.ms / 1000;
  var ms = timer.ms % 1000;
  game.debug.text(minutes.toFixed(0) + ":" + seconds.toFixed(0) + ":" + pad(ms, 3), 30, 30);
}