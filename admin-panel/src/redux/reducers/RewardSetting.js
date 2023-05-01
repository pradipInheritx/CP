import {  
GET_REWARDSETTING,
EDIT_REWARDSETTING
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  RewardSettingDetelis: [],
  // currentUserDetelis: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_REWARDSETTING: {
      return {
        ...state,
        RewardSettingDetelis: action.payload,
      };
    }        
    case EDIT_REWARDSETTING: {
      return {
        ...state,
        RewardSettingDetelis:  action.payload,
      };
    }    
    default:
      return state;
  }
};
