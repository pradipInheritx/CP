import {
  GET_PAIR,
ADD_PAIR,
SET_PAIR_DETAILS,
EDIT_PAIR,
DELETE_PAIR,
DELETE_BULK_PAIR,
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  pairList: [],
  currentPair: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PAIR: {
      return {
        ...state,
        pairList: action.payload,
      };
    }
    case SET_PAIR_DETAILS: {
      return {
        ...state,
        currentPair: action.payload,
      };
    }
    case ADD_PAIR: {
      console.log(action.payload,"action.payload")
      return {
        ...state,
        pairList: [action.payload, ...state.pairList],
      };
    }
    case EDIT_PAIR: {
      
      return {
        ...state,
        pairList: state.pairList.map(coins => (coins.id === action.payload.id ? action.payload : coins)),
      };
    }
    case DELETE_PAIR: {
      return {
        ...state,
        pairList: state.pairList.filter(coin => coin.id !== action.payload),
      };
    }
    case DELETE_BULK_PAIR: {
      return {
        ...state,
        // subAdminList: state.subAdminList.filter(user => !action.payload.includes(subAdminList.id)),
      };
    }
    default:
      return state;
  }
};
