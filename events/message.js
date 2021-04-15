module.exports = async (client, message) => {
  if (message.author.bot) return;
  const prefix = message.content.match(new RegExp(`^<@!?${client.user.id}> `))
    ? message.content.match(new RegExp(`^<@!?${client.user.id}> `))[0]
    : "dr!";
  if (!message.content.toUpperCase().startsWith(prefix.toUpperCase())) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command);
  if (command === "rpg") {
    require("../rpg/main").rpg(client, message, args);
  } else {
    if (!cmd) return message.reply("Y only have dr!rpg command");
    cmd.run(client, message, args, util);
  }
};
