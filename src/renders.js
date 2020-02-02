const renderJSON = (ast) => {
  const iter = (data, level) => {
    const [first, ...rest] = data;

  };

  return iter(ast, 1);
};


const renders = {
  json: renderJSON,
};

export default (format) => renders[format];
