import path from 'path';
import fs from 'fs';
import gendiff from '../src';

const extensions = ['json', 'yml', 'ini'];
const outputs = ['tree', 'plain', 'json'];

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf8');

describe.each(extensions)('input files extension: .%s', (extension) => {
  const beforeFilePath = getFixturePath(`before.${extension}`);
  const afterFilePath = getFixturePath(`after.${extension}`);

  test.each(outputs)('output format: %s', (output) => {
    const result = readFile(`result_${output}.txt`).trim();
    expect(gendiff(beforeFilePath, afterFilePath, output)).toEqual(result);
  });
});
