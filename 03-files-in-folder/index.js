const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  {
    withFileTypes: true,
  },
  (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
      const filePath = path.join(__dirname, 'secret-folder', `${file.name}`);
      if (file.isFile()) {
        createFileStats(filePath, file);
      }
    });
  },
);

function createFileStats(filePath, file) {
  fs.stat(filePath, (err, stats) => {
    if (err) return console.error(err.message);
    console.log(`${file.name} - ${path.extname(file.name)} - ${stats.size}`);
  });
}
