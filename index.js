
const puppeteer = require("puppeteer");
const https = require("https");
const Discord = require("discord.js");
const { webhookURL, sessionID, leaderboardID, timeInterval } = require("./config.json");

const web = new Discord.WebhookClient({ url: webhookURL });
if (timeInterval < 1) return console.log("[!] Please, renseign a timeInterval highter than 1 !")

const options = {
    hostname: "adventofcode.com",
    path: `/${new Date().getFullYear()}/leaderboard/private/view/${leaderboardID}.json`,
    method: "GET",
    headers: {'Cookie': `session=${sessionID}`}
    }

https.get(options, res => {
    res.on("data", data => manageData(data))
    res.on("error", err => console.log(err))
});

setInterval(() => {
    https.get(options, res => {
        res.on("data", data => manageData(data))
        res.on("error", err => console.log(err))
    });
}, 1000*60*timeInterval);


function manageData(data){

    if (data?.toString().startsWith("<!DOCTYPE")) return console.log("[!] Leaderboard was not found, change your config and try again !")

    let orderID = {}

    try {data = JSON.parse(data.toString())} catch (error) {}
    
    for (const member in data.members) orderID[data.members[member].name] = [data.members[member].local_score, data.members[member].stars]
    var score = Object.keys(orderID).map(key => [key, orderID[key]])
    score.sort((a,b) => b[1][0] - a[1][0])

    var top = 1
    var date = new Date().getDate()
    let fields = {"top": "", "score": "", "stars": ""}
    if(0 > new Date().getHours() < 6) date-=1
    score.forEach(user => {
        fields["top"]+=`**${top})**\n`
        fields["score"]+=`**${user[1][0]}**\n`
        for (let i = 0; i < Math.floor(user[1][1]/2); i++) fields["stars"]+="★"
        if (user[1][1]%2 != 0) fields["stars"]+="✯"
        for (let i = 0; i < date - Math.floor(user[1][1]/2) - user[1][1]%2; i++) fields["stars"]+='☆'
        if(user[0] == 'null') fields["stars"]+=`　**anonymous**\n`
        else fields["stars"]+=`　**${user[0]}**\n`
        top++
    })

    var hours = new Date().getHours()
    var minutes = new Date().getMinutes()

    if (hours.toLocaleString().length < 2) hours = "0" + hours.toLocaleString()
    if (minutes.toLocaleString().length < 2) minutes = "0" + minutes.toLocaleString()
    
    web.send({embeds: [new Discord.EmbedBuilder()
        .setColor("#303434")
        .setTitle(`Leaderboard of ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}, at ${hours}:${minutes}`)
        .addFields(
            {name: "‏‏‎ ‎", value: fields["top"], inline: true},
            {name: "‏‏‎ ‎", value: fields["score"], inline: true},
            {name: "‏‏‎ ‎", value: fields["stars"], inline: true},
        )
    ]})

    console.log("Running !");
}
