const axios = require('axios');

class GoogleSpeechAPI {
  constructor(){
    this.api = axios.create({
      baseURL: 'https://speech.googleapis.com/v1p1beta1',
      withCredentials: true
    });
  }

  transcript(audioFile){
    const params = {
      "audio": {
        "content": audioFile,
      },
      "config": {
        "enableAutomaticPunctuation": true,
        "encoding": "LINEAR16",
        "languageCode": "ca-ES",
        "model": "default"
      }
    }
    return this.api.post('/speech:recognize', { params });
  }
}

const googleSpeechAPI = new GoogleSpeechAPI();

module.exports = googleSpeechAPI;