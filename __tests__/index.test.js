import path from 'path';
import gendiff from '../src';

test('gendiff', () => {
  const beforePath = path.resolve('__tests__/tmp/before.json');
  const afterPath = path.resolve('__tests__/tmp/after.json');

  const result = '{\n'
    + '    name: \'Eugene\'\n'
    + '  + age: 15\n'
    + '  - age: 10\n'
    + '  + sex: \'male\'\n'
    + '}';

  expect(gendiff(beforePath, afterPath)).toEqual(result);
});
