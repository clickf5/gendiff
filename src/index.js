import getParser from './parsers';
import getRender from './formaters';
import getAST from './buildAst';

const gendiff = (beforeConf, afterConf, format) => {
  const parser = getParser();
  const beforeObject = parser(beforeConf);
  const afterObject = parser(afterConf);

  const ast = getAST(beforeObject, afterObject);

  const render = getRender();
  return render(ast, format);
};

export default gendiff;
