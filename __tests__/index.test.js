import path from 'path';
import { getAbsolutePathToFile } from '../src';

test('getAbsoluteFileToPath', () => {
  const filePath1 = '/files/file1.json';
  const filePath2 = '~/files/file2.json';
  expect(getAbsolutePathToFile(filePath1)).toBe(path.resolve(filePath1));
  expect(getAbsolutePathToFile(filePath2)).toBe(path.resolve(filePath2));
});
