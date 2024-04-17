import { fetchError, fetchStart, fetchSuccess } from "./Common";
import axios from "axios";
import {
  ADD_USER,
  DELETE_BULK_USERS,
  DELETE_USER,
  EDIT_USER,
  GET_USERS,
  SET_USER_DETAILS,
  GET_ALL_USER_DATA
} from "../../@jumbo/constants/ActionTypes";
import { endpoint } from "redux/endpoint";
import { baseURL } from "../../services/auth/jwt/config";

export const getUsers = (filterOptions = [], searchTerm = "", callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .get(endpoint.users, { params: { filterOptions, searchTerm } })
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_USERS, payload: data.data });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(
            fetchError("There was something issue in responding server.")
          );
        }
      })
      .catch(error => {
        if (error.response.data.result.name === "TokenExpiredError") {
          localStorage.clear();
        }
        dispatch(fetchError("There was something issue in responding server"));
      });
  };
};

export const setCurrentUser = user => {
  return dispatch => {
    dispatch({ type: SET_USER_DETAILS, payload: user });
  };
};

export const addNewUser = (user, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .post(endpoint.users, user)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess("New user was added successfully."));
          dispatch({ type: ADD_USER, payload: data.data });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(
            fetchError("There was something issue in responding server.")
          );
        }
      })
      .catch(error => {
        dispatch(fetchError("There was something issue in responding server"));
      });
  };
};

export const sentMailToUser = () => {
  return dispatch => {
    dispatch(fetchSuccess("Email has been sent to user successfully"));
  };
};

export const updateUser = (user, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put(endpoint.users, user)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess("Selected user was updated successfully."));
          dispatch({ type: EDIT_USER, payload: data.data });
          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(
            fetchError("There was something issue in responding server.")
          );
        }
      })
      .catch(error => {
        dispatch(fetchError("There was something issue in responding server"));
      });
  };
};

export const updateUserStatus = (data, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put(endpoint.updateUserStatus, data)
      .then(response => {
        if (response.status === 200) {
          dispatch(fetchSuccess("User status was updated successfully."));
          dispatch({ type: EDIT_USER, payload: response.data });
          if (callbackFun) callbackFun(response.data);
        } else {
          dispatch(
            fetchError("There was something issue in responding server.")
          );
        }
      })
      .catch(error => {
        dispatch(fetchError("There was something issue in responding server"));
      });
  };
};

export const deleteBulkUsers = (userIds, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put(endpoint.bulkDeleteUsers, { userIds })
      .then(response => {
        if (response.status === 200) {
          dispatch(fetchSuccess("Selected users were deleted successfully."));
          dispatch({ type: DELETE_BULK_USERS, payload: userIds });
          if (callbackFun) callbackFun();
        } else {
          dispatch(
            fetchError("There was something issue in responding server.")
          );
        }
      })
      .catch(error => {
        dispatch(fetchError("There was something issue in responding server"));
      });
  };
};

export const deleteUser = (userId, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .delete(endpoint.users, { params: { id: userId } })
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess("Selected user was deleted successfully."));
          dispatch({ type: DELETE_USER, payload: userId });
          if (callbackFun) callbackFun();
        } else {
          dispatch(
            fetchError("There was something issue in responding server.")
          );
        }
      })
      .catch(error => {
        dispatch(fetchError("There was something issue in responding server"));
      });
  };
};

export const getAllUersData = (payloadObj, callbackFun) => {
  // https://us-central1-coinparliament-51ae1.cloudfunctions.net live
  // https://us-central1-coin-parliament-staging.cloudfunctions.net
  return dispatch => {
    dispatch(fetchStart());
    axios
      .post(`${baseURL}${endpoint.getAllUserStatistics}`, { ...payloadObj })
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          if (data.data.result.status) {
            dispatch(fetchSuccess());
            dispatch({
              type: GET_ALL_USER_DATA,
              payload: data.data.result
            });
          } else {
            dispatch(fetchError(data.data.result.message));
          }

          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(
            fetchError("There was something issue in responding server.")
          );
        }
      })
      .catch(error => {
        if (error.response.data.result.name === "TokenExpiredError") {
          localStorage.clear();
        }
        dispatch(fetchError(error.response.data.error.message));
      });
  };
};

export const allUserDataExport = async () => {
  let response = await axios.get(
    `${baseURL}${endpoint.exportUserStatisticsData}`,
    { responseType: "blob" }
  );
  return response.data;
};
