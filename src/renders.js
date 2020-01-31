const renderJSON = (ast) => {
  const signs = {
    wasAdded: '+',
    wasDeleted: '-',
    hasChildren: ' ',
    wasChanged: ' ',
    notChanged: ' ',
  };

  const str = ast.map((current) => {
    console.log(current);
  });
};

const renders = {
  json: renderJSON,
};

export default (format) => renders[format];
