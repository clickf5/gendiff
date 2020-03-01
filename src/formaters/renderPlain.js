import _ from 'lodash';

const typeActions = [
  {
    check: (val) => _.isObject(val),
    action: () => '[complex value]',
  },
  {
    check: (val) => _.isBoolean(val),
    action: (val) => `${val}`,
  },
  {
    check: (val) => !_.isNaN(_.toNumber(val)),
    action: (val) => _.toNumber(val),
  },
  {
    check: (val) => _.isNaN(_.toNumber(val)),
    action: (val) => `'${val}'`,
  },
];

const getTypeAction = (val) => typeActions.find((item) => item.check(val));

const stringify = (val) => {
  const { action } = getTypeAction(val);
  return action(val);
};

const propertyActions = {
  added: (node, stringifyFunc) => `Property '${node.key}' was added with value: ${stringifyFunc(node.value)}`,
  deleted: (node) => `Property '${node.key}' was deleted`,
  nested: (node, stringifyFunc, func) => func(node.children, [node.key]),
  changed: (node, stringifyFunc) => `Property '${node.key}' was changed from ${stringifyFunc(node.value.before)} to ${stringifyFunc(node.value.after)}`,
};

const renderPlain = (ast) => {
  const iter = (tree, parents) => {
    const filtered = tree.filter((item) => item.state !== 'unchanged');
    const mapped = filtered.map((node) => {
      const key = [...parents, node.key].join('.');
      const action = propertyActions[node.state];
      return action({ ...node, key }, stringify, iter);
    });
    return mapped.join('\n');
  };

  return iter(ast, []);
};

export default renderPlain;
