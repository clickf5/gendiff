import renderTree from './renderTree';
import renderPlain from './renderPlain';

const formaters = {
  tree: renderTree,
  plain: renderPlain,
};

export default (format) => formaters[format];
