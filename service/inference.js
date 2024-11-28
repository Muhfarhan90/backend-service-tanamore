const tf = require("@tensorflow/tfjs-node"); // Import TensorFlow.js
const path = require("path");

// Fungsi untuk memuat model
async function loadModel() {
  try {
    const modelPath = "file://model/model.json";
    const model = await tf.loadLayersModel(modelPath);
    return model;
  } catch (err) {
    console.error("Error loading model:", err);
    throw new Error("Failed to load model");
  }
}

async function makePrediction(model, imageBase64) {
  // Decode base64 image to buffer
  const buffer = Buffer.from(imageBase64, "base64");

  // Use Jimp to read the image and preprocess it
  const image = await Jimp.read(buffer);
  image.resize(256, 256, 3); // Resize image if needed (depending on input size model expects)
  const imageData = new Uint8Array(image.bitmap.data); // Convert to Uint8Array

  // Convert image to tensor and normalize
  const tensor = tf.node.decodeImage(imageData, 3); // Decode image to TensorFlow tensor

  // Normalize the image data if needed (depending on model)
  // const normalizedTensor = tensor.div(tf.scalar(255.0)); // Normalize between 0 and 1

  // Make prediction
  const prediction = await model.predict(normalizedTensor.expandDims(0)); // Add batch dimension
  const predictionArray = prediction.arraySync();

  return predictionArray;
}

module.exports = { loadModel, makePrediction };
