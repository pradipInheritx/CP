import {
GET_PAXGENERA,
EDIT_PAXGENERA
} from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  PAXGeneraDetelis: [],
  // currentUserDetelis: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PAXGENERA: {
      return {
        ...state,
        PAXGeneraDetelis: action.payload,
      };
    }        
    case EDIT_PAXGENERA: {
      return {
        ...state,
        PAXGeneraDetelis:  action.payload,
      };
    }    
    default:
      return state;
  }
};
