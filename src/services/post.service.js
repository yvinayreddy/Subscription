const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const uploadFile = async (fileBuffer, originalName) => {
  try {
    const result = await imagekit.upload({
      file: fileBuffer.toString("base64"), 
      fileName: originalName || `post-${Date.now()}.jpg`,
    });

    return result;

  } catch (error) {
    console.error("ImageKit upload failed:", error.message);
    throw new Error("File upload failed: " + error.message);
  }
};

module.exports = uploadFile;
