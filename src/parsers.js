import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

const parsers = {
  json: JSON.parse,
  yml: yaml.safeLoad,
};

export default () => (filepath) => {
  const data = fs.readFileSync(filepath);
  const type = path.extname(filepath).slice(1);
  return parsers[type](data);
};
