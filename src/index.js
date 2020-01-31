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
      name: 'wasAdded',
      check: (key) => _.has(afterObject, key) && !_.has(beforeObject, key),
      getValue: (key) => afterObject[key],
      getNewValue: () => '',
      getChildren: () => [],
    },
    {
      name: 'wasDeleted',
      check: (key) => _.has(beforeObject, key) && !_.has(afterObject, key),
      getValue: (key) => beforeObject[key],
      getNewValue: () => '',
      getChildren: () => [],
    },
    {
      name: 'hasChildren',
      check: (key) => (beforeObject[key] instanceof Object && afterObject[key] instanceof Object),
      getValue: (key) => beforeObject[key],
      getNewValue: (key) => afterObject[key],
      getChildren: (key) => getAST(beforeObject[key], afterObject[key]),
    },
    {
      name: 'wasChanged',
      check: (key) => beforeObject[key] !== afterObject[key],
      getValue: (key) => beforeObject[key],
      getNewValue: (key) => afterObject[key],
      getChildren: () => [],
    },
    {
      name: 'notChanged',
      check: (key) => beforeObject[key] === afterObject[key],
      getValue: (key) => beforeObject[key],
      getNewValue: () => '',
      getChildren: () => [],
    },
  ];

  return keys.reduce((acc, key) => {
    const action = actions.find((item) => item.check(key));

    return [...acc, {
      action: action.name,
      key,
      value: action.getValue(key),
      newValue: action.getNewValue(key),
      children: action.getChildren(key),
    }];
  }, []);
};

const gendiff = (beforeConf, afterConf, format) => {
  const beforeObject = parser(beforeConf);
  const afterObject = parser(afterConf);

  const ast = getAST(beforeObject, afterObject);

  console.log(format);

  const render = getRender(format);

  return render(ast);
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
