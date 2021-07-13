// Imports the Google Cloud client library
import * as textToSpeech from '@google-cloud/text-to-speech'
import { PurchaseMessage } from '../@types/data'
import {
  AudioEncoding, Voice
} from '../@types/data';
// Creates a client

async function purchaseMessageTTS(purchaseData:PurchaseMessage) {
  const client = new textToSpeech.TextToSpeechClient();

  // The text to synthesize

  const userId = purchaseData.userId;
  const productName = purchaseData.productName;
  const quantity = purchaseData.purchaseNum;
  const text = purchaseData.text;

  const message:string = `${userId}님 ${productName} ${quantity}개 구매 감사합니다    ${text}`

  const audioConfig:AudioEncoding = {speakingRate:1.3, audioEncoding: 'MP3'}
  const voice:Voice = {languageCode: 'ko-KR', name:'ko-KR-Standard-A', ssmlGender: 'FEMALE'}
  // Construct the request
  const params = {
    input: {text: message},
    // Select the language and SSML voice gender (optional)
    voice: voice, // , ssmlGender: 'NEUTRAL'
    // select the type of audio encoding
    audioConfig: audioConfig,
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(params);
  // Write the binary audio content to a local file
  if (response && response.audioContent) {
    return response.audioContent
  }
}

export default purchaseMessageTTS