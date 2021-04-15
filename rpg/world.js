let config = require("./config.js").get_config();
String.prototype.replaceAt = function (index, replacement) {
  return this.substr(0, index) + replacement + this.substring(index + 1);
};

module.exports.render_world = (x, y, map, gender_preference) => {
  result = "";
  for (i = 0; i < map.length; i++) {
    let line = map[i];
    if (i == y) {
      line = line.replaceAt(x, config.player[gender_preference]);
    }
    result += `${line}\n`;
  }
  return result;
};

module.exports.check_collision = (x, y, world) => {
  if (!world.map[y]) {
    return false;
  } else if (!world.map[y][x]) {
    return false;
  }

  let char = world.map[y][x];
  return world.collision_chars.includes(char);
};

/*
--------------------------------------
| gender_preference | Emoji | Nombre |
--------------------------------------
| 0                 | 🧙‍♀️   | Maga   |    
| 1                 | 🧙‍♂️   | Mago   |
| 2                 | 🤖    | Robot  |
--------------------------------------
*/
