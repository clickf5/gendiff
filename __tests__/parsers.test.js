import path from 'path';
import fs from 'fs';
import getParser from '../src/parsers';

describe('parsers', () => {
  const afterJSONPath = path.resolve(`${__dirname}/../__fixtures__/after.json`);
  const afterYAMLPath = path.resolve(`${__dirname}/../__fixtures__/after.yml`);
  const afterINIPath = path.resolve(`${__dirname}/../__fixtures__/after.ini`);
  const afterJSON = JSON.parse(fs.readFileSync(afterJSONPath));

  test('json', () => {
    expect(getParser()(afterJSONPath)).toEqual(afterJSON);
  });
  test('yml', () => {
    expect(getParser()(afterYAMLPath)).toEqual(afterJSON);
  });
  test('ini', () => {
    expect(getParser()(afterINIPath)).toEqual(afterJSON);
  });
});
