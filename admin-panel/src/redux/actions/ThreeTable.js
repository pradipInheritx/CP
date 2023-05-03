import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/auth/jwt/config';
import {
GET_FOLLOWTABLE,
  SET_FOLLOWTABLE_DETAILS,

GET_COINSVOTESTABLE,
  SET_COINSVOTESTABLE_DETAILS,

GET_PAIRVOTETABLE,
SET_PAIRVOTETABLE_DETAILS,

} from '../../@jumbo/constants/ActionTypes';

export const localToken = localStorage.getItem('token');

export const getFollowTable = (filterOptions = [], searchTerm = '', callbackFun) => {

  return dispatch => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localToken;
    dispatch(fetchStart());    
    // axios
    //   .get(`voteSetting/getTimeframe`)
    //   .then(data => {
    //     if (data.status === 200 || data.status === 201 || data.status === 204) {
    //       dispatch(fetchSuccess());
    //       dispatch({ type: GET_FOLLOWTABLE, payload: data.data.result });
    //       if (callbackFun) callbackFun(data.data);
    //     } else {
    //       dispatch(fetchError('There was something issue in responding server.'));
    //     }
    //   })
    //   .catch(error => {
    //     dispatch(fetchError('There was something issue in responding server'));
    //   });
  };
};

export const setCurrentFollowTable = user => {
  return dispatch => {
    dispatch({ type: SET_FOLLOWTABLE_DETAILS, payload: user });
  };
};


export const getCoinsVote = (filterOptions = [], searchTerm = '', callbackFun) => {

  return dispatch => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localToken;
    dispatch(fetchStart());    
    // axios
    //   .get(`voteSetting/getTimeframe`)
    //   .then(data => {
    //     if (data.status === 200 || data.status === 201 || data.status === 204) {
    //       dispatch(fetchSuccess());
    //       dispatch({ type: GET_COINSVOTESTABLE, payload: data.data.result });
    //       if (callbackFun) callbackFun(data.data);
    //     } else {
    //       dispatch(fetchError('There was something issue in responding server.'));
    //     }
    //   })
    //   .catch(error => {
    //     dispatch(fetchError('There was something issue in responding server'));
    //   });
  };
};

export const setCurrentCoinsVote = user => {
  return dispatch => {
    dispatch({ type: SET_COINSVOTESTABLE_DETAILS, payload: user });
  };
};


export const getPairVote = (filterOptions = [], searchTerm = '', callbackFun) => {

  return dispatch => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localToken;
    dispatch(fetchStart());    
    // axios
    //   .get(`voteSetting/getTimeframe`)
    //   .then(data => {
    //     if (data.status === 200 || data.status === 201 || data.status === 204) {
    //       dispatch(fetchSuccess());
    //       dispatch({ type: GET_PAIRVOTETABLE, payload: data.data.result });
    //       if (callbackFun) callbackFun(data.data);
    //     } else {
    //       dispatch(fetchError('There was something issue in responding server.'));
    //     }
    //   })
    //   .catch(error => {
    //     dispatch(fetchError('There was something issue in responding server'));
    //   });
  };
};

export const setCurrentPairVote = user => {
  return dispatch => {
    dispatch({ type: SET_PAIRVOTETABLE_DETAILS, payload: user });
  };
};
