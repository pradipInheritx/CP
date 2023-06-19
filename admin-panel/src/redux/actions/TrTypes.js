import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/auth/jwt/config';
import {
GET_TRTYPES,
ADD_TRTYPES,
SET_TRTYPES_DETAILS,
EDIT_TRTYPES,
DELETE_TRTYPES,
DELETE_BULK_TRTYPES,
} from '../../@jumbo/constants/ActionTypes';

export const localToken = localStorage.getItem('token');

export const getTrTypes = (filterOptions = [], searchTerm = '', callbackFun) => {

  return dispatch => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localToken;
    dispatch(fetchStart());    
    axios
      .get(`voteSetting/getTimeframe`)
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_TRTYPES, payload: data.data.result });
          
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        if (error.response.data.result.name == "TokenExpiredError") {
          localStorage.clear();
        }
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};

export const setCurrentTrTypes = user => {
  return dispatch => {
    dispatch({ type: SET_TRTYPES_DETAILS, payload: user });
  };
};

export const addNewTrTypes = (timeFrameDetail, callbackFun) => {
  return dispatch => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localToken;
    dispatch(fetchStart());
    axios
      .post('/voteSetting/createTimeframe',{...timeFrameDetail})
      .then(data => {
        if (data.status === 200 || data.status === 201) {          
          dispatch(fetchSuccess(data.data.massges));
          dispatch({ type: ADD_TRTYPES, payload: data.data.result });
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

export const updateTrTypes = (timeFrame, callbackFun) => {
  return dispatch => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localToken;
    dispatch(fetchStart());
    axios
      .put(`voteSetting/updateTimeframe/${timeFrame.timeframeId}`, timeFrame)
      .then(response => {
        if (response.status === 200 || response.status === 204 || response.status === 201) {
          dispatch(fetchSuccess(response.data.message));
          dispatch({ type: EDIT_TRTYPES, payload: response.data.result});
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

export const updateTrTypesStatus = (id, data, callbackFun) => {
  console.log(id,data,"check all data")
  return dispatch => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localToken;
    dispatch(fetchStart());
    axios
      .put(`voteSetting/updateTimeframe/${id}`, data)
      .then(response => {
        if (response.status === 200 || response.status === 201 || response.status === 204) {
          console.log(response.data.result.data,"successfully")
          dispatch(fetchSuccess(response.data.massges));
          dispatch({ type: EDIT_TRTYPES, payload: response.data.result });
          if (callbackFun) callbackFun(response.data.result);
        } else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};

export const deleteBulkTrTypes = (userIds, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put('users/bulk-delete', { userIds })
      .then(response => {
        if (response.status === 200) {
          dispatch(fetchSuccess('Selected users were deleted successfully.'));
          dispatch({ type: DELETE_BULK_TRTYPES, payload: userIds });
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

export const deleteTrTypes = (userId, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .delete(`voteSetting/deleteTimeframeById/${userId}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(data.data.message));
          dispatch({ type: DELETE_TRTYPES, payload: userId });
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
