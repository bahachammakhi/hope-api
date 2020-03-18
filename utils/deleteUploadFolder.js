const fs = require('fs');

const path = require('path');

const directory = 'uploads/';

const DeleteImagesFromUploadDirecotory = () => {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      // eslint-disable-next-line no-shadow
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    });
  });
};

module.exports = DeleteImagesFromUploadDirecotory;
