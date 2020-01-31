import path from 'path';
import fs from 'fs';
import gendiff from '../src';

const extensions = ['json'];

test.each(extensions)('%s gendiff', (extension) => {
  const beforeFilePath = path.resolve(`${__dirname}/../__fixtures__/before.${extension}`);
  const afterFilePath = path.resolve(`${__dirname}/../__fixtures__/after.${extension}`);
  const result = fs.readFileSync(`${__dirname}/../__fixtures__/result.txt`, 'utf8').trim();

  expect(gendiff(beforeFilePath, afterFilePath, 'json')).toEqual(result);
});
