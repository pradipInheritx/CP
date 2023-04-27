import {
GET_FOLLOWTABLE,
  SET_FOLLOWTABLE_DETAILS,

GET_COINSVOTESTABLE,
  SET_COINSVOTESTABLE_DETAILS,

GET_PAIRVOTETABLE,
SET_PAIRVOTETABLE_DETAILS,
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  followTableList: [],
  currentFollowTable: null,

  coinsVoteList: [],
  currentCoinsVote: null,

  pairVoteList: [],
  currentPairVote: null,

};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_FOLLOWTABLE: {
      return {
        ...state,
        followTableList: action.payload,
      };
    }
    case SET_FOLLOWTABLE_DETAILS: {
      return {
        ...state,
        currentFollowTable: action.payload,
      };
    }
      
    case GET_COINSVOTESTABLE: {
      return {
        ...state,
        coinsVoteList: action.payload,
      };
    }
    case SET_COINSVOTESTABLE_DETAILS: {
      return {
        ...state,
        currentCoinsVote: action.payload,
      };
    }
      
    case GET_PAIRVOTETABLE: {
      return {
        ...state,
        pairVoteList: action.payload,
      };
    }
    case SET_PAIRVOTETABLE_DETAILS: {
      return {
        ...state,
        currentPairVote: action.payload,
      };
    }
    
    default:
      return state;
  }
};
