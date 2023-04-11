import {
  ADD_SUBADMIN,
  DELETE_BULK_SUBADMINS,
  DELETE_SUBADMIN,
  EDIT_SUBADMIN,
  GET_SUBADMINS,
  SET_SUBADMIN_DETAILS,
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  subAdminList: [],
  currentUser: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SUBADMINS: {
      return {
        ...state,
        subAdminList: action.payload,
      };
    }
    case SET_SUBADMIN_DETAILS: {
      return {
        ...state,
        currentUser: action.payload,
      };
    }
    case ADD_SUBADMIN: {
      console.log(action.payload,"action.payload")
      return {
        ...state,
        subAdminList: [action.payload, ...state.subAdminList],
      };
    }
    case EDIT_SUBADMIN: {
      
      return {
        ...state,
        subAdminList: state.subAdminList.map(subAdmin => (subAdmin.id === action.payload.id ? action.payload : subAdmin)),
      };
    }
    case DELETE_SUBADMIN: {
      return {
        ...state,
        subAdminList: state.subAdminList.filter(user => user.id !== action.payload),
      };
    }
    case DELETE_BULK_SUBADMINS: {
      return {
        ...state,
        // subAdminList: state.subAdminList.filter(user => !action.payload.includes(subAdminList.id)),
      };
    }
    default:
      return state;
  }
};
