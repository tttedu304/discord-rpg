let secrets = [12];
let actual_secret = 0;
module.exports.generateSave = (x, y, world_filename, user) => {
  let secret = secrets[actual_secret];
  let save = {};
  save.x = x;
  save.y = y;
  save.world_filename = world_filename;
  save.user_id = user.id;
  save.check =
    (x + y) * secret + world_filename.length * secret + parseInt(user.id);
  return Buffer.from(JSON.stringify(save), "utf8");
};

/* Algoritmo anti-cheat
    ( (x+y) * secret ) + (world_filename.length*secret) + parseInt(user.id)
*/
