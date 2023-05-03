import {
GET_CMPSETTING,
EDIT_CMPSETTING
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  cmpSettingDetelis: [],
  // currentUserDetelis: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CMPSETTING: {
      return {
        ...state,
        cmpSettingDetelis: action.payload,
      };
    }        
    case EDIT_CMPSETTING: {
      return {
        ...state,
        cmpSettingDetelis:  action.payload,
      };
    }    
    default:
      return state;
  }
};
