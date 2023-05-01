import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from 'axios';
import {
  
GET_REWARDSETTING,
EDIT_REWARDSETTING
} from '../../@jumbo/constants/ActionTypes';



export const getRewardSetting = (filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .get('/users', { params: { filterOptions, searchTerm } })
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_REWARDSETTING, payload: data.data });
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

export const updateRewardSetting = (user, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put('/users', user)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess('Selected user was updated successfully.'));
          dispatch({ type: EDIT_REWARDSETTING, payload: data.data });
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


