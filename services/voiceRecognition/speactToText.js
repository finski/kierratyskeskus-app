// const auth = require('../config/.env');
const record = require('node-record-lpcm16');
const speech = require('@google-cloud/speech');
const { googleKey } = require('../../server/config/index');

// Creates a client
const client = new speech.SpeechClient({
  keyFilename: googleKey,
});


const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'fi-FI';

const request = {
  config: {
    encoding,
    sampleRateHertz,
    languageCode,
  },
  interimResults: true,
};

// Create a recognize stream
const recognizeStream = client
  .streamingRecognize(request)
  .on('error', console.error)
  .on('data', data => process.stdout.write(
    data.results[0] && data.results[0].alternatives[0]
      ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
      : '\n\nReached transcription time limit, press Ctrl+C\n',
  ));

// Start recording and send the microphone input to the Speech API
record
  .start({
    sampleRateHertz,
    threshold: 0,
    verbose: false,
    recordProgram: 'rec',
    silence: '5.0',
  })
  .on('error', console.error)
  .pipe(recognizeStream);

console.log('Listening, press Ctrl+C to stop.');
