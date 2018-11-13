const axios = require('axios');
const fs = require('fs');

class Transcription {
  constructor(){
    console.log(process.env.transcriptURL + '?key=' + process.env.transcriptKey);
    this.transcriptor = axios.create({
      baseURL: process.env.transcriptURL + '?key=' + process.env.transcriptKey,
      // withCredentials: true
    });
  }

  // transcript(audioFile){
  transcript(){
    console.log('transcript!!!!');
    // http://localhost:3010/audios/5bea926e2b9afdcc8145585a.wav

    const fileName = './public/audios/5bea97117d7778ce6030b416.wav';
    console.log('1');
    const file = fs.readFileSync(fileName);
    console.log('2');
    const audioBytes = file.toString('base64');
    console.log('3');

    axios.post('/', {
      "audio": {
        "content": audioBytes,
      },
      "config": {
        "languageCode": "es",
        "encoding": "MULAW",
        "sampleRateHertz": 16000
      }
    })
    .then((transcription) => {
      console.log('transcription: ', transcription);
    })
    .catch((error) => {
      console.log('error: ', error.message);
    });
  }
}

const transcription = new Transcription();
module.exports = transcription;