// Imports the Google Cloud client library
import * as textToSpeech from '@google-cloud/text-to-speech';
import { AudioEncoding, Voice } from '../@types/data';

// Creates a client

async function streamStartNotification() {
  const privateKey = process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';
  const options = {
    credentials: {
      private_key: privateKey,
      client_email: process.env.GOOGLE_CREDENTIALS_EMAIL,
    },
  };
  const client = new textToSpeech.TextToSpeechClient(options);

  // The text to synthesize
  // 추후 선택기능 넣을 예정
  const message = `
  <speak>
    잠시 후, 유은님의 양품떡볶이 라이브 커머스가 시작됩니다.
  </speak>
  `;

  const audioConfig: AudioEncoding = { speakingRate: 1.0, audioEncoding: 'MP3' };
  const voice: Voice = { languageCode: 'ko-KR', name: 'ko-KR-Wavenet-A', ssmlGender: 'FEMALE' };
  // Construct the request
  const params = {
    input: { ssml: message },
    // Select the language and SSML voice gender (optional)
    voice, // , ssmlGender: 'NEUTRAL'
    // select the type of audio encoding
    audioConfig,
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(params);
  // Write the binary audio content to a local file
  if (response && response.audioContent) {
    return response.audioContent;
  }
}

export default streamStartNotification;
