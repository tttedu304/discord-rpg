let world_tools = require("./world.js");
let save_tools = require("./saves.js");
let config = require("./config.js").get_config();
const Discord = require("discord.js");
async function display(message, args, callback) {
  let display;
  await message.channel.send("Loading...").then((msg) => {
    display = msg;
  });
  await game_reactions(display);
  return callback(display);
}
function simple_embed(content, display) {
  display.edit(new Discord.MessageEmbed().setDescription(content));
}
async function game_reactions(display) {
  //await display.reactions.removeAll();
  await simple_embed("⬜⬛⬛⬛", display);
  await display.react("◀");
  await display.react("▶");
  await simple_embed("⬜⬜⬛⬛", display);
  await display.react("🔽");
  await display.react("🔼");
  await simple_embed("⬜⬜⬜⬛", display);
  await display.react("📄");
  await display.react("✳");
  await simple_embed("⬜⬜⬜⬜", display);
  await display.react("❌");
}

async function confirm_exit_screen(display) {
  //await display.reactions.removeAll();
  await simple_embed("Do you really want to exit? Press 🔴 to cancel", display);
  await display.react("🔴");
  await display.react("🔵");
}
const render = function (x, y, display, world, message_box_contents, gender) {
  let display_map = world_tools.render_world(x, y, world.map, gender);
  display.edit(
    new Discord.MessageEmbed()
      .addField(world.icon + " Map", display_map)
      .addField("Text", "```" + message_box_contents + "```")
  );
};

/*
----------------------------------------------------------------------------------
| Modo | Nombre  | Descripción                                                    |
----------------------------------------------------------------------------------
| 0    | Mapa    | Es el modo en el que estás en el mapa y controlas al personaje |
| 1    | Menú    | Modo en el que se renderiza el menú                            |
| 2    | Batalla | Modo en el que se lucha en una batalla por turnos              |
----------------------------------------------------------------------------------- 
*/
async function animation_battle_intro(
  display,
  world,
  x,
  y,
  message_box_contents,
  gender
) {
  let rendered = world_tools.render_world(x, y, world.map, gender);
  let screen_lines = rendered.split("\n");
  for (let i = 0; i < 10; i += 2) {
    screen_lines[i] = "⬛".repeat(10);
    screen_lines[i + 1] = "⬛".repeat(10);
    await display.edit(
      new Discord.MessageEmbed()
        .addField(world.icon + " Map", screen_lines.join("\n"))
        .addField("Text", "```" + message_box_contents + "```")
    );
  }
}
function render_menu(selection, display) {
  let desc = "";
  config.UI.labels.forEach((label, i) => {
    if (i === selection) {
      desc += "**" + label + "**\n";
    } else {
      desc += label + "\n";
    }
  });
  simple_embed(desc, display);
}
module.exports.rpg = (client, message, args) => {
  let author = message.author.id;
  let user = message.author;
  display(message, args, (display) => {
    let world_filename = "./worlds/test.json";
    let world = require("./worlds/test.json");
    let gender = 0;
    let text_box = "This is a test";
    let x = 1;
    let y = 1;
    let mode = 0;
    let selection = 0;
    render(x, y, display, world, text_box, gender);
    const userFilter = (reaction, user) => {
      return user.id === author;
    };
    const filterTrue = () => true;
    const collector = display.createReactionCollector(userFilter);
    collector.on("collect", (reactionObject) => {
      console.log(reactionObject);
      reactionObject.remove(message.author);
      let reaction = reactionObject.emoji.name;

      let event_data = onkeypress(
        react2key(reaction),
        world,
        x,
        y,
        text_box,
        display,
        gender,
        mode,
        selection,
        world_filename,
        user
      );
      x = event_data.x;
      y = event_data.y;
      mode = event_data.mode;
      text_box = event_data.message;
      if (event_data.stop) {
        return collector.stop();
      }
      if (event_data.change_world !== "") {
        world_filename = "./worlds/" + event_data.change_world;
        world = require("./worlds/" + event_data.change_world);
      }
      if (mode === 1) {
        selection = event_data.selection;
      }
      if (event_data.render) {
        if (mode === 0) {
          render(x, y, display, world, text_box, gender); //ok
        }
        if (mode === 1) {
          render_menu(selection, display);
        }
      }
    });
    collector.on("end", () => {
      display.delete();
    });
  });
};

function react2key(reaction) {
  let config = require("./config.js").get_config();
  const index = config.reactions.findIndex((reactio) => reactio === reaction);
  return config.keys[index];
}

function onkeypress(
  key,
  world,
  x,
  y,
  text_box_message,
  display,
  gender,
  mode,
  selection,
  world_filename,
  user
) {
  let change_world = "";
  let needs_render = false;
  let stop = false;
  let message = text_box_message;
  if (key === "left" && mode === 0) {
    if (x - 1 < 0) {
      x = 9;
      change_world = world.sides[3];
      needs_render = true;
    }
    if (!world_tools.check_collision(x - 1, y, world)) {
      x--;
      needs_render = true;
    }
  }
  if (key === "right" && mode === 0) {
    if (x + 1 > 9) {
      x = 0;
      change_world = world.sides[4];
      needs_render = true;
    }
    if (!world_tools.check_collision(x + 1, y, world)) {
      x++;
      needs_render = true;
    }
  }
  if (key === "up") {
    if (mode === 0) {
      if (y - 1 < 0) {
        y = 9;
        change_world = world.sides[0];
        needs_render = true;
      }
      if (!world_tools.check_collision(x, y - 1, world)) {
        y--;
        needs_render = true;
      }
    }
    if (mode === 1) {
      if (selection !== 0) {
        selection--;
        needs_render = true;
      }
    }
  }
  if (key === "down") {
    if (mode === 0) {
      if (y + 1 > 9) {
        y = 0;
        change_world = world.sides[1];
        needs_render = true;
      }
      if (!world_tools.check_collision(x, y + 1, world)) {
        y++;
        needs_render = true;
      }
    }
    if (mode === 1) {
      if (selection !== config.UI.labels.length - 1) {
        selection += 1;
        needs_render = true;
      }
    }
  }
  if (key === "exit") {
    confirm_exit_screen(display);
  }
  if (key === "confirm_exit") {
    stop = true;
  }
  if (key === "cancel_exit") {
    (async function () {
      await game_reactions(display);
      needs_render = true;
      render(x, y, display, world, message, gender);
    })();
  }
  if (key === "menu") {
    mode = 1;
    needs_render = true;
  }
  if (key === "interact") {
    if (mode === 1) {
      if (selection === 2) {
        mode = 0;
        needs_render = true;
      }
    }
  }

  if (key === "test") {
    display.channel.send(
      new Discord.Attachment(
        save_tools.generateSave(x, y, world_filename, user),
        user.username + ".save"
      )
    );
  }
  return {
    render: needs_render,
    x: x,
    y: y,
    message: message,
    change_world: change_world,
    stop: stop,
    selection: selection,
    mode: mode,
  };
}
