import audio from "audio";
import fs from "fs";

const path = "./songs";

const songs = fs
  .readdirSync(path)
  .filter((el) => el.endsWith(".mp3"));

let selected = 0;
let currentSong = null;
let progressTimer = null;


// Show the song list
function showSongs() {
  console.clear();

  console.log("🎶 Welcome to the Songs App 🎶\n");

  for (let i = 0; i < songs.length; i++) {

    const songName = songs[i].split(".")[0];

    if (selected === i) {
      console.log(`-> ${i + 1}: ${songName}`);
    } else {
      console.log(`   ${i + 1}: ${songName}`);
    }
  }

  console.log("\n⬆️⬇️ Use arrow keys to select");
  console.log("↵ Press Enter to play");
  console.log("P Press P to pause");
  console.log("R Press R to resume");
  console.log("Q Press Q to quit");
}

showSongs();