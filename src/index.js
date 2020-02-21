import fs from 'fs';
import path from 'path';
import parse from './parsers';
import getRender from './formaters';
import getAST from './buildAst';

const gendiff = (beforeConfPath, afterConfPath, format = 'tree') => {
  const beforeConfData = fs.readFileSync(beforeConfPath, 'UTF-8');
  const afterConfData = fs.readFileSync(afterConfPath, 'UTF-8');
  const beforeConfType = path.extname(beforeConfPath).slice(1);
  const afterConfType = path.extname(afterConfPath).slice(1);
  const beforeObject = parse(beforeConfData, beforeConfType);
  const afterObject = parse(afterConfData, afterConfType);
  const ast = getAST(beforeObject, afterObject);
  const render = getRender();
  return render(ast, format);
};

export default gendiff;
