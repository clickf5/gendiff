import path from 'path';
import fs from 'fs';
import gendiff from '../src';

describe('gendiff', () => {
  const beforeJSONPath = path.resolve(`${__dirname}/../__fixtures__/before.json`);
  const afterJSONPath = path.resolve(`${__dirname}/../__fixtures__/after.json`);

  const beforeYAMLPath = path.resolve(`${__dirname}/../__fixtures__/before.yml`);
  const afterYAMLPath = path.resolve(`${__dirname}/../__fixtures__/after.yml`);

  const beforeINIPath = path.resolve(`${__dirname}/../__fixtures__/before.ini`);
  const afterINIPath = path.resolve(`${__dirname}/../__fixtures__/after.ini`);

  const result = fs.readFileSync(`${__dirname}/../__fixtures__/result.txt`, 'utf8').trim();

  test('json', () => {
    expect(gendiff(beforeJSONPath, afterJSONPath)).toEqual(result);
  });

  test('yaml', () => {
    expect(gendiff(beforeYAMLPath, afterYAMLPath)).toEqual(result);
  });

  test('ini', () => {
    expect(gendiff(beforeINIPath, afterINIPath)).toEqual(result);
  });
});
