const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const keyword = 'exit';

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), {
  flags: 'a',
  encoding: 'utf-8',
});

stdout.write('Hello! Please enter some words\n');

stdin.on('data', (data, err) => {
  if (err) return console.error(err.message);
  const arrData = data.toString().trim().split(' ');
  if (arrData.includes(keyword)) {
    console.log('Goodbye!');
    output.end();
    exit();
  } else {
    output.write(data);
  }
});

process.on('SIGINT', () => {
  console.log('Goodbye!');
  output.end();
  exit();
});
