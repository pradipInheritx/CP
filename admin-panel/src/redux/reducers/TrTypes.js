import {  
GET_TRTYPES,
SET_TRTYPES_DETAILS,
ADD_TRTYPES,
EDIT_TRTYPES,
DELETE_TRTYPES,
DELETE_BULK_TRTYPES,
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  trTypesList: [],
  currentTrTypes: null,
  totalCount:0
};

export default (state = INIT_STATE, action) => {
  
  switch (action.type) {
    case GET_TRTYPES: {      
      return {
        ...state,
        trTypesList: action.payload,   
        totalCount: action.payload?.totalCount,
      };
    }
    case SET_TRTYPES_DETAILS: {
      return {
        ...state,
        currentTrTypes: action.payload,
      };
    }
    case ADD_TRTYPES: {
      console.log(action.payload,"action.payload")
      return {
        ...state,
        trTypesList: [action.payload, ...state.trTypesList],
      };
    }
    case EDIT_TRTYPES: {
      
      return {
        ...state,
        trTypesList: state.trTypesList.map(TrTypes => (TrTypes.perUserVoteId === action.payload.perUserVoteId ? action.payload : TrTypes)),
      };
    }
    case DELETE_TRTYPES: {
      return {
        ...state,
        trTypesList: state.trTypesList.filter(user => user.perUserVoteId !== action.payload),
      };
    }
    case DELETE_BULK_TRTYPES: {
      return {
        ...state,
        // trTypesList: state.trTypesList.filter(user => !action.payload.includes(trTypesList.id)),
      };
    }
    default:
      return state;
  }
};
