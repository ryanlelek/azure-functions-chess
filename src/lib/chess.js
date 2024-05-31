// === General Info ===
// Chess Board is an 8x8 grid
// Black Pieces Player
//   A => H
// 8 ......
// ^ ......
// 1 ......
// White Pieces Player
//
// More Information:
// https://chessily.com/learn-chess/chess-notation/

// 1-indexed
const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
function ltr_to_int(letter) {
  let index = letters.indexOf(letter);
  if (index !== -1) {
    index += 1;
  }
  return index;
}

// A1, B2, C3, D4, E5...
function valid_notation(input) {
  return /^([A-H][1-8])$/.test(input);
}

// ints only
function valid_coords(h, v) {
  if (h < 1 || h > 8) return false;
  if (v < 1 || v > 8) return false;
  return true;
}

function valid_uuid(str) {
  const regex = new RegExp(
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  );
  return regex.test(str);
}

function notation_to_coords(str) {
  const h = ltr_to_int(str[0]);
  const v = parseInt(str[1], 10);
  return [h, v];
}

function coords_to_notation(x, y) {
  const letter = letters[x - 1];
  return letter + y.toString();
}

// Horizontal then Vertical
const _operations = [
  [1, 2], // up, right
  [-1, 2], // up, left
  [-2, 1], // left,  up
  [-2, -1], // left,  down
  [1, -2], // down, right
  [-1, -2], // down, left
  [2, 1], // right, up
  [2, -1], // right, down
];
// Returns array of moves in notation format
function moves_available(notn) {
  const returnable = [];
  const coords = notation_to_coords(notn);
  for (let i = 0; i < _operations.length; i++) {
    const op = _operations[i];
    const x = coords[0] + op[0];
    const y = coords[1] + op[1];
    if (valid_coords(x, y)) {
      returnable.push(coords_to_notation(x, y));
    }
  }
  return returnable;
}

function generate_move_map() {
  // generate map of available moves
  // can generate in advance and store
  const map = {};
  letters.map((ltr) => {
    for (let i = 1; i <= 8; i++) {
      map[ltr + i] = moves_available(ltr + i);
    }
  });
  return map;
}

function seek_find(move_map, paths) {
  const returnable = [];
  paths.forEach(function (notnarr) {
    move_map[notnarr[notnarr.length - 1]].forEach(function (newpath) {
      returnable.push([...notnarr, newpath]);
    });
  });
  return returnable;
}

// Returns an array of string array(s)
function find_valid_paths(move_map, start, goal) {
  let options = [[start]];
  const valid_paths = [];
  let found = false;
  // Max 10 Moves
  for (let i = 0; i < 10; i++) {
    // Check
    if (found) break;
    options = seek_find(move_map, options);
    options.forEach(function r(o) {
      if (o[o.length - 1] === goal) {
        valid_paths.push(o);
        found = true;
      }
    });
  }
  return valid_paths;
}

module.exports = exports = {
  ltr_to_int,
  valid_notation,
  valid_coords,
  valid_uuid,
  notation_to_coords,
  coords_to_notation,
  moves_available,
  generate_move_map,
  seek_find,
  find_valid_paths,
};
