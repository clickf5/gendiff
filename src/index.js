import program from 'commander';
import _ from 'lodash';
import getParser from './parsers';

const parser = getParser();

const gendiff = (beforeConf, afterConf) => {
  const beforeJSON = parser(beforeConf);
  const afterJSON = parser(afterConf);

  const beforeData = _.toPairs(beforeJSON);
  const afterData = _.toPairs(afterJSON);

  const root = {
    changed: '',
    key: '',
    value: '',
  };

  // const noChanged = Object.keys(beforeJSON)
  //   .filter((key) => _.has(afterJSON, key) && beforeJSON[key] === afterJSON[key])
  //   .map((key) => `   ${key}: ${beforeJSON[key]}\n`);
  //
  // const getFilteredByNoHas = (firstData, secondData) => Object.keys(firstData)
  //   .filter((key) => !_.has(secondData, key));
  //
  // const added = getFilteredByNoHas(afterJSON, beforeJSON).map((key) => ` + ${key}: ${afterJSON[key]}\n`);
  //
  // const deleted = getFilteredByNoHas(beforeJSON, afterJSON).map((key) => ` - ${key}: ${beforeJSON[key]}\n`);
  //
  // const changed = Object.keys(beforeJSON)
  //   .reduce((acc, key) => {
  //     if (_.has(afterJSON, key) && beforeJSON[key] !== afterJSON[key]) acc.push(` + ${key}: ${afterJSON[key]}\n`, ` - ${key}: ${beforeJSON[key]}\n`);
  //     return acc;
  //   }, []);

  const result = [
    ...noChanged,
    ...added,
    ...deleted,
    ...changed,
  ];

  result.unshift('{\n');
  result.push('}');

  return result.reduce((acc, current) => (`${acc}${current}`), '');
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
