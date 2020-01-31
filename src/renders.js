const stringify = (value) => ((value instanceof Object)
  ? `{\n${Object.keys(value).map((key) => `${key}: ${value[key]}`).join('\n')}}` : value);

const renderJSON = (ast, level = 1) => {
  const signs = {
    wasAdded: '+',
    wasDeleted: '-',
    hasChildren: ' ',
    wasChanged: ' ',
    notChanged: ' ',
  };

  const str = ast.map((current) => {
    const indent = (level === 1) ? ' '.repeat(2) : ' '.repeat(2 * (level + 1));
    const value = (current.action === 'hasChildren')
      ? renderJSON(current.children, level + 1) : stringify(current.value);
    const newValue = stringify(current.newValue);
    const sign = signs[current.action];
    const line = (current.action === 'wasChanged')
      ? `${indent}- ${current.key}: ${value}\n${indent}+ ${current.key}: ${newValue}` : `${indent}${sign} ${current.key}: ${value}`;
    return line;
  });

  return `{\n${str.join('\n')}\n}`;
};

const renders = {
  json: renderJSON,
};

export default (format) => renders[format];
