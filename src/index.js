import fs from 'fs';
import path from 'path';
import getParser from './parsers';
import getRender from './formaters';
import getAST from './buildAst';

const gendiff = (beforeConfPath, afterConfPath, format) => {
  const parser = getParser();
  const beforeConfData = fs.readFileSync(beforeConfPath, 'UTF-8');
  const afterConfData = fs.readFileSync(afterConfPath, 'UTF-8');
  const beforeConfType = path.extname(beforeConfPath).slice(1);
  const afterConfType = path.extname(afterConfPath).slice(1);
  const beforeObject = parser(beforeConfData, beforeConfType);
  const afterObject = parser(afterConfData, afterConfType);
  const ast = getAST(beforeObject, afterObject);
  const render = getRender();
  return render(ast, format);
};

export default gendiff;
