import path from 'path';
import fs from 'fs';
import getParser from '../src/parsers';

describe('parsers', () => {
  const after = path.resolve(`${__dirname}/../__fixtures__/after.json`);
  const afterJSON = JSON.parse(fs.readFileSync(after));

  test('json', () => {
    expect(getParser()(after)).toEqual(afterJSON);
  });
});
