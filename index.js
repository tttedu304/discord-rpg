require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client();

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Discord.Collection();

client.login(process.env.TOKEN);
