import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/auth/jwt/config';
import {
GET_VOTESETTING,
EDIT_VOTESETTING
} from '../../@jumbo/constants/ActionTypes';



export const getVoteSetting = (filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
     dispatch(fetchStart());
    axios
      .get('settings/getVoteAndretrunSettings')
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_VOTESETTING, payload: data.data.result });          
        } else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};

export const updateVoteSetting = (UpdateSetting) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put('settings/updateVoteAndReturnSettings', UpdateSetting)
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess(data.data.message));
          dispatch({ type: GET_VOTESETTING, payload: data.data.result });          
        } else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};


