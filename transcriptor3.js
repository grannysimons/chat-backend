import { BingSpeechClient, VoiceRecognitionResponse } from 'bingspeech-api-client';
 
// audio input in a Buffer
let wav = fs.readFileSync('./public/audios/5be4770926fa1976d3a44b42.wav');
 
// Bing Speech Key (https://www.microsoft.com/cognitive-services/en-us/subscriptions)
let subscriptionKey = 'c2ccccd5a18246bba5ca62cfdab87914';
 
let client = new BingSpeechClient(subscriptionKey);
client.recognize(wav).then(response => console.log(response.results[0].name));