import _ from 'lodash';

const getUniqKeys = (obj1, obj2) => [...Object.keys(obj1), ...Object.keys(obj2)]
  .filter((value, index, array) => array.indexOf(value) === index);

const propertyActions = [
  {
    check: (beforeObject, afterObject, key) => !_.has(beforeObject, key) && _.has(afterObject, key),
    state: 'added',
    action: (beforeObject, afterObject, key) => ({ value: afterObject[key] }),
  },
  {
    check: (beforeObject, afterObject, key) => _.has(beforeObject, key) && !_.has(afterObject, key),
    state: 'deleted',
    action: (beforeObject, afterObject, key) => ({ value: beforeObject[key] }),
  },
  {
    check: (beforeObject, afterObject, key) => (_.isObject(beforeObject[key])
      && _.isObject(afterObject[key])),
    state: 'hasChildren',
    action: (beforeObject, afterObject, key, func) => (
      {
        children: func(beforeObject[key], afterObject[key]),
      }),
  },
  {
    check: (beforeObject, afterObject, key) => beforeObject[key] !== afterObject[key],
    state: 'changed',
    action: (beforeObject, afterObject, key) => (
      {
        value: beforeObject[key],
        newValue: afterObject[key],
      }),
  },
  {
    check: (beforeObject, afterObject, key) => beforeObject[key] === afterObject[key],
    state: 'unchanged',
    action: (beforeObject, afterObject, key) => ({ value: beforeObject[key] }),
  },
];

const getPropertyActions = (beforeObject, afterObject, key) => propertyActions.find((item) => (
  item.check(beforeObject, afterObject, key)
));

const getAST = (beforeObject, afterObject) => {
  const keys = getUniqKeys(beforeObject, afterObject);
  return keys.map((key) => {
    const { state, action } = getPropertyActions(beforeObject, afterObject, key);
    return { state, key, ...action(beforeObject, afterObject, key, getAST) };
  });
};

export default getAST;
