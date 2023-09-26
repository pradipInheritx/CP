import {
GET_VOTESETTING,
EDIT_VOTESETTING
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  VoteSettingDetelis: [],
  // currentUserDetelis: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_VOTESETTING: {
      return {
        ...state,
        VoteSettingDetelis: action.payload,
      };
    }        
    case EDIT_VOTESETTING: {
      return {
        ...state,
        VoteSettingDetelis:  action.payload,
      };
    }    
    default:
      return state;
  }
};
