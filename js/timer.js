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
  var minutes = (Math.floor(timer.ms / (1000 * 60))) % 60;
  var seconds = (Math.floor(timer.ms / 1000)) % 60;
  var ms = timer.ms % 1000;
  time = minutes + ":" + ("0" + seconds).slice(-2) + ":" + pad(ms, 3);
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
