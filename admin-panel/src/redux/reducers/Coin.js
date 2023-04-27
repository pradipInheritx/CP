import {
  GET_COIN,
ADD_COIN,
SET_COIN_DETAILS,
EDIT_COIN,
DELETE_COIN,
DELETE_BULK_COIN,
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  coinList: [],
  currentCoin: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_COIN: {
      return {
        ...state,
        coinList: action.payload,
      };
    }
    case SET_COIN_DETAILS: {
      return {
        ...state,
        currentCoin: action.payload,
      };
    }
    case ADD_COIN: {
      console.log(action.payload,"action.payload")
      return {
        ...state,
        coinList: [action.payload, ...state.coinList],
      };
    }
    case EDIT_COIN: {
      
      return {
        ...state,
        coinList: state.coinList.map(coins => (coins.id === action.payload.id ? action.payload : coins)),
      };
    }
    case DELETE_COIN: {
      return {
        ...state,
        coinList: state.coinList.filter(coin => coin.id !== action.payload),
      };
    }
    case DELETE_BULK_COIN: {
      return {
        ...state,
        // subAdminList: state.subAdminList.filter(user => !action.payload.includes(subAdminList.id)),
      };
    }
    default:
      return state;
  }
};
