import program from 'commander';
import path from 'path';
import fs from 'fs';

const gendiff = (firstConfig, secondConfig) => {
  const pathToFirstConfig = path.resolve(firstConfig);
  const pathToSecondConfig = path.resolve(secondConfig);

  const firstJSON = JSON.parse(fs.readFileSync(pathToFirstConfig));
  const secondJSON = JSON.parse(fs.readFileSync(pathToSecondConfig));

  return `${pathToFirstConfig} -- ${pathToSecondConfig}`;
};

export const cli = () => {
  program.version('0.1.0')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format')
    .arguments('<firstConfig> <secondConfig>')
    .action((firstConfig, secondConfig) => {
      gendiff(firstConfig, secondConfig);
    });

  program.parse(process.argv);
};

export default gendiff;
