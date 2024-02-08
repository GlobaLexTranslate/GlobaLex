/* (function() {

    "use strict";

    var sdk = require("microsoft-cognitiveservices-speech-sdk");
    var readline = require("readline");

    var audioFile = "YourAudioFile.wav";
    // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    const speechConfig = sdk.SpeechTranslationConfig.fromSubscription("9ed108b9c19247aebd7e1ddc56957433", "eastus");
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

    // The language of the voice that speaks.
    speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural"; 

    // Create the speech synthesizer.
    var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question("Enter some text that you want to speak >\n> ", function (text) {
      rl.close();
      // Start the synthesizer and wait for a result.
      synthesizer.speakTextAsync(text,
          function (result) {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("synthesis finished.");
        } else {
          console.error("Speech synthesis canceled, " + result.errorDetails +
              "\nDid you set the speech resource key and region values?");
        }
        synthesizer.close();
        synthesizer = null;
      },
          function (err) {
        console.trace("err - " + err);
        synthesizer.close();
        synthesizer = null;
      });
      console.log("Now synthesizing to: " + audioFile);
    });
}()); */
/* var sdk = require("microsoft-cognitiveservices-speech-sdk");
var readline = require("readline");

function synthesizeSpeech() {
    const speechConfig = sdk.SpeechConfig.fromSubscription("2584f84c71714df4be0761c094ed770b","eastus");

    // Set the output format
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm;

    const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig, null);
    speechSynthesizer.speakTextAsync(
        "I'm excited to try text to speech",
        result => {
            // Interact with the audio ArrayBuffer data
            const audioData = result.audioData;
            console.log(`Audio data byte size: ${audioData.byteLength}.`)

            speechSynthesizer.close();
        },
        error => {
            console.log(error);
            speechSynthesizer.close();
        });
}
synthesizeSpeech(); */

(function() {

    "use strict";

    var sdk = require("microsoft-cognitiveservices-speech-sdk");

    var audioFile = "YourAudioFile.wav";
    // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    const speechConfig = sdk.SpeechConfig.fromSubscription("2584f84c71714df4be0761c094ed770b", "eastus");
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

    var speechSynthesisVoiceName  = "es-MX-JorgeNeural";  
    var ssml = `<speak version='1.0' xml:lang='es-MX' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts'> \r\n \
        <voice name='${speechSynthesisVoiceName}'> \r\n \
            <mstts:viseme type='redlips_front'/> \r\n \
            Un anillo de oro complacerá a la mayoría de las chicas. \r\n \
        </voice> \r\n \
    </speak>`;
    
    // Required for WordBoundary event sentences.
    speechConfig.setProperty(sdk.PropertyId.SpeechServiceResponse_RequestSentenceBoundary, "true");

    // Create the speech speechSynthesizer.
    var speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    speechSynthesizer.bookmarkReached = function (s, e) {
        var str = `BookmarkReached event: \
            \r\n\tAudioOffset: ${(e.audioOffset + 5000) / 10000}ms \
            \r\n\tText: \"${e.text}\".`;
        console.log(str);
    };

    speechSynthesizer.synthesisCanceled = function (s, e) {
        console.log("SynthesisCanceled event");
    };
    
    speechSynthesizer.synthesisCompleted = function (s, e) {
        var str = `SynthesisCompleted event: \
                    \r\n\tAudioData: ${e.result.audioData.byteLength} bytes \
                    \r\n\tAudioDuration: ${e.result.audioDuration}`;
        console.log(str);
    };

    speechSynthesizer.synthesisStarted = function (s, e) {
        console.log("SynthesisStarted event");
    };

    speechSynthesizer.synthesizing = function (s, e) {
        var str = `Synthesizing event: \
            \r\n\tAudioData: ${e.result.audioData.byteLength} bytes`;
        console.log(str);
    };
    
    speechSynthesizer.visemeReceived = function(s, e) {
        var str = `VisemeReceived event: \
            \r\n\tAudioOffset: ${(e.audioOffset + 5000) / 10000}ms \
            \r\n\tVisemeId: ${e.visemeId}`;
        console.log(str);
    };

    speechSynthesizer.wordBoundary = function (s, e) {
        // Word, Punctuation, or Sentence
        var str = `WordBoundary event: \
            \r\n\tBoundaryType: ${e.boundaryType} \
            \r\n\tAudioOffset: ${(e.audioOffset + 5000) / 10000}ms \
            \r\n\tDuration: ${e.duration} \
            \r\n\tText: \"${e.text}\" \
            \r\n\tTextOffset: ${e.textOffset} \
            \r\n\tWordLength: ${e.wordLength}`;
        console.log(str);
    };

    // Synthesize the SSML
    console.log(`SSML to synthesize: \r\n ${ssml}`)
    console.log(`Synthesize to: ${audioFile}`);
    speechSynthesizer.speakSsmlAsync(ssml,
        function (result) {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log("SynthesizingAudioCompleted result");
      } else {
        console.error("Speech synthesis canceled, " + result.errorDetails +
            "\nDid you set the speech resource key and region values?");
      }
      speechSynthesizer.close();
      speechSynthesizer = null;
    },
        function (err) {
      console.trace("err - " + err);
      speechSynthesizer.close();
      speechSynthesizer = null;
    });
}());