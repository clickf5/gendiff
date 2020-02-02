import path from 'path';
import fs from 'fs';
import gendiff from '../src';

const extensions = ['json', 'yml', 'ini'];

describe.each(extensions)('%s gendiff', (extension) => {
  const beforeFilePath = path.resolve(`${__dirname}/../__fixtures__/before.${extension}`);
  const afterFilePath = path.resolve(`${__dirname}/../__fixtures__/after.${extension}`);
  const resultTree = fs.readFileSync(`${__dirname}/../__fixtures__/result.txt`, 'utf8').trim();
  const resultPlain = fs.readFileSync(`${__dirname}/../__fixtures__/result_plain.txt`, 'utf8').trim();

  test('tree', () => {
    expect(gendiff(beforeFilePath, afterFilePath, 'tree')).toEqual(resultTree);
  });

  test('plain', () => {
    expect(gendiff(beforeFilePath, afterFilePath, 'plain')).toEqual(resultPlain);
  });
});
