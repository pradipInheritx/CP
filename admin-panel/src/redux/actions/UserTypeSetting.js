import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/auth/jwt/config';
import {
  GET_USERTYPESETTING,
  EDIT_USERTYPESETTING,
} from '../../@jumbo/constants/ActionTypes';


export const getUserSetting = () => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .get('userTypeSettings/getUserTypeSettings')
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          console.log(data.data.result,"data.data.result")
          dispatch(fetchSuccess());
          dispatch({ type: GET_USERTYPESETTING, payload: data.data.result});          
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

export const updateUserSetting = (userdetiles) => {
  console.log(userdetiles,"userdetiles")
  return dispatch => {
    dispatch(fetchStart());
    axios
      .put('userTypeSettings/update/userTypeSettings',userdetiles)
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess(data.data.message));
          dispatch({ type: EDIT_USERTYPESETTING, payload: data.data.result.data.userTypes });
          
        } else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};

// export const updateUserStatus = (data, callbackFun) => {
//   return dispatch => {
//     dispatch(fetchStart());
//     axios
//       .put('/users/update-status', data)
//       .then(response => {
//         if (response.status === 200) {
//           dispatch(fetchSuccess('User status was updated successfully.'));
//           dispatch({ type: EDIT_USERTYPESETTING, payload: response.data });
//           if (callbackFun) callbackFun(response.data);
//         } else {
//           dispatch(fetchError('There was something issue in responding server.'));
//         }
//       })
//       .catch(error => {
//         dispatch(fetchError('There was something issue in responding server'));
//       });
//   };
// };


