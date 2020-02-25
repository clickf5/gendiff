import yaml from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';

const typeActions = [
  {
    check: (val) => _.isObject(val),
    action: (val, func) => func(val),
  },
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

const replace = (obj) => {
  const entries = Object.entries(obj);
  return entries.reduce((acc, [key, val]) => {
    const { action } = typeActions.find((item) => item.check(val));
    return { ...acc, [key]: action(val, replace) };
  }, {});
};

const parsers = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  ini: (data) => replace(ini.parse(data)),
};

export default (data, type) => parsers[type](data);
