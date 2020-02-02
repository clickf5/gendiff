import renderTree from './renderTree';

const formaters = {
  tree: renderTree,
};

export default (format) => formaters[format];
