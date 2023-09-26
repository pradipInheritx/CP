import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/auth/jwt/config';
import {
  
GET_RETURNSETTING,
EDIT_RETURNSETTING
} from '../../@jumbo/constants/ActionTypes';



export const getReturnSetting = () => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .get('settings/getVoteAndretrunSettings')
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_RETURNSETTING, payload: data.data.result });          
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

export const updateReturnSetting = (UpdateSetting) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put('settings/updateVoteAndReturnSettings', UpdateSetting)
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess(data.data.message));
          dispatch({ type: EDIT_RETURNSETTING, payload: data.data.result });          
        } else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};


