const fs = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
var readline = require("readline");
const getCmdArgs = () => process.argv.slice(2);
const input = getCmdArgs()[0];
const output = getCmdArgs()[1];

// This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
const speechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription("2584f84c71714df4be0761c094ed770b", "eastus");
speechTranslationConfig.speechRecognitionLanguage = "en-US";

var language = "es";
speechTranslationConfig.addTargetLanguage(language);


function tts(text, outputFile) {

    "use strict";

    var sdk = require("microsoft-cognitiveservices-speech-sdk");

    var audioFile = outputFile;
    // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    const speechConfig = sdk.SpeechConfig.fromSubscription("2584f84c71714df4be0761c094ed770b", "eastus");
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

    var speechSynthesisVoiceName  = "es-MX-JorgeNeural";  
    var ssml = `<speak version='1.0' xml:lang='es-MX' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts'> \r\n \
        <voice name='${speechSynthesisVoiceName}'> \r\n \
            <mstts:viseme type='redlips_front'/> \r\n \
            '${text}' \r\n \
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
};

function fromFile(inputAudio, outputAudio) {
    let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(inputAudio));
    let translationRecognizer = new sdk.TranslationRecognizer(speechTranslationConfig, audioConfig);

    var translated = "";
    translationRecognizer.recognizeOnceAsync(result => {
        switch (result.reason) {
            case sdk.ResultReason.TranslatedSpeech:
                console.log(`RECOGNIZED: Text=${result.text}`);
                translated = result.translations.get(language)
                console.log("Translated into [" + language + "]: " + translated);
                tts(translated, outputAudio)
                break;
            case sdk.ResultReason.NoMatch:
                console.log("NOMATCH: Speech could not be recognized.");
                break;
            case sdk.ResultReason.Canceled:
                const cancellation = sdk.CancellationDetails.fromResult(result);
                console.log(`CANCELED: Reason=${cancellation.reason}`);

                if (cancellation.reason == sdk.CancellationReason.Error) {
                    console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                    console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
                    console.log("CANCELED: Did you set the speech resource key and region values?");
                }
                break;
        }
        translationRecognizer.close();
    });
};

fromFile(input, output);