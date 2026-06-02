<p align="center">
  <img src="https://github.com/Sk8rfu/SupraMusicV1-EN/blob/assets/supra.jpg?raw=true?raw=true">
</p>

<p align="center">
<img src="https://img.shields.io/badge/Node.js-16+-green?logo=node.js">
<img src="https://img.shields.io/badge/discord.js-v14-blue?logo=discord">
<img src="https://img.shields.io/badge/yt--dlp-Enabled-yellow">
<img src="https://img.shields.io/badge/Spotify-No_Premium_Required-brightgreen?logo=spotify">
<img src="https://img.shields.io/badge/Status-Legacy-orange">
<img src="https://img.shields.io/badge/License-MIT-purple">
</p>

## 🎵 SupraMusic V1
Classic Discord Music Bot using yt-dlp + play-dl

## 📌 Overview
SupraMusic V1 is a lightweight, stable and classic Discord music bot built using:

discord.js v14

@discordjs/voice

play-dl

yt-dlp (local binary)

This version focuses on simplicity and stability, offering clean music playback from YouTube and Spotify (no Premium required) by converting Spotify tracks into YouTube equivalents.

## 🚀 Features
🎶 Play music from YouTube

🎧 Play Spotify tracks (converted to YouTube automatically)

📂 Full queue system

⏸ Pause / ▶ Resume

⏭ Skip

⏹ Stop & clear queue

🔁 Loop mode

📜 Now Playing info

🧾 Queue preview

⚡ Fast streaming using yt-dlp

🟦 Slash commands

## 🛠️ Technologies Used
Node.js

discord.js v14

@discordjs/voice

play-dl

yt-dlp (local binary required)

dotenv

## 📦 Installation
```
git clone https://github.com/Sk8rfu/SupraMusicV1-EN
cd SupraMusicV1-EN
npm install
```

## ⚙️ Configuration
Create a .env file:

env

TOKEN=YOUR_BOT_TOKEN

CLIENT_ID=YOUR_ID_Application

## 🔧 yt-dlp requirement
Place the yt-dlp binary next to musicHandler.js:

```
/project
   musicHandler.js
   yt-dlp
```
Make sure it is executable:

```
chmod +x yt-dlp
```

## ▶️ Running the Bot
1. Register slash commands:
```
node deploy-commands.js
```

2. Start the bot:
```
node index.js
```

## 🎛️ Commands
/play	- Play a song from YouTube or Spotify

/pause - Pause the current song

/resume -	Resume paused music

/skip -	Skip the current song

/stop -	Stop music and leave the channel

/queue - Show the current queue

/nowplaying -	Show the currently playing track

/loop	- Toggle loop mode


## 📂 Project Structure
```
SupraMusicV1-EN/
│── commands/
│   ├── play.js
│   ├── pause.js
│   ├── resume.js
│   ├── skip.js
│   ├── stop.js
│   ├── queue.js
│   ├── nowplaying.js
│   └── loop.js
│
│── musicHandler.js
│── index.js
│── deploy-commands.js
│── package.json
│── package-lock.json
│── .env
│── yt-dlp
```

## 📝 License
This project is licensed under the MIT License.

## ⭐ Support
If you like this project, consider giving it a star on GitHub.
It helps the project grow and motivates further development.
