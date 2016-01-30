var last_input = {};
var last_presses = {};
var count = 0;
var triggers = [];

function compare(obj1, obj2) { // Shallow comparison of objects
  for (val in obj1) {
    if (obj1[val] != obj2[val])
      return false;
  }
  return true;
}

function all_false(input) { // Check if all properties of the object are false
  for (val in input) {
    if (input[val] != false)
      return false;
  }
  return true;
}

function check_input(input) {
  if (!compare(input, last_input)) {
    if (!all_false(input)) {
      if (compare(input, last_presses)) {
        if (count == 0) {
         count = 2; // This will be the second keypress in a row
        } else {
          count++;
        }
        check_triggers();
      } else {
        count = 0;
      }
      last_presses = input;
    }
    last_input = input;
  }
}

function check_triggers() {
  for (idx in triggers) {
    if (compare(triggers[idx].button_combo, last_presses)
    && triggers[idx].times == count) {
      triggers[idx].callback();
    }
  }
}

function get_counts() {
  return counts;
}

function set_trigger(button_combo, times, callback) {
  // console.log(button_combo);
  // console.log(times);
  // console.log(callback);
  triggers.push({button_combo: button_combo, times: times, callback: callback});
}

function clear_triggers() {
  triggers = [];
}
