import {
GET_VOTEPASS,
SET_VOTEPASS_DETAILS,
ADD_VOTEPASS,
EDIT_VOTEPASS,
DELETE_VOTEPASS,
DELETE_BULK_VOTEPASS,
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  votePassList: [],
  currentVotePass: null,
  totalCount:0
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_VOTEPASS: {
      return {
        ...state,
        votePassList: action.payload.data,   
        totalCount: action.payload?.totalCount,
      };
    }
    case SET_VOTEPASS_DETAILS: {
      return {
        ...state,
        currentVotePass: action.payload,
      };
    }
    case ADD_VOTEPASS: {
      console.log(action.payload,"action.payload")
      return {
        ...state,
        votePassList: [action.payload, ...state.votePassList],
      };
    }
    case EDIT_VOTEPASS: {
      
      return {
        ...state,
        votePassList: state.votePassList.map(VotePass => (VotePass.perUserVoteId === action.payload.perUserVoteId ? action.payload : VotePass)),
      };
    }
    case DELETE_VOTEPASS: {
      return {
        ...state,
        votePassList: state.votePassList.filter(user => user.perUserVoteId !== action.payload),
      };
    }
    case DELETE_BULK_VOTEPASS: {
      return {
        ...state,
        // votePassList: state.votePassList.filter(user => !action.payload.includes(votePassList.id)),
      };
    }
    default:
      return state;
  }
};
