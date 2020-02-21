import renderTree from './renderTree';
import renderPlain from './renderPlain';
import renderJSON from './renderJSON';

const formaters = {
  tree: renderTree,
  plain: renderPlain,
  json: renderJSON,
};

export default (data, format) => formaters[format](data);
