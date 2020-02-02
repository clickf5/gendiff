import _ from 'lodash';

const indentStep = 4;

const stringify = (obj, indent) => ((_.isObject(obj))
  ? _.flatten(['{', Object.keys(obj).map((key) => {
    const newIndent = `${indent}    `;
    return `${newIndent}  ${key}: ${stringify(obj[key], newIndent)}`;
  }), `${indent}  }`]).join('\n') : `${obj}`);

const renderTree = (ast, level = 1) => {
  const indentForQoutes = (' ').repeat(level * indentStep - 4);
  const indent = (' ').repeat(level * indentStep - 2);
  const mapped = ast.map((current) => {
    switch (current.state) {
      case 'added':
        return `${indent}+ ${current.key}: ${stringify(current.value, indent)}`;
      case 'deleted':
        return `${indent}- ${current.key}: ${stringify(current.value, indent)}`;
      case 'hasChildren':
        return `${indent}  ${current.key}: ${renderTree(current.children, level + 1)}`;
      case 'changed':
        return [`${indent}- ${current.key}: ${stringify(current.value, indent)}`, `${indent}+ ${current.key}: ${stringify(current.newValue, indent)}`];
      case 'unchanged':
        return `${indent}  ${current.key}: ${stringify(current.value, indent)}`;
      default: throw new Error(`Invalid state '${current.state}'`);
    }
  });

  return _.flatten(['{', ...mapped, `${indentForQoutes}}`]).join('\n');
};

export default renderTree;
