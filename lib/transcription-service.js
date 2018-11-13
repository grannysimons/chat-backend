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
  transcript(filename){
    console.log('transcript!!!! ', filename);
    // http://localhost:3010/audios/5bea926e2b9afdcc8145585a.wav

    // const fileName = './public/audios/5bea97117d7778ce6030b416.wav';
    const file = fs.readFileSync('./'+filename);
    const audioBytes = file.toString('base64');

    const parameters = {
      "audio": {
        "content": audioBytes,
      },
      "config": {
        "languageCode": "es-ES",
        "encoding": "MULAW",
        "sampleRateHertz": 16000
      }
    };
    // console.log('parameters: ',parameters);
    axios.post('/', parameters)
    .then((transcription) => {
      console.log('transcription ');
    })
    .catch((error) => {
      console.log('error ', error);
    });
  }
}

const transcription = new Transcription();
module.exports = transcription;