import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/auth/jwt/config';
import {
GET_STATUSTYPE,
SET_STATUSTYPE_DETAILS,
ADD_STATUSTYPE,
EDIT_STATUSTYPE,
DELETE_STATUSTYPE,
DELETE_BULK_STATUSTYPE,
} from '../../@jumbo/constants/ActionTypes';

export const localToken = localStorage.getItem('token');

export const getStatusType = (filterOptions = [], searchTerm = '', callbackFun) => {

  return dispatch => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localToken;
    dispatch(fetchStart());    
    axios
      .get(`voteSetting/getTimeframe`)
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_STATUSTYPE, payload: data.data.result });
          
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

export const setCurrentStatusType = user => {
  return dispatch => {
    dispatch({ type: SET_STATUSTYPE_DETAILS, payload: user });
  };
};

export const addNewStatusType = (timeFrameDetail, callbackFun) => {
  return dispatch => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localToken;
    dispatch(fetchStart());
    axios
      .post('/voteSetting/createTimeframe',{...timeFrameDetail})
      .then(data => {
        if (data.status === 200 || data.status === 201) {          
          dispatch(fetchSuccess(data.data.massges));
          dispatch({ type: ADD_STATUSTYPE, payload: data.data.result });
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

export const updateStatusType = (timeFrame, callbackFun) => {
  return dispatch => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localToken;
    dispatch(fetchStart());
    axios
      .put(`voteSetting/updateTimeframe/${timeFrame.timeframeId}`, timeFrame)
      .then(response => {
        if (response.status === 200 || response.status === 204 || response.status === 201) {
          dispatch(fetchSuccess(response.data.message));
          dispatch({ type: EDIT_STATUSTYPE, payload: response.data.result});
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

export const updateStatusTypeStatus = (id, data, callbackFun) => {
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
          dispatch({ type: EDIT_STATUSTYPE, payload: response.data.result });
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

export const deleteBulkStatusType = (userIds, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put('users/bulk-delete', { userIds })
      .then(response => {
        if (response.status === 200) {
          dispatch(fetchSuccess('Selected users were deleted successfully.'));
          dispatch({ type: DELETE_BULK_STATUSTYPE, payload: userIds });
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

export const deleteStatusType = (userId, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .delete(`voteSetting/deleteTimeframeById/${userId}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(data.data.message));
          dispatch({ type: DELETE_STATUSTYPE, payload: userId });
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
