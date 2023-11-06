<div align="center">
<br/>
<p>
<img src="https://raw.githubusercontent.com/ZickZenni/Boombox/main/assets/Banner.png" width="720" alt="boombox" />
</p>

</div>

# BoomBox

> BoomBox, an open-source easy to use Discord Music Bot built with TypeScript and discord.js!

## Getting Started

### Requirements:

1. **[Discord Bot](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**

    1.1. Enable **Message Content Intent** under **Privileged Gateway Intents**

2. **[Node.js](https://nodejs.org/en)** 18.12.0 or newer

### Installation:

```sh
git clone https://github.com/zickzenni/Boombox.git
cd Boombox
npm install
```

After installation finishes follow [configuration instructions](#Configuration) then run `npm run start` to start the bot.

## Configuration

Copy and Rename `config_example.json` to `config.json` and fill out the token.

⚠️ Note: Never commit or share your token or api keys publicly ⚠️

## Inviting

Here is a example link to invite the bot. You'll just need to change the `CLIENT_ID` to your bot's id!

These are the set permissions:

-   Read Messages
-   Write Messages
-   Embed Links
-   Embed Files
-   Add Reactions
-   Use External Emojis
-   Use Slash-Commands
-   Connect
-   Speak

```
https://discord.com/oauth2/authorize/?permissions=2150943808&scope=bot&client_id=[CLIENT_ID]
```

## Todo

Currently many features are incomplete, missing or Work-In-Progress

-   [ ] Queue Command
-   [ ] Playlist Command & System
-   [ ] Guild Save System
-   [ ] Skip Command
-   [ ] Resume & Pause Command
-   [ ] Search Command
-   [ ] Settings System
-   [ ] Role Checking
