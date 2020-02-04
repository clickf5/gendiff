import _ from 'lodash';

const indentStep = 4;

const stringify = (obj, indent) => ((_.isObject(obj))
  ? _.flatten(['{', Object.keys(obj).map((key) => {
    const newIndent = `${indent}    `;
    return `${newIndent}  ${key}: ${stringify(obj[key], newIndent)}`;
  }), `${indent}  }`]).join('\n') : `${obj}`);

const propertyActions = {
  added: (indent, node) => `${indent}+ ${node.key}: ${stringify(node.value, indent)}`,
  deleted: (indent, node) => `${indent}- ${node.key}: ${stringify(node.value, indent)}`,
  hasChildren: (indent, node, func, level) => `${indent}  ${node.key}: ${func(node.children, level + 1)}`,
  changed: (indent, node) => [`${indent}- ${node.key}: ${stringify(node.value, indent)}`, `${indent}+ ${node.key}: ${stringify(node.newValue, indent)}`],
  unchanged: (indent, node) => `${indent}  ${node.key}: ${stringify(node.value, indent)}`,
};

const renderTree = (ast, level = 1) => {
  const indentForQoutes = (' ').repeat(level * indentStep - indentStep);
  const indent = (' ').repeat(level * indentStep - 2);
  const mapped = ast.map((node) => {
    const action = propertyActions[node.state];
    return action(indent, node, renderTree, level);
  });

  return _.flatten(['{', ...mapped, `${indentForQoutes}}`]).join('\n');
};

export default renderTree;
