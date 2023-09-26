import {  
GET_STATUSTYPE,
SET_STATUSTYPE_DETAILS,
ADD_STATUSTYPE,
EDIT_STATUSTYPE,
DELETE_STATUSTYPE,
DELETE_BULK_STATUSTYPE,
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  statusTypeList: [],
  currentStatusType: null,
  totalCount:0
};

export default (state = INIT_STATE, action) => {
  
  switch (action.type) {
    case GET_STATUSTYPE: {      
      return {
        ...state,
        statusTypeList: action.payload,   
        totalCount: action.payload?.totalCount,
      };
    }
    case SET_STATUSTYPE_DETAILS: {
      return {
        ...state,
        currentStatusType: action.payload,
      };
    }
    case ADD_STATUSTYPE: {
      console.log(action.payload,"action.payload")
      return {
        ...state,
        statusTypeList: [action.payload, ...state.statusTypeList],
      };
    }
    case EDIT_STATUSTYPE: {
      
      return {
        ...state,
        statusTypeList: state.statusTypeList.map(TrTypes => (TrTypes.perUserVoteId === action.payload.perUserVoteId ? action.payload : TrTypes)),
      };
    }
    case DELETE_STATUSTYPE: {
      return {
        ...state,
        statusTypeList: state.statusTypeList.filter(user => user.perUserVoteId !== action.payload),
      };
    }
    case DELETE_BULK_STATUSTYPE: {
      return {
        ...state,
        // statusTypeList: state.statusTypeList.filter(user => !action.payload.includes(statusTypeList.id)),
      };
    }
    default:
      return state;
  }
};
