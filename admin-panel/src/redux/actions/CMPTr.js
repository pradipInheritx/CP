import { fetchError, fetchStart, fetchSuccess } from "./Common";
import axios from "../../services/auth/jwt/config";
import {
  GET_CMPTR,
  SET_CMPTR_DETAILS,
  ADD_CMPTR,
  EDIT_CMPTR,
  DELETE_CMPTR,
  DELETE_BULK_CMPTR
} from "../../@jumbo/constants/ActionTypes";
import { endpoint } from "../endpoint";

export const localToken = localStorage.getItem("token");

export const getCMPTr = (
  filterOptions = [],
  searchTerm = "",
  page,
  rowsPerPage,
  orderBy,
  order,
  callbackFun
) => {
  console.log(page, rowsPerPage, orderBy, order, "alldeteails");
  return dispatch => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + localToken;
    dispatch(fetchStart());
    axios
      .get(
        `${endpoint.getPerUserVote}?limit=${rowsPerPage}&page=${page +
          1}&orderBy=${orderBy}&sort=${order}&search=${searchTerm}`
      )
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_CMPTR, payload: data.data.result });

          if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(
            fetchError("There was something issue in responding server.")
          );
        }
      })
      .catch(error => {
        if (error.response.data.result.name == "TokenExpiredError") {
          localStorage.clear();
        }
        dispatch(fetchError("There was something issue in responding server"));
      });
  };
};

export const setCurrentCMPTr = user => {
  return dispatch => {
    dispatch({ type: SET_CMPTR_DETAILS, payload: user });
  };
};

export const addNewCMPTr = (timeFrameDetail, callbackFun) => {
  return dispatch => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + localToken;
    dispatch(fetchStart());
    axios
      .post(endpoint.createPerUserVote, { ...timeFrameDetail })
      .then(data => {
        if (data.status === 200 || data.status === 201) {
          dispatch(fetchSuccess(data.data.massges));
          dispatch({ type: ADD_CMPTR, payload: data.data.result });
          if (callbackFun) callbackFun(data.data.result);
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

export const sentMailToSubAdmin = () => {
  // return dispatch => {
  //   dispatch(fetchSuccess('Email has been sent to user successfully'));
  // };
};

export const updateCMPTr = (timeFrame, callbackFun) => {
  return dispatch => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + localToken;
    dispatch(fetchStart());
    axios
      .put(
        `${endpoint.updatePerUserVoteById}/${timeFrame.perUserVoteId}`,
        timeFrame
      )
      .then(response => {
        if (
          response.status === 200 ||
          response.status === 204 ||
          response.status === 201
        ) {
          dispatch(fetchSuccess(response.data.message));
          dispatch({ type: EDIT_CMPTR, payload: response.data.result });
          if (callbackFun) callbackFun(response.data.result);
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

export const updateCMPTrStatus = (id, data, callbackFun) => {
  console.log(id, data, "check all data");
  return dispatch => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + localToken;
    dispatch(fetchStart());
    axios
      .put(`${endpoint.updateTimeframe}/${id}`, data)
      .then(response => {
        if (
          response.status === 200 ||
          response.status === 201 ||
          response.status === 204
        ) {
          console.log(response.data.result.data, "successfully");
          dispatch(fetchSuccess(response.data.massges));
          dispatch({ type: EDIT_CMPTR, payload: response.data.result });
          if (callbackFun) callbackFun(response.data.result);
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

// export const deleteBulkTimeFrame = (userIds, callbackFun) => {
//   return dispatch => {
//     dispatch(fetchStart());
//     axios
//       .put('users/bulk-delete', { userIds })
//       .then(response => {
//         if (response.status === 200) {
//           dispatch(fetchSuccess('Selected users were deleted successfully.'));
//           dispatch({ type: DELETE_BULK_TIMEFRAME, payload: userIds });
//           if (callbackFun) callbackFun();
//         } else {
//           dispatch(fetchError('There was something issue in responding server.'));
//         }
//       })
//       .catch(error => {
//         dispatch(fetchError('There was something issue in responding server'));
//       });
//   };
// };

export const deleteCMPTr = (userId, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .delete(`${endpoint.deletePerUserVoteById}/${userId}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(data.data.message));
          dispatch({ type: DELETE_CMPTR, payload: userId });
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
