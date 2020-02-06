import _ from 'lodash';

const typeActions = [
  {
    check: (val) => _.isBoolean(val),
    action: (val) => val,
  },
  {
    check: (val) => !_.isNaN(_.toNumber(val)),
    action: (val) => _.toNumber(val),
  },
  {
    check: (val) => _.isNaN(_.toNumber(val)),
    action: (val) => val,
  },
];

const replacer = (key, val) => {
  const { action } = typeActions.find((item) => item.check(val));
  return action(val);
};

export default (ast) => JSON.stringify(ast, replacer);
