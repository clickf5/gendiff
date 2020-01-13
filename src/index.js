import program from 'commander';
import _ from 'lodash';
import getParser from './parsers';

const parser = getParser();

const gendiff = (beforeConf, afterConf) => {
  const firstJSON = parser(beforeConf);
  const secondJSON = parser(afterConf);

  const noChanged = Object.keys(firstJSON)
    .filter((key) => _.has(secondJSON, key) && firstJSON[key] === secondJSON[key])
    .map((key) => `   ${key}: ${firstJSON[key]}\n`);

  const getFilteredByNoHas = (firstData, secondData) => Object.keys(firstData)
    .filter((key) => !_.has(secondData, key));

  const added = getFilteredByNoHas(secondJSON, firstJSON).map((key) => ` + ${key}: ${secondJSON[key]}\n`);

  const deleted = getFilteredByNoHas(firstJSON, secondJSON).map((key) => ` - ${key}: ${firstJSON[key]}\n`);

  const changed = Object.keys(firstJSON)
    .reduce((acc, key) => {
      if (_.has(secondJSON, key) && firstJSON[key] !== secondJSON[key]) acc.push(` + ${key}: ${secondJSON[key]}\n`, ` - ${key}: ${firstJSON[key]}\n`);
      return acc;
    }, []);

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
