const fs = require('fs').promises;
const path = require('path');

const templatePath = path.join(__dirname, 'template.html');
const projectDirPath = path.join(__dirname, 'project-dist');
const componentsPath = path.join(__dirname, 'components');

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
    await readAndBundleHtml(componentsPath);
    await readAndBundleCss();
  } catch (error) {
    console.error(error);
  }
};

createDirAndFiles();

const readAndBundleHtml = async (componentsPath) => {
  try {
    const readTemplate = await fs.readFile(
      templatePath,
      { encoding: 'utf-8' },
      (err) => {
        if (err) return console.error(err);
      },
    );

    const components = await fs.readdir(path.join(componentsPath));
    const componentsContent = await Promise.all(
      components.map(async (component) => {
        if (path.extname(component) === '.html') {
          const content = await fs.readFile(
            path.join(componentsPath, component),
            { encoding: 'utf-8' },
          );
          const componentName = path.parse(component).name;
          const placeholder = `{{${componentName}}}`;
          return { placeholder, content };
        }
      }),
    );
    let replaced = readTemplate;
    componentsContent.filter(Boolean).forEach(({ placeholder, content }) => {
      replaced = replaced.replace(placeholder, content);
    });
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
