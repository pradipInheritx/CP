import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/auth/jwt/config';
import {
GET_COIN,
ADD_COIN,
SET_COIN_DETAILS,
EDIT_COIN,
DELETE_COIN,
DELETE_BULK_COIN,
} from '../../@jumbo/constants/ActionTypes';

export const getCoins = (filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const userId = JSON.parse(localStorage.getItem('userData'));
    // .get('/sub-admin/subAdminList/2PGCYzgpyLILzWywdC2p?limit=10&page=1', { params: { filterOptions, searchTerm } })
    // .get(`/sub-admin/subAdminList/${userId.id}?limit=10&page=1`, { params: { filterOptions, searchTerm } })
    
    axios
      .get(`coins/getAllCoins`)
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess());
          console.log(data.data.result.coins,"allCoin")
          dispatch({ type: GET_COIN, payload: data.data.result.coins});
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

export const setCurrentCoin = user => {
  return dispatch => {
    dispatch({ type: SET_COIN_DETAILS, payload: user });
  };
};

export const addNewCoin = (user, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .post('/auth/createAdminUser', user)
      .then(data => {
        if (data.status === 200 || data.status === 201) {          
          dispatch(fetchSuccess('New user was added successfully.'));
          dispatch({ type: ADD_COIN, payload: data.data.result });
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

// export const sentMailToSubAdmin = () => {
//   return dispatch => {
//     dispatch(fetchSuccess('Email has been sent to user successfully'));
//   };
// };

export const updateCoin = (coin,VoteBarUpdate, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .patch(`coins/updateCoin/voteBarRange/${coin.id}`, VoteBarUpdate)
      .then(response => {
        if (response.status === 200) {
          dispatch(fetchSuccess('Selected coin was updated successfully.'));
          dispatch({ type: EDIT_COIN, payload: response.data.result});
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

export const updateCoinStatus = (id, data, callbackFun) => {
  console.log(id,data,"check all data")
  return dispatch => {
    dispatch(fetchStart());
    axios
      .patch(`coins/updateCoinStatus/${id}`, data)
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          console.log(response.data.result.data,"successfully")
          dispatch(fetchSuccess('User status was updated successfully.'));
          dispatch({ type: EDIT_COIN, payload: response.data.result });
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

export const deleteBulkCoin = (userIds, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put('/users/bulk-delete', { userIds })
      .then(response => {
        if (response.status === 200) {
          dispatch(fetchSuccess('Selected users were deleted successfully.'));
          dispatch({ type: DELETE_BULK_COIN, payload: userIds });
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

export const deleteCoin = (userId, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .delete(`sub-admin/deleteSubAdmin/${userId}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess('Selected user was deleted successfully.'));
          dispatch({ type: DELETE_COIN, payload: userId });
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
