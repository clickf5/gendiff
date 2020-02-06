import path from 'path';
import fs from 'fs';
import gendiff from '../src';

const extensions = ['json', 'yml', 'ini'];

describe.each(extensions)('%s gendiff', (extension) => {
  const beforeFilePath = path.resolve(`${__dirname}/../__fixtures__/before.${extension}`);
  const afterFilePath = path.resolve(`${__dirname}/../__fixtures__/after.${extension}`);

  test('tree', () => {
    const result = fs.readFileSync(`${__dirname}/../__fixtures__/result_tree.txt`, 'utf8').trim();
    expect(gendiff(beforeFilePath, afterFilePath, 'tree')).toEqual(result);
  });

  test('plain', () => {
    const result = fs.readFileSync(`${__dirname}/../__fixtures__/result_plain.txt`, 'utf8').trim();
    expect(gendiff(beforeFilePath, afterFilePath, 'plain')).toEqual(result);
  });

  test('json', () => {
    const result = fs.readFileSync(`${__dirname}/../__fixtures__/result_json.txt`, 'utf8').trim();
    expect(gendiff(beforeFilePath, afterFilePath, 'json')).toEqual(result);
  });
});
