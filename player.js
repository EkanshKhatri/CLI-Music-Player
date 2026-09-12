import audio from "audio";
import fs from "fs";

const path = "./songs";

const songs = fs
  .readdirSync(path)
  .filter((el) => el.endsWith(".mp3"));

let selected = 0;
let currentSong = null;
let progressTimer = null;


// Format seconds into 0:00
function formatTime(seconds) {
  seconds = Math.floor(seconds);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}


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


// Show progress bar
function showProgress() {

  if (!currentSong) {
    return;
  }

  const currentTime = currentSong.currentTime;
  const duration = currentSong.duration;

  if (!duration) {
    return;
  }

  const percentage = (currentTime / duration) * 100;

  const barLength = 30;

  const filledLength = Math.floor(
    (percentage / 100) * barLength
  );

  const emptyLength = barLength - filledLength;

  const bar =
    "█".repeat(filledLength) +
    "░".repeat(emptyLength);

  process.stdout.write(
    `\r🎵 ${bar} ${percentage.toFixed(0)}% ` +
    `${formatTime(currentTime)} / ${formatTime(duration)}`
  );
}


// Start progress timer
function startProgress() {

  stopProgress();

  progressTimer = setInterval(() => {
    showProgress();
  }, 250);
}


// Stop progress timer
function stopProgress() {

  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
}


// Stop current song
function stopCurrentSong() {

  stopProgress();

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

  startProgress();
}


// Pause
function pauseSong() {

  if (!currentSong) {
    return;
  }

  currentSong.pause();

  console.log("\n⏸️ Song paused.");
}


// Resume
function resumeSong() {

  if (!currentSong) {
    return;
  }

  currentSong.resume();

  console.log("\n▶️ Song resumed.");
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


  // Pause
  if (input === "p" || input === "P") {

    pauseSong();

    return;
  }


  // Resume
  if (input === "r" || input === "R") {

    resumeSong();

    return;
  }
});