export const deleteFolderRecursive = inputPath => {
  const fs = require('fs');
  const path = require('path');

  if (fs.existsSync(inputPath)) {
    fs.readdirSync(inputPath).forEach((file, index) => {
      const curPath = path.join(inputPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(inputPath);
  }
};
