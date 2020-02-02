import _ from 'lodash';

const isCompexValue = (val) => ((_.isObject(val)) ? '[complex value]' : val);

const renderPlain = (ast, parents = '') => {
  const mapped = ast.map((current) => {
    const propertyName = (parents === '') ? current.key : `${parents}.${current.key}`;
    switch (current.state) {
      case 'added':
        return `Property '${propertyName}' was added with value ${isCompexValue(current.value)}`;
      case 'deleted':
        return `Property '${propertyName}' was deleted`;
      case 'hasChildren':
        return renderPlain(current.children, current.key);
      case 'changed':
        return `Property '${propertyName}' was changed from ${current.value} to ${current.newValue}`;
      case 'unchanged':
        return '';
      default:
        throw new Error(`Invalid state '${current.state}'`);
    }
  });

  return mapped.filter((item) => item !== '').join('/n');
};

export default renderPlain;
