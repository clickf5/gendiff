import program from 'commander';

export default () => {
  program.version('0.1.0')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format')
    .arguments('<firstConfig> <secondConfig>')
    .action((firstConfig, secondConfig, option) => {
      console.log(option);
    });

  program.parse(process.argv);
};
