import _ from 'lodash';

const propertyActions = [
  {
    check: (val) => !_.isNaN(Number(val)),
    action: (val) => Number(val),
  },
  {
    check: (val) => _.isString(val),
    action: (val) => `'${val}'`,
  },
  {
    check: (val) => _.isObject(val),
    action: () => '[complex value]',
  },
];

const getPropertyActions = (val) => propertyActions.find((item) => item.check(val));

const stringify = (val) => getPropertyActions(val).action(val);

const renderPlain = (ast, parents = '') => {
  const filtered = ast.filter((item) => item.state !== 'unchanged');
  const mapped = filtered.map((current) => {
    const propertyName = (parents === '') ? current.key : `${parents}.${current.key}`;
    switch (current.state) {
      case 'added':
        return `Property '${propertyName}' was added with value: ${stringify(current.value)}`;
      case 'deleted':
        return `Property '${propertyName}' was deleted`;
      case 'hasChildren':
        return renderPlain(current.children, propertyName);
      case 'changed':
        return `Property '${propertyName}' was changed from ${stringify(current.value)} to ${stringify(current.newValue)}`;
      default:
        throw new Error(`Invalid state '${current.state}'`);
    }
  });

  return mapped.join('\n');
};

export default renderPlain;
