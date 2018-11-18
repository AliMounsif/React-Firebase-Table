
import { FETCH_PEOPLE } from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_PEOPLE:
      return action.payload;
    default:
      return state;
  }
};