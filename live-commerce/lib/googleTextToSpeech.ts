// Imports the Google Cloud client library
import * as textToSpeech from '@google-cloud/text-to-speech'
import * as fs from 'fs'
import * as util from 'util'

// Creates a client
const client = new textToSpeech.TextToSpeechClient();
async function quickStart() {
  // The text to synthesize
  const text = '요로롱님 요리마법사 1개 구매 이거 넣으면 맛있어지나요?';

  interface AudioEncoding {
    audioEncoding: 'MP3' | undefined | null
  }

  interface Voice {
    languageCode:string;
    ssmlGender : "FEMALE" | "SSML_VOICE_GENDER_UNSPECIFIED" | "MALE" | "NEUTRAL" | null | undefined
  }

  const audioConfig:AudioEncoding = {audioEncoding: 'MP3'}
  const voice:Voice = {languageCode: 'ko-KR', ssmlGender: 'FEMALE'}
  // Construct the request
  const request = {
    input: {text: text},
    // Select the language and SSML voice gender (optional)
    voice: voice, // , ssmlGender: 'NEUTRAL'
    // select the type of audio encoding
    audioConfig: audioConfig,
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  if (response && response.audioContent) {
    await writeFile('output.mp3', response.audioContent, 'binary');
  }
  console.log('Audio content written to file: output.mp3');
}
quickStart();