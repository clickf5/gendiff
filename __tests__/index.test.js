import path from 'path';
import fs from 'fs';
import gendiff from '../src';

const extensions = ['json', 'yml', 'ini'];
const outputs = ['tree', 'plain', 'json'];

describe.each(extensions)('%s gendiff', (extension) => {
  const beforeFilePath = path.resolve(`${__dirname}/../__fixtures__/before.${extension}`);
  const afterFilePath = path.resolve(`${__dirname}/../__fixtures__/after.${extension}`);

  test.each(outputs)('%s', (output) => {
    const result = fs.readFileSync(`${__dirname}/../__fixtures__/result_${output}.txt`, 'utf8').trim();
    expect(gendiff(beforeFilePath, afterFilePath, output)).toEqual(result);
  });
});
