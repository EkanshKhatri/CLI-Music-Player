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


// Stop current song
function stopCurrentSong() {

  if (currentSong) {
    currentSong.stop();
    currentSong.dispose();

    currentSong = null;
  }
}


// Play selected song
async function playSong(index) {

  // Stop previous song
  stopCurrentSong();

  const file = `./songs/${songs[index]}`;

  console.log(`\n🎵 Loading: ${songs[index]}`);

  currentSong = audio(file);

  await currentSong.ready;

  console.log(`🎵 Playing: ${songs[index]}`);

  currentSong.play();
}


// Display menu
showSongs();

process.stdin.setEncoding("utf-8");
process.stdin.setRawMode(true);
process.stdin.resume();


// Keyboard input
process.stdin.on("data", async (input) => {

  // Up arrow
  if (input === "\x1b[A") {

    if (selected > 0) {
      selected--;
      showSongs();
    }

    return;
  }


  // Down arrow
  if (input === "\x1b[B") {

    if (selected < songs.length - 1) {
      selected++;
      showSongs();
    }

    return;
  }


  // Enter
  if (input === "\r") {

    await playSong(selected);

    return;
  }
});