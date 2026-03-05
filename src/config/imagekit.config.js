const ImageKit = require("imagekit");

let imagekit;

const getImageKit = () => {
  if (!imagekit) {
    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "test_public",
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "test_private",
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://test.url"
    });
  }
  return imagekit;
};

const uploadFile = async (fileBuffer, originalName) => {
  try {
    const imagekitInstance = getImageKit();

    const result = await imagekitInstance.upload({
      file: fileBuffer.toString("base64"),
      fileName: originalName || `post-${Date.now()}.jpg`,
    });

    return result;

  } catch (error) {
    throw {
      status: 500,
      message: "File upload failed: " + error.message,
      code: "UPLOAD_ERROR"
    };
  }
};

module.exports = uploadFile;