const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const AppError = require('./appError');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
const uniqueFilename = new Date().toISOString();
const uploadCloud = (file, filename, collection) => {
  return new Promise(resolve => {
    cloudinary.uploader.upload(
      file,
      {
        public_id: `${collection}/${uniqueFilename}${filename}`,
        tags: `stones`
      }, // directory and tags are optional
      (err, image) => {
        if (err) {
          console.log('err', err);
          return null;
        }
        console.log('file uploaded to Cloudinary');
        // remove file from server
        fs.unlinkSync(file);
        // return image details
        resolve(image);
      }
    );
  });
};
module.exports = uploadCloud;
