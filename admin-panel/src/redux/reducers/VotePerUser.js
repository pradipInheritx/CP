import {
GET_VOTEPERUSER,
ADD_VOTEPERUSER,
SET_VOTEPERUSER_DETAILS,
EDIT_VOTEPERUSER,
DELETE_VOTEPERUSER,
DELETE_BULK_VOTEPERUSER,
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  votePerUserList: [],
  currentVotePerUser: null,
  totalCount:0
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_VOTEPERUSER: {
      return {
        ...state,
        votePerUserList: action.payload.data,
        votePerUserList: action.payload.data,
        totalCount: action.payload?.totalCount,
      };
    }
    case SET_VOTEPERUSER_DETAILS: {
      return {
        ...state,
        currentVotePerUser: action.payload,
      };
    }
    case ADD_VOTEPERUSER: {
      console.log(action.payload,"action.payload")
      return {
        ...state,
        votePerUserList: [action.payload, ...state.votePerUserList],
      };
    }
    case EDIT_VOTEPERUSER: {
      
      return {
        ...state,
        votePerUserList: state.votePerUserList.map(votePerUser => (votePerUser.perUserVoteId === action.payload.perUserVoteId ? action.payload : votePerUser)),
      };
    }
    case DELETE_VOTEPERUSER: {
      return {
        ...state,
        votePerUserList: state.votePerUserList.filter(user => user.perUserVoteId !== action.payload),
      };
    }
    case DELETE_BULK_VOTEPERUSER: {
      return {
        ...state,
        // votePerUserList: state.votePerUserList.filter(user => !action.payload.includes(votePerUserList.id)),
      };
    }
    default:
      return state;
  }
};
