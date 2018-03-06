import { FETCH_USERS } from '../actions';

// user list is contained within an array, so default initial state to be an empty array
export default (state = [], action) => {
  switch (action.type) {
    case FETCH_USERS:
      return action.payload.data;
    default:
      return state;
  }
};
