var Sound = require('node-aplay');

console.log("PLAYING AUDIO");
new Sound('audio/not-translated_translated.wav').play();