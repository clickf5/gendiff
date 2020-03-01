import _ from 'lodash';

const space = 2;
const tab = 4;

const getSpaces = (depth) => ((depth > 1) ? ' '.repeat(space ** depth + space) : ' '.repeat(space));
const getTabs = (depth) => ' '.repeat(tab * depth);

const stringify = (obj, depth) => {
  if (!_.isObject(obj)) return `${obj}`;
  const keys = Object.keys(obj);
  const mapped = keys.map((key) => `${getTabs(depth)}    ${key}: ${stringify(obj[key], depth + 1)}`);
  return ['{', mapped, `${getTabs(depth)}}`].flat().join('\n');
};

const propertyActions = {
  added: (node, stringifyFunc, depth) => `${getSpaces(depth)}+ ${node.key}: ${stringifyFunc(node.value, depth)}`,
  deleted: (node, stringifyFunc, depth) => `${getSpaces(depth)}- ${node.key}: ${stringifyFunc(node.value, depth)}`,
  nested: (node, stringifyFunc, depth, func) => `${getSpaces(depth)}  ${node.key}: ${['{', func(node.children, depth + 1), `${getSpaces(depth)}  }`].join('\n')}`,
  changed: (node, stringifyFunc, depth) => [`${getSpaces(depth)}- ${node.key}: ${stringifyFunc(node.value.before, depth)}`, `${getSpaces(depth)}+ ${node.key}: ${stringifyFunc(node.value.after, depth)}`],
  unchanged: (node, stringifyFunc, depth) => `${getSpaces(depth)}  ${node.key}: ${stringifyFunc(node.value, depth)}`,
};

const renderTree = (ast) => {
  const iter = (tree, depth) => {
    const mapped = tree.map((node) => {
      const action = propertyActions[node.state];
      return action(node, stringify, depth, iter);
    });
    return mapped.flat().join('\n');
  };

  return ['{', iter(ast, 1), '}'].join('\n');
};

export default renderTree;
