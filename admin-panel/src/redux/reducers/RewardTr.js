import {
GET_REWARDTR,
SET_REWARDTR_DETAILS,
ADD_REWARDTR,
EDIT_REWARDTR,
DELETE_REWARDTR,
DELETE_BULK_REWARDTR,
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  rewardTrList: [],
  currentRewardTr: null,
  totalCount:0
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_REWARDTR: {
      return {
        ...state,
        rewardTrList: action.payload,   
        totalCount: action.payload?.totalCount,
      };
    }
    case SET_REWARDTR_DETAILS: {
      return {
        ...state,
        currentRewardTr: action.payload,
      };
    }
    case ADD_REWARDTR: {
      console.log(action.payload,"action.payload")
      return {
        ...state,
        rewardTrList: [action.payload, ...state.rewardTrList],
      };
    }
    case EDIT_REWARDTR: {
      
      return {
        ...state,
        rewardTrList: state.rewardTrList.map(rewardTr => (rewardTr.perUserVoteId === action.payload.perUserVoteId ? action.payload : rewardTr)),
      };
    }
    case DELETE_REWARDTR: {
      return {
        ...state,
        rewardTrList: state.rewardTrList.filter(user => user.perUserVoteId !== action.payload),
      };
    }
    case DELETE_BULK_REWARDTR: {
      return {
        ...state,
        // rewardTrList: state.rewardTrList.filter(user => !action.payload.includes(rewardTrList.id)),
      };
    }
    default:
      return state;
  }
};
