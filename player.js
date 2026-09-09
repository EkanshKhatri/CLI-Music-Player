import audio from "audio";
import fs from "fs";

const path = "./songs";

const songs = fs
  .readdirSync(path)
  .filter((el) => el.endsWith(".mp3"));

let selected = 0;
let currentSong = null;
let progressTimer = null;