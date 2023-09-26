import {
GET_VOTEBOOST,
ADD_VOTEBOOST,
SET_VOTEBOOST_DETAILS,
EDIT_VOTEBOOST,
DELETE_VOTEBOOST,
DELETE_BULK_VOTEBOOST,
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  voteBoostList: [],
  currentVoteBoost: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_VOTEBOOST: {
      return {
        ...state,
        voteBoostList: action.payload,
      };
    }
    case SET_VOTEBOOST_DETAILS: {
      return {
        ...state,
        currentVoteBoost: action.payload,
      };
    }
    case ADD_VOTEBOOST: {
      console.log(action.payload,"action.payload")
      return {
        ...state,
        voteBoostList: [action.payload, ...state.voteBoostList],
      };
    }
    case EDIT_VOTEBOOST: {
      
      return {
        ...state,
        voteBoostList: state.voteBoostList.map(voteBoost => (voteBoost.voteBoostId === action.payload.voteBoostId ? action.payload : voteBoost)),
      };
    }
    case DELETE_VOTEBOOST: {
      return {
        ...state,
        voteBoostList: state.voteBoostList.filter(user => user.voteBoostId !== action.payload),
      };
    }
    case DELETE_BULK_VOTEBOOST: {
      return {
        ...state,
        // voteBoostList: state.voteBoostList.filter(user => !action.payload.includes(voteBoostList.id)),
      };
    }
    default:
      return state;
  }
};
