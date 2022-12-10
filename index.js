
const https = require("https");
const Discord = require("discord.js");
const { QuickDB } = require('quick.db');
require('dotenv').config();
const db = new QuickDB();

const aoc = new Discord.Client({intents: [Discord.GatewayIntentBits.MessageContent, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.Guilds]});
aoc.login(process.env.TOKEN);
send = false

aoc.on("ready", async () => console.log("I'm ready !"));
aoc.on("messageCreate", async message => {

    const owner = aoc.users.cache.get("454939105411858432")

    const session = new Discord.ButtonBuilder()
        .setCustomId("sessionid")
        .setLabel("Set Session ID")
        .setStyle(Discord.ButtonStyle.Secondary)

    const leaderboard = new Discord.ButtonBuilder()
        .setCustomId("leaderboardid")
        .setLabel("Set Leaderboard ID")
        .setStyle(Discord.ButtonStyle.Secondary)
            
    const time = new Discord.ButtonBuilder()
        .setCustomId("timeinterval")
        .setLabel("Set Time Interval")
        .setStyle(Discord.ButtonStyle.Secondary)
    
    const channel = new Discord.ButtonBuilder()
        .setCustomId("channelid")
        .setLabel("Set Channel ID")
        .setStyle(Discord.ButtonStyle.Secondary)

    const all = new Discord.ButtonBuilder()
        .setCustomId("all")
        .setLabel("Setup ALL")
        .setStyle(Discord.ButtonStyle.Danger)
    
    const ping = new Discord.ButtonBuilder()
        .setCustomId("ping")
        .setLabel("Ping!")
        .setStyle(Discord.ButtonStyle.Success)
    
    if(await db.get("session") == null || await db.get("leaderboard") == null || await db.get("time") == null || await db.get("channel") == null){
        session.setDisabled(true)
        leaderboard.setDisabled(true)
        time.setDisabled(true)
        channel.setDisabled(true)
        ping.setDisabled(true)
    }

    const row = new Discord.ActionRowBuilder().addComponents(session, leaderboard, time, channel)
    const row2 = new Discord.ActionRowBuilder().addComponents(all, ping)

    if(message.content == `<@${aoc.user.id}>` || message.content == `<@!${aoc.user.id}>`) message.channel.send({embeds: [new Discord.EmbedBuilder()
        .setTitle("What do you want to do ?")
        .setColor("#303434")
        .setThumbnail(aoc.user.displayAvatarURL({extension: "png"}))
        .setFooter({iconURL: owner.displayAvatarURL({extension: "png"}), text: `Created by ${owner.tag}`})
    ], components: [row, row2]})

});
aoc.on("interactionCreate", async interaction => {

    if(interaction.customId == "sessionid"){
        const row = new Discord.ModalBuilder()
            .setCustomId("sessionidModal")
            .setTitle("Set Session ID")
            .setComponents(
                new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId('sessionidInput')
                        .setLabel("Fill in with your session ID")
                        .setPlaceholder("Your session ID is confidential, don't communicate it")
                        .setStyle(Discord.TextInputStyle.Paragraph)
                        .setMaxLength(128)
                        .setRequired(true)
                )
            )
        
        await interaction.showModal(row)
    }
    if(interaction.customId == "leaderboardid"){
        const row = new Discord.ModalBuilder()
            .setCustomId("leaderboardidModal")
            .setTitle("Set Leaderboard ID")
            .setComponents(
                new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId('leaderboardidInput')
                        .setLabel("Fill in your leaderboard ID")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setMaxLength(7)
                        .setRequired(true)
                )
            )
        
        await interaction.showModal(row)
    }
    if(interaction.customId == "timeinterval"){
        const row = new Discord.ModalBuilder()
            .setCustomId("timeModal")
            .setTitle("Set Time Interval")
            .setComponents(
                new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId('timeInput')
                        .setLabel("Fill in your time interval")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setPlaceholder("Number or \"automatic\"")
                        .setMaxLength(9)
                        .setRequired(true)
                )
            )
        
        await interaction.showModal(row)
    }
    if(interaction.customId == "channelid"){
        const row = new Discord.ModalBuilder()
            .setCustomId("channelModal")
            .setTitle("Set Channel ID")
            .setComponents(
                new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId('channelInput')
                        .setLabel("Fill in your channel ID")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setPlaceholder("Channel ID in which to receive the leaderboards")
                        .setMaxLength(19)
                        .setRequired(true)
                )
            )
        
        await interaction.showModal(row)
    }
    if(interaction.customId == "all"){
        const row = new Discord.ModalBuilder()
            .setCustomId("allModal")
            .setTitle("Setup ALL")
            .setComponents(
                new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId('sessionidInput')
                        .setLabel("Fill in with your session ID")
                        .setPlaceholder("Your session ID is confidential, don't communicate it")
                        .setStyle(Discord.TextInputStyle.Paragraph)
                        .setMaxLength(128)
                        .setRequired(true)
                ),
                new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId('leaderboardidInput')
                        .setLabel("Fill in your leaderboard ID")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setMaxLength(7)
                        .setRequired(true)
                ),
                new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId('timeInput')
                        .setLabel("Fill in your time interval")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setPlaceholder("Number or \"automatic\"")
                        .setMaxLength(9)
                        .setRequired(true)
                ),
                new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId('channelInput')
                        .setLabel("Fill in your channel ID")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setPlaceholder("Channel ID in which to receive the leaderboards")
                        .setMaxLength(19)
                        .setRequired(true)
                )
            )
        
        await interaction.showModal(row)
    }
    if(interaction.customId == "ping"){
        await interaction.reply({content: "Pong!", ephemeral: true})
        const timeInterval = await db.get("time")
        const leaderboardID = await db.get("leaderboard")
        const sessionID = await db.get("session")
        const channel = await db.get("channel")

        let found = false
        interaction.guild.channels.cache.get(channel).members.forEach(member => {
            if (member.id == aoc.user.id) found = true
        })
        if(!found) return await interaction.reply({content: "[!] The channel is not found ! Please, renseign a valid ID and check if the bot can access it", ephemeral: true})

        if (parseInt(timeInterval) < 1 && timeInterval?.toLowerCase() != "automatic") return await interaction.reply({content: "[!] Please, renseign a time interval highter than 1 !", ephemeral: true})
        if (isNaN(timeInterval) && timeInterval?.toLowerCase() != "automatic") return await interaction.reply({content: "[!] This keyword is uknown, please, change it with an other keyword or a number !", ephemeral: true})

        let optionsSESSION = {
            hostname: "adventofcode.com",
            path: `/${new Date().getFullYear()}/leaderboard/self`,
            method: "GET",
            headers: {'Cookie': `session=${sessionID}`}
            }
        
        let optionsLEADERBOARD = {
            hostname: "adventofcode.com",
            path: `/${new Date().getFullYear()}/leaderboard/private/${leaderboardID}.json`,
            method: "GET",
            headers: {'Cookie': `session=${sessionID}`}
            }

        https.get(optionsSESSION, res => res.on("data", async data => {
            if (data?.toString().startsWith("<!DOCTYPE")) return await interaction.reply({content: "[!] The session ID is invalid !", ephemeral: true})

            https.get(optionsLEADERBOARD, res => res.on("data", async data => {
                if (data?.toString().startsWith("404")) return await interaction.reply({content: "[!] The leaderboard ID is invalid !", ephemeral: true})
                getLeaderboard()
            }));

        }));

    }

    if(interaction.customId == "sessionidModal") await db.set("session", interaction.fields.getTextInputValue('sessionidInput'))
    if(interaction.customId == 'leaderboardidModal') await db.set("leaderboard", interaction.fields.getTextInputValue('leaderboardidInput'))
    if(interaction.customId == "timeModal") await db.set("time", interaction.fields.getTextInputValue('timeInput'))
    if(interaction.customId == "channelModal") await db.set("channel", interaction.fields.getTextInputValue('channelInput'))
    if(interaction.customId == "allModal"){
        await db.set("session", interaction.fields.getTextInputValue('sessionidInput'))
        await db.set("leaderboard", interaction.fields.getTextInputValue('leaderboardidInput'))
        await db.set("time", interaction.fields.getTextInputValue('timeInput'))
        await db.set("channel", interaction.fields.getTextInputValue('channelInput'))
    }
    if(interaction.customId == "allModal" || interaction.customId == "channelModal" || interaction.customId == "sessionidModal" || interaction.customId == 'leaderboardidModal' || interaction.customId == "timeModal") await interaction.reply({content: 'Configuration completed successfully!', ephemeral: true})

});


