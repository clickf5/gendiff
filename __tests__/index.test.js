import path from 'path';
import fs from 'fs';
import gendiff from '../src';

test('gendiff', () => {
  const beforePath = path.resolve(`${__dirname}/../__fixtures__/before.json`);
  const afterPath = path.resolve(`${__dirname}/../__fixtures__/after.json`);

  const result = fs.readFileSync(`${__dirname}/../__fixtures__/result.txt`, 'utf8').trim();

  expect(gendiff(beforePath, afterPath)).toEqual(result);
});
