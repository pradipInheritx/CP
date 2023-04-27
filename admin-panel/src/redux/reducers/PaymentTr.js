import {
GET_PAYMENTTR,
SET_PAYMENTTR_DETAILS,
ADD_PAYMENTTR,
EDIT_PAYMENTTR,
DELETE_PAYMENTTR,
DELETE_BULK_PAYMENTTR
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  paymentTrList: [],
  currentPaymentTr: null,
  totalCount:0
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PAYMENTTR: {
      return {
        ...state,
        paymentTrList: action.payload.data,   
        totalCount: action.payload?.totalCount,
      };
    }
    case SET_PAYMENTTR_DETAILS: {
      return {
        ...state,
        currentPaymentTr: action.payload,
      };
    }
    case ADD_PAYMENTTR: {
      console.log(action.payload,"action.payload")
      return {
        ...state,
        paymentTrList: [action.payload, ...state.paymentTrList],
      };
    }
    case EDIT_PAYMENTTR: {
      
      return {
        ...state,
        paymentTrList: state.paymentTrList.map(paymentTr => (paymentTr.perUserVoteId === action.payload.perUserVoteId ? action.payload : paymentTr)),
      };
    }
    case DELETE_PAYMENTTR: {
      return {
        ...state,
        paymentTrList: state.paymentTrList.filter(user => user.perUserVoteId !== action.payload),
      };
    }
    case DELETE_BULK_PAYMENTTR: {
      return {
        ...state,
        // paymentTrList: state.paymentTrList.filter(user => !action.payload.includes(paymentTrList.id)),
      };
    }
    default:
      return state;
  }
};
