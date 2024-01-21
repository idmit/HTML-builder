const fs = require('fs');
const path = require('path');

const arrData = [];

fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, files) => {
    if (err) return console.error(err.message);
    files.forEach(async (file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        readAndWriteFiles(file);
      }
    });
  },
);

function readAndWriteFiles(file) {
  fs.readFile(path.join(__dirname, 'styles', file.name), (err, data) => {
    if (err) console.error(err.message);
    arrData.push(data);
    fs.writeFile(
      path.join(__dirname, 'project-dist', 'bundle.css'),
      arrData.join(''),
      { encoding: 'utf-8' },
      (err) => {
        if (err) return console.error(err.message);
      },
    );
  });
}
