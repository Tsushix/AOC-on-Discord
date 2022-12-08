# AOC on Discord

This easier program to obtain your private AOC leaderboard on your favorite Discord server !

To configure the program, open `config.json` file and edit fields.


## webhookURL
webhook URL which is on your Discord Server (Server settings => Integrations => Create Webhook => Copy URL)

## leaderboardLINK
link which is on your adress bar when you are on your private leaderboard (https://adventofcode.com/20xx/leaderboard/private/view/xxxxxxx)

## sessionID
cookie's value which manage your login on Advent Of Code. To find it: Shift + F9 => Cookies => session => value

## timeInterval
time interval after which a new leaderboard is sent (in minutes)

Then, launch `index.js` file with a daemon or directly with node.
The first leaderboard will be sent after the time you typed in `config.json`.


