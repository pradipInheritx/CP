import {
GET_USERDETELIS,
ADD_USERDETELIS,
SET_USERDETELIS_DETAILS,
EDIT_USERDETELIS,
DELETE_USERDETELIS,
DELETE_BULK_USERDETELIS,
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  usersDetelisList: [],
  currentUserDetelis: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_USERDETELIS: {
      return {
        ...state,
        usersDetelisList: action.payload,
      };
    }
    case SET_USERDETELIS_DETAILS: {
      return {
        ...state,
        currentUserDetelis: action.payload,
      };
    }
    case ADD_USERDETELIS: {
      return {
        ...state,
        usersDetelisList: [action.payload, ...state.usersDetelisList],
      };
    }
    case EDIT_USERDETELIS: {
      return {
        ...state,
        usersDetelisList: state.usersDetelisList.map(user => (user.id === action.payload.id ? action.payload : user)),
      };
    }
    case DELETE_USERDETELIS: {
      return {
        ...state,
        usersDetelisList: state.usersDetelisList.filter(user => user.id !== action.payload),
      };
    }
    case DELETE_BULK_USERDETELIS: {
      return {
        ...state,
        usersDetelisList: state.usersDetelisList.filter(user => !action.payload.includes(user.id)),
      };
    }
    default:
      return state;
  }
};
