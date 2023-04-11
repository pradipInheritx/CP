import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/auth/jwt/config';
import {
  ADD_SUBADMIN,
  DELETE_BULK_SUBADMINS,
  DELETE_SUBADMIN,
  EDIT_SUBADMIN,
  GET_SUBADMINS,
  SET_SUBADMIN_DETAILS,
} from '../../@jumbo/constants/ActionTypes';

export const getSubAdmin = (filterOptions = [], searchTerm = '', callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    const userId = JSON.parse(localStorage.getItem('userData'));
    // .get('/sub-admin/subAdminList/2PGCYzgpyLILzWywdC2p?limit=10&page=1', { params: { filterOptions, searchTerm } })
    // .get(`/sub-admin/subAdminList/${userId.id}?limit=10&page=1`, { params: { filterOptions, searchTerm } })
    
    axios
      .get(`/sub-admin/subAdminList/${userId?.id}?limit=10&page=1`, { params: { filterOptions, searchTerm } })
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_SUBADMINS, payload: data.data.result });
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

export const setCurrentSubAdmin = user => {
  return dispatch => {
    dispatch({ type: SET_SUBADMIN_DETAILS, payload: user });
  };
};

export const addNewSubAdmin = (user, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .post('/auth/createAdminUser', user)
      .then(data => {
        if (data.status === 200 || data.status === 201) {          
          dispatch(fetchSuccess('New user was added successfully.'));
          dispatch({ type: ADD_SUBADMIN, payload: data.data.result });
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
  return dispatch => {
    dispatch(fetchSuccess('Email has been sent to user successfully'));
  };
};

export const updateSubAdmin = (user, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put(`sub-admin/updateStatus/${user.id}`, user)
      .then(response => {
        if (response.status === 200) {
          dispatch(fetchSuccess('Selected user was updated successfully.'));
          dispatch({ type: EDIT_SUBADMIN, payload: response.data.result.data});
          if (callbackFun) callbackFun(response.data.result.data);
        } else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};

export const updateSubAdminStatus = (id, data, callbackFun) => {
  console.log(id,data,"check all data")
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put(`sub-admin/updateStatus/${id}`, data)
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          console.log(response.data.result.data,"successfully")
          dispatch(fetchSuccess('User status was updated successfully.'));
          dispatch({ type: EDIT_SUBADMIN, payload: response.data.result.data });
          if (callbackFun) callbackFun(response.data.result.data);
        } else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};

export const deleteBulkSubAdmin = (userIds, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put('/users/bulk-delete', { userIds })
      .then(response => {
        if (response.status === 200) {
          dispatch(fetchSuccess('Selected users were deleted successfully.'));
          dispatch({ type: DELETE_BULK_SUBADMINS, payload: userIds });
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

export const deleteSubAdmin = (userId, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .delete(`sub-admin/deleteSubAdmin/${userId}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess('Selected user was deleted successfully.'));
          dispatch({ type: DELETE_SUBADMIN, payload: userId });
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
