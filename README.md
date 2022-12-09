# AOC on Discord

The easiest way to get your private AOC leaderboard on your favorite Discord server !

To configure the program, open `config.json` file and edit the fields.


## webhookURL
Webhook URL which is on your Discord Server, to fint it:  
`Server settings => Integrations => Create Webhook => Copy URL`

## leaderboardID
Last numbers which is on your adress bar when you are on your private leaderboard, it should look like this:  
`https://adventofcode.com/20xx/leaderboard/private/view/__XXXXXXX__`

## sessionID
Cookie's value which manage your login on Advent Of Code. To find it:  
`Shift + F9 => Cookies => session => value`

## timeInterval
Time interval after which a new leaderboard is sent (in minutes)


Then, launch `index.js` file with a daemon or directly with node (don't forget to install the project dependencies)
The first leaderboard will be sent after the time you typed in `config.json`.