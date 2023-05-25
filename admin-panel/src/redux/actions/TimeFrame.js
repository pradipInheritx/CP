import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/auth/jwt/config';
import {
GET_TIMEFRAME,
ADD_TIMEFRAME,
SET_TIMEFRAME_DETAILS,
EDIT_TIMEFRAME,
DELETE_TIMEFRAME,
DELETE_BULK_TIMEFRAME
} from '../../@jumbo/constants/ActionTypes';

export const localToken = localStorage.getItem('token');

export const getTimeFrame = (filterOptions = [], searchTerm = '', callbackFun) => {

  return dispatch => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localToken;
    dispatch(fetchStart());    
    axios
      .get(`voteSetting/getTimeframe`)
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_TIMEFRAME, payload: data.data.result.timeframes });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};

export const setCurrentTimeFrame = user => {
  return dispatch => {
    dispatch({ type: SET_TIMEFRAME_DETAILS, payload: user });
  };
};

export const addNewTimeFrame = (timeFrameDetail, callbackFun) => {
  return dispatch => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localToken;
    dispatch(fetchStart());
    axios
      .post('/voteSetting/createTimeframe',{...timeFrameDetail})
      .then(data => {
        if (data.status === 200 || data.status === 201) {          
          dispatch(fetchSuccess(data.data.massges));
          dispatch({ type: ADD_TIMEFRAME, payload: data.data.result });
          if (callbackFun) callbackFun(data.data.result);
        } else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};

export const sentMailToSubAdmin = () => {
  // return dispatch => {
  //   dispatch(fetchSuccess('Email has been sent to user successfully'));
  // };
};

export const updateTimeFrame = (timeFrame, callbackFun) => {
  return dispatch => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localToken;
    dispatch(fetchStart());
    axios
      .put(`voteSetting/updateTimeframe/${timeFrame.timeframeId}`, timeFrame)
      .then(response => {
        if (response.status === 200 || response.status === 204 || response.status === 201) {
          dispatch(fetchSuccess(response.data.message));
          dispatch({ type: EDIT_TIMEFRAME, payload: response.data.result});
          if (callbackFun) callbackFun(response.data.result);
        }
        else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};

export const updateTimeFrameStatus = (timeframes ,id, data, callbackFun) => {
  console.log(timeframes,"check all data")
  return dispatch => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localToken;
    dispatch(fetchStart());
    axios      
      .put(`voteSetting/updateTimeframe/timeFrames`,{timeframes:[...timeframes]})
      .then( async (response) => {
        if (response.status === 200 || response.status === 201 || response.status === 204) {          
          console.log(response.data,"successfully")
          dispatch(fetchSuccess(response.data.message));
          // dispatch({ type: EDIT_TIMEFRAME, payload: response.data.result.timeframes });
          dispatch({ type: GET_TIMEFRAME, payload: data.data.result.timeframes});
          // if (callbackFun) callbackFun(response.data.result);
        }
        else {
          dispatch(fetchError('There was something issue in responding server.'));          
        }
      })
      .catch(error => {
        console.log("i am working first")
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};

export const deleteBulkTimeFrame = (userIds, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put('users/bulk-delete', { userIds })
      .then(response => {
        if (response.status === 200) {
          dispatch(fetchSuccess('Selected users were deleted successfully.'));
          dispatch({ type: DELETE_BULK_TIMEFRAME, payload: userIds });
          if (callbackFun) callbackFun();
        } else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};

export const deleteTimeFrame = (userId, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .delete(`voteSetting/deleteTimeframeById/${userId}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(data.data.message));
          dispatch({ type: DELETE_TIMEFRAME, payload: userId });
          if (callbackFun) callbackFun();
        } else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};
