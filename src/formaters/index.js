import renderTree from './renderTree';
import renderPlain from './renderPlain';
import renderJSON from './renderJSON';

const formaters = {
  tree: renderTree,
  plain: renderPlain,
  json: renderJSON,
};

export default (format) => formaters[format];
