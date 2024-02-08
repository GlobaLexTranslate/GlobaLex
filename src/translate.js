const fs = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
var readline = require("readline");

// This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
const speechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription("2584f84c71714df4be0761c094ed770b", "eastus");
speechTranslationConfig.speechRecognitionLanguage = "en-US";

var language = "es";
speechTranslationConfig.addTargetLanguage(language);


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

    // const speechConfig = sdk.SpeechConfig.fromSubscription("2584f84c71714df4be0761c094ed770b", "eastus");
    // const audioConfigOutput = sdk.AudioConfig.fromAudioFileOutput(outputAudio);

    // // The language of the voice that speaks.
    // speechConfig.speechSynthesisVoiceName = "en-MX"; 
    
    // // Create the speech synthesizer.
    // var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfigOutput);
    
    // var rl = readline.createInterface({
    //     input: process.stdin,
    //     output: process.stdout
    // });
    
    // rl.question(translated, function (text) {
    //     rl.close();
    //     // Start the synthesizer and wait for a result.
    //     synthesizer.speakTextAsync(text,
    //         function (result) {
    //     if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
    //         console.log("synthesis finished.");
    //     } else {
    //         console.error("Speech synthesis canceled, " + result.errorDetails +
    //             "\nDid you set the speech resource key and region values?");
    //     }
    //     synthesizer.close();
    //     synthesizer = null;
    //     },
    //         function (err) {
    //     console.trace("err - " + err);
    //     synthesizer.close();
    //     synthesizer = null;
    //     });
    //     console.log("Now synthesizing to: " + outputAudio);
    // });
}

fromFile("audio/the-gettysburg-address.wav", "audio/OSR_us_000_0034_8k_TRANSLATED.wav");