async function getLeaderboard(){

    const timeInterval = await db.get('timeInterval')
    const leaderboardID = await db.get("leaderboard")
    const sessionID = await db.get("session")
    const channel = await db.get("channel")

    let timeIntervalS = 0;
    if(timeInterval?.toLowerCase() == "automatic") timeIntervalS = 1
    else timeIntervalS = timeInterval
    let lastDATA;

    const options = {
        hostname: "adventofcode.com",
        path: `/${new Date().getFullYear()}/leaderboard/private/view/${leaderboardID}.json`,
        method: "GET",
        headers: {'Cookie': `session=${sessionID}`}
        }

    let datas = "";

    https.get(options, res => {
        res.on("data", chunk => datas += chunk)
        res.on("end", () => manageData(datas, timeInterval, channel, lastDATA))
        res.on("error", err => console.log(err))
    });

    setInterval(() => {
        let datas = "";
        https.get(options, res => {
            res.on("data", chunk => datas += chunk)
            res.on("end", () => manageData(datas, timeInterval, channel, lastDATA))
            res.on("error", err => console.log(err))
        });
    }, 1000*60*timeIntervalS);

}

async function manageData(data, timeInterval, channel, lastDATA){

    let orderID = {}

    data = JSON.parse(data.toString())

    lastDATA = data
    
    for (const member in data.members) orderID[data.members[member].name] = [data.members[member].local_score, data.members[member].stars]
    let score = Object.keys(orderID).map(key => [key, orderID[key]])
    score.sort((a,b) => b[1][0] - a[1][0])

    let top = 1
    let date = new Date().getDate()
    let otherFields = []
    if(new Date().getHours() < 6 && new Date().getHours() > 0) date-=1
    score.forEach(user => {
        if(user[0] == 'null') username="anonymous"
        else username=user[0]
        let stars = ""
        for (let i = 0; i < Math.floor(user[1][1]/2); i++) stars+="★"
        if (user[1][1]%2 != 0) stars+="✯"
        for (let i = 0; i < date - Math.floor(user[1][1]/2) - user[1][1]%2; i++) stars+='☆'
        otherFields.push({name: `**${top})　${user[1][0]}　　${username}**`, value: stars})
        top++
    })

    let hours = new Date().getHours()
    let minutes = new Date().getMinutes()

    if (hours.toLocaleString().length < 2) hours = "0" + hours.toLocaleString()
    if (minutes.toLocaleString().length < 2) minutes = "0" + minutes.toLocaleString()
    
    if (lastDATA == data && timeInterval?.toLowerCase() == "automatic") aoc.channels.cache.get(channel).send({embeds: [new Discord.EmbedBuilder()
        .setColor("#303434")
        .setTitle(`Leaderboard of ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}, at ${hours}:${minutes}`)
        .addFields(otherFields)
    ]})
    else if (timeInterval?.toLowerCase() != "automatic") aoc.channels.cache.get(channel).send({embeds: [new Discord.EmbedBuilder()
        .setColor("#303434")
        .setTitle(`Leaderboard of ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}, at ${hours}:${minutes}`)
        .addFields(otherFields)
    ]})
}