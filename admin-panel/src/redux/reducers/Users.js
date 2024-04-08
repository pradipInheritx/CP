import {
  ADD_USER,
  DELETE_BULK_USERS,
  DELETE_USER,
  EDIT_USER,
  GET_USERS,
  SET_USER_DETAILS,
  GET_ALL_USER_DATA
} from "../../@jumbo/constants/ActionTypes";

const INIT_STATE = {
  users: [],
  currentUser: null,
  allUserData: [],
  totalCount: 0
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_USERS: {
      return {
        ...state,
        users: action.payload
      };
    }
    case SET_USER_DETAILS: {
      return {
        ...state,
        currentUser: action.payload
      };
    }
    case ADD_USER: {
      return {
        ...state,
        users: [action.payload, ...state.users]
      };
    }
    case EDIT_USER: {
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        )
      };
    }
    case DELETE_USER: {
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
    }
    case DELETE_BULK_USERS: {
      return {
        ...state,
        users: state.users.filter(user => !action.payload.includes(user.id))
      };
    }
    case GET_ALL_USER_DATA: {
      return {
        ...state,
        allUserData: action.payload.data,
        totalCount: action.payload.totalCount
      };
    }
    default:
      return state;
  }
};
