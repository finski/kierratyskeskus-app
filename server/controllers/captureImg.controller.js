const nodeWebcam = require('node-webcam');
const vision = require('@google-cloud/vision');
const { googleKey } = require('../config/index');

const client = new vision.ImageAnnotatorClient({
  keyFilename: googleKey,
});

const imageCapture = (res) => {
  // to take picture from external web cam add name of device  as parameter to nodeWebcam.create({})
  const anotherCam = nodeWebcam.create();
  const image = `${__dirname}/images/image.jpg`;

  anotherCam.capture(image, () => {
    const collection = { labels: [], text: [] };
    client
      .labelDetection(image)
      .then((results) => {
        const labelsArray = [];
        const labels = results[0].labelAnnotations;
        labels.map(label => labelsArray.push(label.description));
        collection.labels = labelsArray;
        client
          .textDetection(image)
          .then((textResults) => {
            const textArray = [];
            const detections = textResults[0].textAnnotations;
            detections.map((text) => {
              textArray.push(text.description);
              return null;
            });
            collection.text = textArray;
            res.send(collection);
            return collection;
          })
          .catch((err) => {
            res.send(err);
            console.error('ERROR:', err);
          });
      });
  });
};

module.exports = imageCapture;
