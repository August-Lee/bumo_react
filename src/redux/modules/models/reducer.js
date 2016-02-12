import lodash from 'lodash';
const initialState = {
  profile: {},
  painting: {},
  paintingDetail: {},
};

export default function reducer(state = initialState, action) {
  if (action.normalized) {
    const newState = lodash.assign({}, state);
    lodash.forOwn(action.normalized.entities, (items, key)=> {
      newState[key] = lodash.assign({}, newState[key], items);
    });
    return newState;
  }
  return state;
}
