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

  return ['{', iter(ast, 1), '}'].join('\n');
};

export default renderTree;
