import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from 'axios';
import {
GET_CMPSETTING,
EDIT_CMPSETTING
} from '../../@jumbo/constants/ActionTypes';



export const getCMPSetting = (filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .get('/users', { params: { filterOptions, searchTerm } })
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_CMPSETTING, payload: data.data });
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

export const updateCMPSetting = (user, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put('/users', user)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess('Selected user was updated successfully.'));
          dispatch({ type: EDIT_CMPSETTING, payload: data.data });
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


