import {
  GET_REWARDALBUM,
  SET_REWARDALBUM_DETAILS,
  ADD_REWARDALBUM,
  EDIT_REWARDALBUM,
  DELETE_REWARDALBUM,

  GET_REWARDCARD,
  SET_REWARDCARD_DETAILS,
  ADD_REWARDCARD,
  EDIT_REWARDCARD,
  DELETE_REWARDCARD,  
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  albumList: [],
  currentAlbum: null,

  cardList: [],
  currentCard: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_REWARDALBUM: {
      return {
        ...state,
        albumList: action.payload,
      };
    }
    case SET_REWARDALBUM_DETAILS: {
      return {
        ...state,
        currentAlbum: action.payload,
      };
    }
    case ADD_REWARDALBUM: {
      return {
        ...state,
        albumList: [action.payload, ...state.albumList],
      };
    }
    case EDIT_REWARDALBUM: {
      return {
        ...state,
        albumList: state.albumList.map(user => (user.id === action.payload.id ? action.payload : user)),
      };
    }
    case DELETE_REWARDALBUM: {
      return {
        ...state,
        albumList: state.albumList.filter(user => user.id !== action.payload),
      };
    }   
    
      // Reward Card
      
    case GET_REWARDCARD: {
      return {
        ...state,
        cardList: action.payload,
      };
    }
    case SET_REWARDCARD_DETAILS: {
      return {
        ...state,
        currentCard: action.payload,
      };
    }
    case ADD_REWARDCARD: {
      return {
        ...state,
        cardList: [action.payload, ...state.cardList],
      };
    }
    case EDIT_REWARDCARD: {
      return {
        ...state,
        cardList: state.cardList.map(user => (user.id === action.payload.id ? action.payload : user)),
      };
    }
    case DELETE_REWARDCARD: {
      return {
        ...state,
        cardList: state.cardList.filter(user => user.id !== action.payload),
      };
    }    
    default:
      return state;
  }
};