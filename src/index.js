import program from 'commander';
import _ from 'lodash';
import getParser from './parsers';
import getRender from './renders';
import { version } from '../package.json';

const parser = getParser();

const getUniqKeys = (obj1, obj2) => [...Object.keys(obj1), ...Object.keys(obj2)]
  .filter((value, index, array) => array.indexOf(value) === index);

const getAST = (beforeObject, afterObject) => {
  const keys = getUniqKeys(beforeObject, afterObject);

  const actions = [
    {
      check: (key) => _.has(afterObject, key) && !_.has(beforeObject, key),
      action: (key) => ({ name: 'wasAdded', key, value: afterObject[key] }),
    },
    {
      check: (key) => _.has(beforeObject, key) && !_.has(afterObject, key),
      action: (key) => ({ name: 'wasDeleted', key, value: beforeObject[key] }),
    },
    {
      check: (key) => (beforeObject[key] instanceof Object && afterObject[key] instanceof Object),
      action: (key) => ({ name: 'hasChildren', key, children: getAST(beforeObject[key], afterObject[key]) }),
    },
    {
      check: (key) => beforeObject[key] !== afterObject[key],
      action: (key) => ({ name: 'wasChanged', key, value: beforeObject[key], newValue: afterObject[key] }),
    },
    {
      check: (key) => beforeObject[key] === afterObject[key],
      action: (key) => ({ name: 'notChanged', key, value: beforeObject[key] }),
    },
  ];

  return keys.reduce((acc, key) => {
    const ast = actions.find((item) => item.check(key)).action;
    return [...acc, ast(key)];
  }, []);
};

const gendiff = (beforeConf, afterConf, format) => {
  const beforeObject = parser(beforeConf);
  const afterObject = parser(afterConf);

  const ast = getAST(beforeObject, afterObject);

  return getRender(format)(ast);
};

export const cli = () => {
  let first;
  let second;
  program.version(version)
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format', 'json')
    .arguments('<firstConfig> <secondConfig>')
    .action((firstConfig, secondConfig) => {
      first = firstConfig;
      second = secondConfig;
    });

  program.parse(process.argv);
  console.log(gendiff(first, second, program.format));
};

export default gendiff;
