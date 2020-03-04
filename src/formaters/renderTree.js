import _ from 'lodash';

const space = 2;
const tab = 4;

const getSpaces = (depth) => ((depth > 1) ? ' '.repeat(space ** depth + space) : ' '.repeat(space));
const getTabs = (depth) => ' '.repeat(tab * depth);

const typeActions = [
  {
    check: (val) => _.isObject(val),
    action: (val, stringifyFunc, depth) => {
      const keys = Object.keys(val);
      const mapped = keys.map((key) => `${getTabs(depth)}    ${key}: ${stringifyFunc(val[key], depth + 1)}`);
      return `{\n${mapped.join('\n')}\n${getTabs(depth)}}`;
    },
  },
  {
    check: (val) => !_.isObject(val),
    action: _.identity,
  },
];

const getTypeAction = (val) => typeActions.find((item) => item.check(val));

const stringify = (value, depth) => {
  const { action } = getTypeAction(value);
  return action(value, stringify, depth);
};

const propertyActions = {
  added: (node, depth) => `${getSpaces(depth)}+ ${node.key}: ${stringify(node.value, depth)}`,
  deleted: (node, depth) => `${getSpaces(depth)}- ${node.key}: ${stringify(node.value, depth)}`,
  nested: (node, depth, func) => `${getSpaces(depth)}  ${node.key}: ${['{', func(node.children, depth + 1), `${getSpaces(depth)}  }`].join('\n')}`,
  changed: (node, depth) => [`${getSpaces(depth)}- ${node.key}: ${stringify(node.value.before, depth)}`, `${getSpaces(depth)}+ ${node.key}: ${stringify(node.value.after, depth)}`],
  unchanged: (node, depth) => `${getSpaces(depth)}  ${node.key}: ${stringify(node.value, depth)}`,
};

const renderTree = (ast) => {
  const iter = (tree, depth) => {
    const mapped = tree.map((node) => {
      const action = propertyActions[node.state];
      return action(node, depth, iter);
    });
    return mapped.flat().join('\n');
  };

  return `{\n${iter(ast, 1)}\n}`;
};

export default renderTree;
