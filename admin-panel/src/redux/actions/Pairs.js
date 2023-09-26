import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/auth/jwt/config';
import {
GET_PAIR,
ADD_PAIR,
SET_PAIR_DETAILS,
EDIT_PAIR,
DELETE_PAIR,
DELETE_BULK_PAIR,
} from '../../@jumbo/constants/ActionTypes';

export const getPairs = (filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const userId = JSON.parse(localStorage.getItem('userData'));
    // .get('/sub-admin/subAdminList/2PGCYzgpyLILzWywdC2p?limit=10&page=1', { params: { filterOptions, searchTerm } })
    // .get(`/sub-admin/subAdminList/${userId.id}?limit=10&page=1`, { params: { filterOptions, searchTerm } })
    
    axios
      .get(`coinsPair/getAllCoinsPairs`)
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess());
          console.log(data.data.result.pairs ,"allpairData")
          dispatch({ type: GET_PAIR, payload: data.data.result.pairs });          
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

export const setCurrentPair = user => {
  return dispatch => {
    dispatch({ type: SET_PAIR_DETAILS, payload: user });
  };
};

export const addNewPair = (pair, callbackFun) => {  
  return dispatch => {
    dispatch(fetchStart());
    axios
      .post('coinsPair/createPairCoin',pair)
      .then(data => {
        if (data.status === 200 || data.status === 201) {          
          dispatch(fetchSuccess('New user was added successfully.'));
          dispatch({ type: ADD_PAIR, payload: data.data.result });
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

export const updatePair = (pair,VoteBarUpdate, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .patch(`coinsPair/updateCoinPair/voteBarRange/${pair.id}`, VoteBarUpdate)
      .then(response => {
        if (response.status === 200) {
          dispatch(fetchSuccess('Selected user was updated successfully.'));
          dispatch({ type: EDIT_PAIR, payload: response.data.result});
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

export const updatePairStatus = (id, data, callbackFun) => {
  console.log(id,data,"check all data")
  return dispatch => {
    dispatch(fetchStart());
    axios
      .patch(`coinsPair/updateCoinPairStatus/${id}`, data)
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          console.log(response.data,"successfully")
          dispatch(fetchSuccess(response.data.message));
          dispatch({ type: EDIT_PAIR, payload: response.data.result });
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

export const deleteBulkPair = (userIds, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put('/users/bulk-delete', { userIds })
      .then(response => {
        if (response.status === 200) {
          dispatch(fetchSuccess('Selected users were deleted successfully.'));
          dispatch({ type: DELETE_BULK_PAIR, payload: userIds });
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

export const deletePair = (userId, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .delete(`sub-admin/deleteSubAdmin/${userId}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess('Selected user was deleted successfully.'));
          dispatch({ type: DELETE_PAIR, payload: userId });
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
