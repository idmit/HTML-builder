const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) return console.error(err.message);
});

fs.readdir(path.join(__dirname, 'files'), (err, sourseFiles) => {
  if (err) return console.error(err.message);

  fs.readdir(path.join(__dirname, 'files-copy'), (err, destFiles) => {
    if (err) return console.err(err.message);
    compareAndDeleteFiles(destFiles, sourseFiles);
  });

  sourseFiles.forEach((file) => {
    fs.copyFile(
      path.join(__dirname, 'files', file),
      path.join(__dirname, 'files-copy', file),
      (err) => {
        if (err) return console.error(err);
      },
    );
  });
});

function compareAndDeleteFiles(destFiles, sourseFiles) {
  const filteredFiles = destFiles.filter((file) => !sourseFiles.includes(file));
  filteredFiles.forEach((file) => {
    fs.unlink(path.join(__dirname, 'files-copy', file), (err) => {
      if (err) return console.error(err.message);
    });
  });
};