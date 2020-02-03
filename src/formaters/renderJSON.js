import _ from 'lodash';

export default (ast) => JSON.stringify(ast, (key, val) => ((!_.isNaN(Number(val)))
  ? Number(val) : val));
