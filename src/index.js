import program from 'commander';
import _ from 'lodash';
import getParser from './parsers';
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

const stringify = (value) => ((value instanceof Object)
  ? `{\n${Object.keys(value).map((key) => `${key}: ${value[key]}`).join('\n')}}` : value);

const render = (ast, level = 1) => {
  const signs = {
    wasAdded: '+',
    wasDeleted: '-',
    hasChildren: ' ',
    wasChanged: ' ',
    notChanged: ' ',
  };

  const str = ast.map((current) => {
    const indent = (level === 1) ? ' '.repeat(2) : ' '.repeat(2 * (level + 1));
    const value = (current.action === 'hasChildren')
      ? render(current.children, level + 1) : stringify(current.value);
    const newValue = stringify(current.newValue);
    const sign = signs[current.action];
    const line = (current.action === 'wasChanged')
      ? `${indent}- ${current.key}: ${value}\n${indent}+ ${current.key}: ${newValue}` : `${indent}${sign} ${current.key}: ${value}`;
    return line;
  });

  return `{\n${str.join('\n')}\n}`;
};

const gendiff = (beforeConf, afterConf) => {
  const beforeObject = parser(beforeConf);
  const afterObject = parser(afterConf);

  const ast = getAST(beforeObject, afterObject);

  return render(ast);
};

export const cli = () => {
  program.version(version)
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format', 'json')
    .arguments('<firstConfig> <secondConfig>')
    .action((firstConfig, secondConfig) => {
      console.log(gendiff(firstConfig, secondConfig));
    });

  program.parse(process.argv);
};

export default gendiff;
