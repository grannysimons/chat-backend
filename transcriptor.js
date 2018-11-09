const fs = require('fs');
const axios = require('axios');

// const API_KEY = process.env.GOOGLE_APPLICATION_CREDENTIALS.private_key_id;
const API_KEY = 'AIzaSyBrIi4OeumrvBpyEmI8DLOB2p4G5EtX_Ss';
// const fileName = './audio.raw';
const fileName = './public/audios/5be4770926fa1976d3a44b42.wav';
// console.log('fileName: ', fileName);
// // Reads a local audio file and converts it to base64
// const file = fs.readFileSync(fileName);
// const audioBytes = file.toString('base64');

// Reads a local audio file and converts it to base64
const file = fs.readFileSync(fileName);
const audioBytes = file.toString('base64');

// The audio file's encoding, sample rate in hertz, and BCP-47 language code
const audio = {
  content: audioBytes,
};
const config = {
  encoding: 'LINEAR16',
  sampleRateHertz: 16000,
  languageCode: 'en-US',
};
const request = {
  audio: audio,
  config: config
};

const apiKey = API_KEY;
const url = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`;

axios.request({
  url,
  method: 'POST',
  data: request
})
.then(response => {
  console.log('response: ', response);
  const transcription = response.data.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  console.log(`Transcription: ${transcription}`);
  console.log('ooooook!!!');
})
.catch(err => {
  console.log('err :', err);
  console.log('erroooooor');
});


// // Imports the Google Cloud client library
// // import speechApi from './google-speech-api';
// const speechApi = require('./google-speech-api');
// // const speech = require('@google-cloud/speech');
// const fs = require('fs');

// // Creates a client
// // const client = new speech.SpeechClient();

// // The name of the audio file to transcribe
// // const fileName = './resources/audio.raw';
// const fileName = './public/audios/5be4770926fa1976d3a44b42.wav';
// console.log('fileName: ', fileName);
// // Reads a local audio file and converts it to base64
// const file = fs.readFileSync(fileName);
// const audioBytes = file.toString('base64');

// // The audio file's encoding, sample rate in hertz, and BCP-47 language code
// const audio = {
//   content: audioBytes,
// };
// const config = {
//   encoding: 'LINEAR16',
//   sampleRateHertz: 16000,
//   languageCode: 'ca',
// };
// const request = {
//   audio: audio,
//   config: config,
// };

// speechApi.transcript(audioBytes)
// .then((data) => {
//   console.log('data ', data.response.content);
//   console.log('1');
// })
// .catch(error => {
//   console.log(error.response);
//   console.log('2');
// });
// // Detects speech in the audio file
// // client
// //   .recognize(request)
// //   .then(data => {
// //     console.log(data[0].results);
// //     const response = data[0];
// //     const transcription = response.results
// //       .map(result => result.alternatives[0].transcript)
// //       .join('\n');
// //     console.log(`Transcription: ${transcription}`);
// //   })
// //   .catch(err => {
// //     console.error('ERROR:', err);
// //   });
