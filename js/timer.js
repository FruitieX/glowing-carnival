var timer;
var time;

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
  time = minutes.toFixed(0) + ":" + seconds.toFixed(0) + ":" + pad(ms, 3);
  game.debug.text(time, 30, 30);
}

function saveTime(levelId) {
    var current = {
        level: levelId,
        time: time
    };
    var previous = JSON.parse(localStorage.getItem("HighScore " + levelId));
    if(!previous || current.time < previous.time) {
        localStorage.setItem("HighScore " + levelId, JSON.stringify(current));
    } else {
        localStorage.setItem("HighScore " + levelId, JSON.stringify(previous));
    }
}
