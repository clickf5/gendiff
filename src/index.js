import program from 'commander';
import path from 'path';

export const getAbsolutePathToFile = (filePath) => (
  (path.isAbsolute(filePath) ? filePath : path.resolve(filePath))
);

const gendiff = () => 1;

export const cli = () => {
  program.version('0.1.0')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format')
    .arguments('<firstConfig> <secondConfig>')
    .action((firstConfig, secondConfig) => {
      console.log(`${firstConfig} -- ${secondConfig}`);
    });

  program.parse(process.argv);
};

export default gendiff;
