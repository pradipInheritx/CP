import { fetchError, fetchStart, fetchSuccess } from './Common';
import axios from '../../services/auth/jwt/config';
import {
  
GET_REWARDSETTING,
EDIT_REWARDSETTING
} from '../../@jumbo/constants/ActionTypes';



export const getRewardSetting = () => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .get('RewardsDistribution/GetAllRewardsDistribution')
      .then(data => {
        if (data.status === 200) {
          console.log(data.data.result,"data.result")
          dispatch(fetchSuccess());
          dispatch({ type: GET_REWARDSETTING, payload: data.data.result});
          // if (callbackFun) callbackFun(data.data);
        } else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};

export const updateRewardSetting = (finalRewardInfo,) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .post('RewardsDistribution/createRewardsDistribution', {...finalRewardInfo})
      .then(data => {
        if (data.status === 200) {
          dispatch(fetchSuccess(data.data.message));

          // dispatch({ type: EDIT_REWARDSETTING, payload: data.data.result });          
        } else {
          dispatch(fetchError('There was something issue in responding server.'));
        }
      })
      .catch(error => {
        dispatch(fetchError('There was something issue in responding server'));
      });
  };
};


