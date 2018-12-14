const Discord = require("discord.js");

const YTDL = require("ytdl-core");

const PREFIX = "m*";

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

var hug = [
    "https://media.giphy.com/media/du8yT5dStTeMg/giphy.gif",
    "https://media.giphy.com/media/13YrHUvPzUUmkM/giphy.gif",
    "https://media.giphy.com/media/BXrwTdoho6hkQ/giphy.gif",
    "https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif",
    "https://media.giphy.com/media/wnsgren9NtITS/giphy.gif",
    "https://media.giphy.com/media/wSY4wcrHnB0CA/giphy.gif",
    "https://media.giphy.com/media/q3kYEKHyiU4kU/giphy.gif",
];

var fortunes = [
    "Yes",
    "No",
    "Maybe",
    "I don't know",
    "Ask again later",
];

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function() {
    console.log("Ready!");

    bot.user.setActivity("Type 'm*commands' for help");
});

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0].toLowerCase()) {
        case "play":
        if (!args[1]) {
            message.channel.send("Please provide a link");
            return;
        }

        if (!message.member.voiceChannel) {
            message.channel.send("You must be in a voice channel");
            return;
        }

        if (!servers[message.guild.id]) servers[message.guild.id] = {
            queue: []
        };

        var server = servers[message.guild.id];

        server.queue.push(args[1]);

        if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
            play(connection, message);
        });

        return message.channel.send("Song has been added to queue");
        break;

        case "skip":
        var server = servers[message.guild.id];

        if (server.dispatcher) server.dispatcher.end();

        return message.channel.send("Song has been skipped");
        break;

        case "stop":
        var server = servers[message.guild.id];

        if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();

        return message.channel.send("Bot has been stopped");
        break;

        case "commands":
        message.channel.send("Commands for music are 'play', 'skip', and 'stop'. Other's so far are 'hug' and '8ball'. Still working on more.");
        break;

        case "hug":
        if (message.content = "@!") {
            message.channel.send(hug[Math.floor(Math.random() * hug.length)]);
        } else {
            message.channel.send(hug[Math.floor(Math.random() * hug.length)]);
        }
        break;

        case "8ball":
        if (!args[2]) {
            message.channel.send("Please ask a full question!");
        } else {
            message.channel.send(fortunes[Math.floor(Math.random() * fortunes.length)]);
        }
        break;

        default:
        message.channel.send("Invalid command");
        break;
    }
});

bot.login(TOKEN);
