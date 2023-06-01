import {
  GET_USERTYPESETTING,
  EDIT_USERTYPESETTING,
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  userTypeData: [],
  // currentUserDetelis: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_USERTYPESETTING: {
      return {
        ...state,
        userTypeData: action.payload,
      };
    }
    // case SET_USERDETELIS_DETAILS: {
    //   return {
    //     ...state,
    //     currentUserDetelis: action.payload,
    //   };
    // }    
    case EDIT_USERTYPESETTING: {
      return {
        ...state,
     userTypeData:action.payload,
      };
    }
    default:
      return state;
  }
};
