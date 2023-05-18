import {
  GET_TIMEFRAME,
  ADD_TIMEFRAME,
  SET_TIMEFRAME_DETAILS,
  EDIT_TIMEFRAME,
  DELETE_TIMEFRAME,
  DELETE_BULK_TIMEFRAME
} from "../../@jumbo/constants/ActionTypes";

const INIT_STATE = {
  timeFrameList: [],
  currentTimeFrame: null
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TIMEFRAME: {
      return {
        ...state,
        timeFrameList: action.payload
      };
    }
    case SET_TIMEFRAME_DETAILS: {
      return {
        ...state,
        currentTimeFrame: action.payload
      };
    }
    case ADD_TIMEFRAME: {
      console.log(action.payload, "action.payload");
      return {
        ...state,
        timeFrameList: [action.payload, ...state.timeFrameList]
      };
    }
    case EDIT_TIMEFRAME: {
      console.log(action.payload, "action.payload");
      return {
        ...state,
        timeFrameList: state.timeFrameList.map(timeFrame =>
          timeFrame.timeframeId === action.payload.timeframeId
            ? action.payload
            : timeFrame
        )
      };
    }
    case DELETE_TIMEFRAME: {
      return {
        ...state,
        timeFrameList: state.timeFrameList.filter(
          user => user.timeframeId !== action.payload
        )
      };
    }
    case DELETE_BULK_TIMEFRAME: {
      return {
        ...state
        // timeFrameList: state.timeFrameList.filter(user => !action.payload.includes(timeFrameList.id)),
      };
    }
    default:
      return state;
  }
};
