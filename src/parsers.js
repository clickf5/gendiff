import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';
import path from 'path';

const parsers = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  ini: ini.parse,
};

export default () => (filepath) => {
  const type = path.extname(filepath).slice(1);
  console.log(`type: ${type}`);
  return parsers[type](fs.readFileSync(filepath));
};
