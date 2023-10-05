import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/auth/jwt/config';
import {
GET_VOTEPASS,
SET_VOTEPASS_DETAILS,
ADD_VOTEPASS,
EDIT_VOTEPASS,
DELETE_VOTEPASS,
DELETE_BULK_VOTEPASS,
} from '../../@jumbo/constants/ActionTypes';

export const localToken = localStorage.getItem('token');

export const getVotePass = (filterOptions = [], searchTerm = '',page ,rowsPerPage ,orderBy ,order , callbackFun) => {
console.log(page ,rowsPerPage ,orderBy ,order ,"alldeteails")
  return dispatch => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localToken;
    dispatch(fetchStart());    
    axios
      .get(`voteSetting/getPerUserVote?limit=${rowsPerPage}&page=${page+1}&orderBy=${orderBy}&sort=${order}&search=${searchTerm}`)
      .then(data => {
        if (data.status === 200 || data.status === 201 || data.status === 204) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_VOTEPASS, payload: data.data.result });
          
          if (callbackFun) callbackFun(data.data);
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

export const setCurrentVotePass = user => {
  return dispatch => {
    dispatch({ type: SET_VOTEPASS_DETAILS, payload: user });
  };
};

export const addNewVotePass = (timeFrameDetail, callbackFun) => {
  return dispatch => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localToken;
    dispatch(fetchStart());
    axios
      .post('voteSetting/createPerUserVote',{...timeFrameDetail})
      .then(data => {
        if (data.status === 200 || data.status === 201) {          
          dispatch(fetchSuccess(data.data.massges));
          dispatch({ type: ADD_VOTEPASS, payload: data.data.result });
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
  // return dispatch => {
  //   dispatch(fetchSuccess('Email has been sent to user successfully'));
  // };
};

export const updateVotePass = (timeFrame, callbackFun) => {
  return dispatch => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localToken;
    dispatch(fetchStart());
    axios
      .put(`voteSetting/updatePerUserVoteById/${timeFrame.perUserVoteId}`, timeFrame)
      .then(response => {
        if (response.status === 200 || response.status === 204 || response.status === 201) {
          dispatch(fetchSuccess(response.data.message));
          dispatch({ type: EDIT_VOTEPASS, payload: response.data.result});
          if (callbackFun) callbackFun(response.data.result);
        }
        else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};

export const updateVotePassStatus = (id, data, callbackFun) => {
  console.log(id,data,"check all data")
  return dispatch => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localToken;
    dispatch(fetchStart());
    axios
      .put(`voteSetting/updateTimeframe/${id}`, data)
      .then(response => {
        if (response.status === 200 || response.status === 201 || response.status === 204) {
          console.log(response.data.result.data,"successfully")
          dispatch(fetchSuccess(response.data.massges));
          dispatch({ type: EDIT_VOTEPASS, payload: response.data.result });
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

export const deleteVotePass = (userId, callbackFun) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .delete(`voteSetting/deletePerUserVoteById/${userId}`)
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(data.data.message));
          dispatch({ type: DELETE_VOTEPASS, payload: userId });
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