import {
GET_CMPTR,
SET_CMPTR_DETAILS,
ADD_CMPTR,
EDIT_CMPTR,
DELETE_CMPTR,
DELETE_BULK_CMPTR,
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  cmpTrList: [],
  currentCmpTr: null,
  totalCount:0
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CMPTR: {
      return {
        ...state,
        cmpTrList: action.payload.data,   
        totalCount: action.payload?.totalCount,
      };
    }
    case SET_CMPTR_DETAILS: {
      return {
        ...state,
        currentCmpTr: action.payload,
      };
    }
    case ADD_CMPTR: {
      console.log(action.payload,"action.payload")
      return {
        ...state,
        cmpTrList: [action.payload, ...state.cmpTrList],
      };
    }
    case EDIT_CMPTR: {
      
      return {
        ...state,
        cmpTrList: state.cmpTrList.map(CmpTr => (CmpTr.perUserVoteId === action.payload.perUserVoteId ? action.payload : CmpTr)),
      };
    }
    case DELETE_CMPTR: {
      return {
        ...state,
        cmpTrList: state.cmpTrList.filter(user => user.perUserVoteId !== action.payload),
      };
    }
    case DELETE_BULK_CMPTR: {
      return {
        ...state,
        // cmpTrList: state.cmpTrList.filter(user => !action.payload.includes(cmpTrList.id)),
      };
    }
    default:
      return state;
  }
};
