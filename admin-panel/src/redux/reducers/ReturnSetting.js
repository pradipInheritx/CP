import {
GET_RETURNSETTING,
EDIT_RETURNSETTING
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  ReturnSettingDetelis: [],
  // currentUserDetelis: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_RETURNSETTING: {
      return {
        ...state,
        ReturnSettingDetelis: action.payload,
      };
    }        
    case EDIT_RETURNSETTING: {
      return {
        ...state,
        ReturnSettingDetelis:  action.payload,
      };
    }    
    default:
      return state;
  }
};
