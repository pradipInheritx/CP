import { fetchError, fetchStart, fetchSuccess } from "./Common";
import axios from "axios";
import {
  GET_PAXGENERA,
  EDIT_PAXGENERA
} from "../../@jumbo/constants/ActionTypes";
import { endpoint } from "redux/endpoint";

export const getPAXGenera = (
  filterOptions = [],
  searchTerm = "",
  callbackFun
) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .get(endpoint.paxUsers, { params: { filterOptions, searchTerm } })
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_PAXGENERA, payload: data.data });
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

export const updatePAXGenera = (user, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put(endpoint.paxUsers, user)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess("Selected user was updated successfully."));
          dispatch({ type: EDIT_PAXGENERA, payload: data.data });
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
