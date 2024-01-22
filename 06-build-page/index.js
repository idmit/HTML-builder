const fs = require('fs').promises;
const path = require('path');

const templatePath = path.join(__dirname, 'template.html');
const headerPath = path.join(__dirname, 'components', 'header.html');
const articlesPath = path.join(__dirname, 'components', 'articles.html');
const footerPath = path.join(__dirname, 'components', 'footer.html');
const projectDirPath = path.join(__dirname, 'project-dist');

const readFiles = async (fileDir, files) => {
  try {
    const promises = files.map(async (file) => {
      const data = await fs.readFile(
        path.join(__dirname, 'assets', fileDir, file),
      );
      await fs.writeFile(
        path.join(projectDirPath, 'assets', fileDir, file),
        data,
      );
    });
    await Promise.all(promises);
  } catch (error) {
    console.error(error);
  }
};

const createDirAndFiles = async () => {
  try {
    await fs.mkdir(path.join(projectDirPath), { recursive: true });
    await fs.mkdir(path.join(projectDirPath, 'assets'), { recursive: true });
    await fs.mkdir(path.join(projectDirPath, 'assets', 'fonts'), {
      recursive: true,
    });
    await fs.mkdir(path.join(projectDirPath, 'assets', 'img'), {
      recursive: true,
    });
    await fs.mkdir(path.join(projectDirPath, 'assets', 'svg'), {
      recursive: true,
    });

    const fonts = await fs.readdir(path.join(__dirname, 'assets', 'fonts'));
    const img = await fs.readdir(path.join(__dirname, 'assets', 'img'));
    const svg = await fs.readdir(path.join(__dirname, 'assets', 'svg'));

    await Promise.all([
      readFiles('fonts', fonts),
      readFiles('img', img),
      readFiles('svg', svg),
    ]);
    await readAndBundleHtml();
    await readAndBundleCss();
  } catch (error) {
    console.error(error);
  }
};

createDirAndFiles();

const readAndBundleHtml = async () => {
  try {
    const readTemplate = await fs.readFile(
      templatePath,
      { encoding: 'utf-8' },
      (err) => {
        if (err) return console.error(err);
      },
    );
    const headerContent = await fs.readFile(
      headerPath,
      { encoding: 'utf-8' },
      (err) => {
        if (err) return console.error(err);
      },
    );
    const articlesContent = await fs.readFile(
      articlesPath,
      { encoding: 'utf-8' },
      (err) => {
        if (err) return console.error(err);
      },
    );
    const footerContent = await fs.readFile(
      footerPath,
      { encoding: 'utf-8' },
      (err) => {
        if (err) return console.error(err);
      },
    );

    const replaced = readTemplate
      .replace('{{header}}', headerContent)
      .replace('{{articles}}', articlesContent)
      .replace('{{footer}}', footerContent);
    await fs.writeFile(path.join(projectDirPath, 'index.html'), replaced);
  } catch (error) {
    console.error(error);
  }
};

const readAndBundleCss = async () => {
  const filesCss = await fs.readdir(path.join(__dirname, 'styles'));
  await bundleCss(filesCss);
};

const bundleCss = async (files) => {
  const stylesData = [];
  const filePromises = files.map(async (file) => {
    const data = await fs.readFile(path.join(__dirname, 'styles', file), {
      encoding: 'utf-8',
    });
    stylesData.push(data);
  });
  await Promise.all(filePromises);
  await fs.writeFile(
    path.join(projectDirPath, 'style.css'),
    stylesData.join(''),
    { encoding: 'utf-8' },
  );
};
