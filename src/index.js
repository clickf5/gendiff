import program from 'commander';
import _ from 'lodash';
import getParser from './parsers';
import { version } from '../package.json';

const parser = getParser();

const gendiff = (beforeConf, afterConf) => {
  const beforeObject = parser(beforeConf);
  const afterObject = parser(afterConf);

  const keys = [...Object.keys(beforeObject), ...Object.keys(afterObject)]
    .filter((value, index, array) => array.indexOf(value) === index);
  console.log(keys);

  const noChanged = Object.keys(beforeObject)
    .filter((key) => _.has(afterObject, key) && beforeObject[key] === afterObject[key])
    .map((key) => ({ changed: ' ', key, value: beforeObject[key] }));

  const getFilteredByNoHas = (firstData, secondData) => Object.keys(firstData)
    .filter((key) => !_.has(secondData, key));

  const added = getFilteredByNoHas(afterObject, beforeObject)
    .map((key) => ({ changed: '+', key, value: afterObject[key] }));

  const deleted = getFilteredByNoHas(beforeObject, afterObject)
    .map((key) => ({ changed: '-', key, value: beforeObject[key] }));

  const changed = Object.keys(beforeObject)
    .reduce((acc, key) => {
      if (_.has(afterObject, key) && beforeObject[key] !== afterObject[key]) {
        acc.push({ changed: '+', key, value: afterObject[key] },
          { changed: '-', key, value: beforeObject[key] });
      }
      return acc;
    }, []);

  const result = [...noChanged, ...added, ...deleted, ...changed];

  const str = result.reduce((acc, current) => {
    const line = ` ${current.changed} ${current.key}: ${current.value}\n`;
    return `${acc}${line}`;
  }, '');

  return `{\n${str}}`;
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
