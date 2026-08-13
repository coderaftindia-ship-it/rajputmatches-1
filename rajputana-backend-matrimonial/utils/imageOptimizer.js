const { Jimp } = require("jimp");
const fs = require("fs");

/**
 * Optimizes an uploaded image file on disk in-place or resizes it.
 * @param {string} filePath - Absolute path to the file
 * @param {object} options - { maxWidth, quality }
 */
async function optimizeImage(filePath, options = {}) {
  try {
    if (!fs.existsSync(filePath)) return;
    const maxWidth = options.maxWidth || 1200;
    const quality = options.quality || 80;

    const image = await Jimp.read(filePath);
    if (image.width > maxWidth) {
      image.resize({ w: maxWidth });
    }
    await image.write(filePath);
  } catch (err) {
    console.error("Image optimization skipped:", err.message);
  }
}

module.exports = { optimizeImage };
