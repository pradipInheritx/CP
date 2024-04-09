import { fetchError, fetchStart, fetchSuccess } from "../../../redux/actions";
import {
  setAuthUser,
  setForgetPassMailSent,
  updateLoadUser
} from "../../../redux/actions/Auth";
import React from "react";
import axios from "./config";

const localToken = localStorage.getItem("token");

const JWTAuth = {
  onRegister: (userDetail, callbackFun) => {
    return dispatch => {
      dispatch(fetchStart());
      axios
        .post("auth/createAdminUser", {
          ...userDetail
        })
        .then(({ data }) => {
          if (data.result) {
            // localStorage.setItem('token', data.result.authTokens[0].token);
            // localStorage.setItem('userData', JSON.stringify(data.result));
            // axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.result.authTokens[0].token;
            dispatch(fetchSuccess(data.message));
            if (callbackFun) callbackFun();
            // dispatch(JWTAuth.getAuthUser(true, data.token.refreshToken));
          } else {
            dispatch(fetchError(data.error));
          }
        })
        .catch(function(error) {
          dispatch(fetchError(error.message));
        });
    };
  },

  onLogin: ({ email, password }) => {
    return dispatch => {
      try {
        dispatch(fetchStart());
        axios
          .post("auth/login", {
            email: email,
            password: password
          })
          .then(({ data }) => {
            if (data.result) {
              localStorage.setItem(
                "token",
                data.result.authTokens[data.result.authTokens.length - 1].token
              );
              localStorage.setItem("userData", JSON.stringify(data.result));
              axios.defaults.headers.common["Authorization"] =
                "Bearer " +
                data.result.authTokens[data.result.authTokens.length - 1].token;
              dispatch(fetchSuccess());
              dispatch(JWTAuth.getAuthUser(true, data.result.refreshToken));
            } else {
              dispatch(fetchError(data.message));
            }
          })
          .catch(error => {
            dispatch(fetchError(error.response.data.message));
          });
      } catch (error) {
        dispatch(fetchError(error.message));
      }
    };
  },
  onLogout: () => {
    return dispatch => {
      axios.defaults.headers.common["Authorization"] = "Bearer " + localToken;
      dispatch(fetchStart());
      axios
        .post("auth/logout")
        .then(({ data }) => {
          if (data) {
            dispatch(fetchSuccess());
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            dispatch(setAuthUser(null));
          } else {
            dispatch(fetchError(data.error));
          }
        })
        .catch(function(error) {
          dispatch(fetchError(error.message));
        });
    };
  },

  getAuthUser: (loaded = false, token) => {
    return dispatch => {
      if (!token) {
        // const token = localStorage.getItem('token');
        axios.defaults.headers.common["Authorization"] = "Bearer " + localToken;
      }
      dispatch(fetchStart());
      dispatch(updateLoadUser(loaded));
      const authToken = JSON.parse(localStorage.getItem("userData"));
      axios
        .post("auth/getAuthToken", {
          refreshToken: authToken?.refreshToken
        })
        .then(({ data }) => {
          if (data.result) {
            dispatch(fetchSuccess());
            dispatch(setAuthUser(data.result));
          } else {
            dispatch(updateLoadUser(true));
          }
        })
        .catch(function(error) {
          dispatch(updateLoadUser(true));
        });
    };
  },

  onForgotPassword: email => {
    return dispatch => {
      dispatch(fetchStart());
      axios
        .post("auth/forgot-password", { email: email })
        .then(({ data }) => {
          if (data) {
            dispatch(setForgetPassMailSent(true));
            dispatch(fetchSuccess(data.message));
          } else {
            dispatch(fetchError(data.error));
          }
        })
        .catch(function(error) {
          dispatch(fetchError(error.response.data.message));
        });

      // setTimeout(() => {
      //   dispatch(setForgetPassMailSent(true));
      //   dispatch(fetchSuccess());
      // }, 300);
    };
  },

  onResetPassword: (data, callbackFun) => {
    return dispatch => {
      dispatch(fetchStart());
      axios
        .post("auth/reset-password", { ...data })
        .then(({ data }) => {
          if (data) {
            dispatch(setForgetPassMailSent(true));
            dispatch(fetchSuccess(data.message));
            if (callbackFun) callbackFun();
          } else {
            dispatch(fetchError(data.error));
          }
        })
        .catch(function(error) {
          dispatch(fetchError(error.response.data.message));
        });

      // setTimeout(() => {
      //   dispatch(setForgetPassMailSent(true));
      //   dispatch(fetchSuccess());
      // }, 300);
    };
  },
  getSocialMediaIcons: () => {
    return <React.Fragment> </React.Fragment>;
  }
};

export default JWTAuth;
