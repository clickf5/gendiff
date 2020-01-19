import program from 'commander';
import _ from 'lodash';
import getParser from './parsers';
import { version } from '../package.json';

const parser = getParser();

const getAST = (beforeObject, afterObject) => {
  const keys = [...Object.keys(beforeObject), ...Object.keys(afterObject)]
    .filter((value, index, array) => array.indexOf(value) === index);
  // console.log(keys);

  const actions = [
    {
      name: 'wasAdded',
      check: (key) => _.has(afterObject, key) && !_.has(beforeObject, key),
    },
    {
      name: 'wasDeleted',
      check: (key) => _.has(beforeObject, key) && !_.has(afterObject, key),
    },
    {
      name: 'wasChanged',
      check: (key) => beforeObject[key] !== afterObject[key],
    },
    {
      name: 'notChanged',
      check: (key) => beforeObject[key] === afterObject[key],
    },
  ];

  return keys.reduce((acc, key) => {
    const action = actions.find((item) => item.check(key));
    const value = beforeObject[key] || afterObject[key];
    const newValue = (action.name === 'wasChanged') ? afterObject[key] : '';

    return [...acc, {
      action: action.name, key, value, newValue,
    }];
  }, []);
  // console.log(ast);
};

const gendiff = (beforeConf, afterConf) => {
  const beforeObject = parser(beforeConf);
  const afterObject = parser(afterConf);

  const ast = getAST(beforeObject, afterObject);

  const signs = {
    wasAdded: '+',
    wasDeleted: '-',
    wasChanged: ' ',
    notChanged: ' ',
  };

  const str = ast.reduce((acc, current) => {
    const line = (current.action === 'wasChanged') ? [`${' '.repeat(2)}- ${current.key}: ${current.value}`, `${' '.repeat(2)}+ ${current.key}: ${current.newValue}`] : [`${' '.repeat(2)}${signs[current.action]} ${current.key}: ${current.value}`];
    return [...acc, ...line];
  }, []);
  // console.log(str);

  return ['{', ...str, '}'].join('\n');
};

export const cli = () => {
  program.version(version)
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format')
    .arguments('<firstConfig> <secondConfig>')
    .action((firstConfig, secondConfig) => {
      console.log(gendiff(firstConfig, secondConfig));
    });

  program.parse(process.argv);
};

export default gendiff;
