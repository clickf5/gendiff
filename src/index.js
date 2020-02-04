import getParser from './parsers';
import getRender from './formaters';
import getAST from './buildAst';

const parser = getParser();

const gendiff = (beforeConf, afterConf, format) => {
  const beforeObject = parser(beforeConf);
  const afterObject = parser(afterConf);

  const ast = getAST(beforeObject, afterObject);

  const render = getRender(format);

  return render(ast);
};

export default gendiff;
