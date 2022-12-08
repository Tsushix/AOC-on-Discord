
const puppeteer = require("puppeteer");
const Discord = require("discord.js");
const sizeOf = require("image-size");
const { webhookURL, sessionID, leaderboardLINK, timeInterval } = require("./credentials.json");

console.log(sessionID)
const web = new Discord.WebhookClient({ url: webhookURL });
console.log("Lancé !");
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(leaderboardLINK);
    await page.setCookie({name: "session", value: sessionID});
    await page.goto(leaderboardLINK);

    setInterval(async () => {
        var height = sizeOf(await page.screenshot({fullPage: true})).height;
        var width = sizeOf(await page.screenshot({fullPage: true})).width;
        await page.screenshot({clip: {x: 0, y:286, height: height - 320, width: width - 430}}).then(image => {
        const attachment = new Discord.AttachmentBuilder(image, { name: `leaderboard.png`})
        web.send({embeds: [new Discord.EmbedBuilder()
            .setColor("#303434")
            .setImage(`attachment://leaderboard.png`)
            .setDescription(`**Leaderboard du ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}, à ${new Date().getHours()}:${new Date().getMinutes()}**`)
        ],files: [attachment]})
    })
    }, timeInterval*1000);

    
})()
