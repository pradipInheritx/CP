import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/auth/jwt/config';
import {
  GET_REWARDALBUM,
  SET_REWARDALBUM_DETAILS,
  ADD_REWARDALBUM,
  EDIT_REWARDALBUM,
  DELETE_REWARDALBUM,

  GET_REWARDCARD,
  SET_REWARDCARD_DETAILS,
  ADD_REWARDCARD,
  EDIT_REWARDCARD,
  DELETE_REWARDCARD,  
} from '../../@jumbo/constants/ActionTypes';

export const getRewardAlbum = (filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .get('rewards/getAllAlbums', { params: { filterOptions, searchTerm } })
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_REWARDALBUM, payload: data.data.result });
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

export const setCurrentAlbum = user => {
  console.log(user,"rewarduser")
  return dispatch => {
    dispatch({ type: SET_REWARDALBUM_DETAILS, payload: user });
  };
};

export const addNewRewardAlbum = (albumData, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .post('rewards/createAlbum', albumData)
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess('New user was added successfully.'));
          dispatch({ type: ADD_REWARDALBUM, payload: data.data.result });
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

export const updateRewardAlbum = (Albumid,AlbumData, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put(`rewards/updateAlbum/${Albumid}`,AlbumData)
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess('Selected user was updated successfully.'));
          dispatch({ type: EDIT_REWARDALBUM, payload: data.data });
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

export const updateRewardAlbumStatus = (data, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put('/users/update-status', data)
      .then(response => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess('User status was updated successfully.'));
          dispatch({ type: EDIT_REWARDALBUM, payload: response.data });
          if (callbackFun) callbackFun(response.data);
        } else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};

export const deleteRewardAlbum = (albumId, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .delete(`rewards/deleteAlbum/${albumId}`,)
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess('Selected user was deleted successfully.'));
          dispatch({ type: DELETE_REWARDALBUM ,payload: albumId });
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

// RewardCard


export const getRewardCard = (filterOptions = [], searchTerm = '', page,rowsPerPage,orderBy,order,callbackFun ) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .get(`rewards/getCardListing?page=${page+1}&limit=${rowsPerPage}&orderBy=${orderBy}&sort=${order}&search=${searchTerm}`,)
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_REWARDCARD, payload: data.data.result.data});
          if (callbackFun) callbackFun(data.data.result.data);
        } else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};

export const setCurrentCard = user => {
  return dispatch => {
    dispatch({ type: SET_REWARDCARD_DETAILS, payload: user });
  };
};

export const addNewRewardCard = (CardDetail, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .post('rewards/createCard', CardDetail)
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess('New card was added successfully.'));
          dispatch({ type: ADD_REWARDCARD, payload: data.data.result });
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

export const sentMailToUser = () => {
  return dispatch => {
    dispatch(fetchSuccess('Email has been sent to user successfully'));
  };
};

export const updateRewardCard = (cardId,CardDetail, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put(`rewards/updateCard/${cardId}`,CardDetail)
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess('Selected Card was updated successfully.'));
          dispatch({ type: EDIT_REWARDCARD, payload: data.data.result });
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

export const updateRewardCardStatus = (data, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put('/users/update-status', data)
      .then(response => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess('User status was updated successfully.'));
          dispatch({ type: EDIT_REWARDCARD, payload: response.data });
          if (callbackFun) callbackFun(response.data);
        } else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};

export const deleteRewardCard = (userId, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .delete('/users', { params: { id: userId } })
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess('Selected user was deleted successfully.'));
          dispatch({ type: DELETE_REWARDCARD ,payload: userId });
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
