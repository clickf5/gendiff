import program from 'commander';
import getParser from './parsers';
import getRender from './formaters';
import getAST from './buildAst';
import { version } from '../package.json';

const parser = getParser();

const gendiff = (beforeConf, afterConf, format) => {
  const beforeObject = parser(beforeConf);
  const afterObject = parser(afterConf);

  const ast = getAST(beforeObject, afterObject);

  const render = getRender(format);

  return render(ast);
};

export const cli = () => {
  let first = '';
  let second = '';
  program.version(version)
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format', 'tree')
    .arguments('<firstConfig> <secondConfig>')
    .action((firstConfig, secondConfig) => {
      first = firstConfig;
      second = secondConfig;
    });

  program.parse(process.argv);
  console.log(gendiff(first, second, program.format));
};

export default gendiff;
