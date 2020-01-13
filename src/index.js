import program from 'commander';
import _ from 'lodash';
import getParser from './parsers';

const parser = getParser();

const gendiff = (beforeConf, afterConf) => {
  const beforeJSON = parser(beforeConf);
  const afterJSON = parser(afterConf);

  const root = {
    changed: ' ',
    key: '',
    value: '',
  };

  const noChanged = Object.keys(beforeJSON)
    .filter((key) => _.has(afterJSON, key) && beforeJSON[key] === afterJSON[key])
    .map((key) => ({ ...root, key, value: beforeJSON[key] }));

  const getFilteredByNoHas = (firstData, secondData) => Object.keys(firstData)
    .filter((key) => !_.has(secondData, key));

  const added = getFilteredByNoHas(afterJSON, beforeJSON).map((key) => ({
    changed: '+',
    key,
    value: afterJSON[key],
  }));

  const deleted = getFilteredByNoHas(beforeJSON, afterJSON).map((key) => ({
    changed: '-',
    key,
    value: beforeJSON[key],
  }));

  const changed = Object.keys(beforeJSON)
    .reduce((acc, key) => {
      if (_.has(afterJSON, key) && beforeJSON[key] !== afterJSON[key]) {
        acc.push({
          changed: '+',
          key,
          value: afterJSON[key],
        }, {
          changed: '-',
          key,
          value: beforeJSON[key],
        });
      }
      return acc;
    }, []);

  const result = [
    ...noChanged,
    ...added,
    ...deleted,
    ...changed,
  ];

  const str = result.reduce((acc, current) => {
    const line = ` ${current.changed} ${current.key}: ${current.value}\n`;
    return `${acc}${line}`;
  }, '');

  return `{\n${str}}`;
};

export const cli = () => {
  program.version('0.1.0')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format')
    .arguments('<firstConfig> <secondConfig>')
    .action((firstConfig, secondConfig) => {
      console.log(gendiff(firstConfig, secondConfig));
    });

  program.parse(process.argv);
};

export default gendiff;
