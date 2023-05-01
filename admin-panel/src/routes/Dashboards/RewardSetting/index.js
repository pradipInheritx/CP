import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Paper, Table, TableCell, TableContainer, TableRow, TextField } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';
import {getRewardSetting,updateRewardSetting} from '../../../redux/actions/RewardSetting';

import ConfirmDialog from '../../../@jumbo/components/Common/ConfirmDialog';
import { useDebounce } from '../../../@jumbo/utils/commonHelper';
import useStyles from './index.style';
import GridContainer from '@jumbo/components/GridContainer';
import { Grid } from 'react-virtualized';
import AppTextInput from '@jumbo/components/Common/formElements/AppTextInput';
import IntlMessages from '@jumbo/utils/IntlMessages';
import { NavLink } from 'react-router-dom';
import { requiredMessage } from '@jumbo/constants/ErrorMessages';


const RewardSettingModule = () => {
  const classes = useStyles();
 
  const [usersFetched, setUsersFetched] = useState(false);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const { RewardSettingDetelis } = useSelector(({ RewardSetting }) => RewardSetting);  
   
  const [gamePoints, setGamePoints] = useState('');
  const [gamePointsError, setGamePointsError] = useState('');
  
  const [votingBooster, setVotingBooster] = useState('');
  const [votingBoosterError, setVotingBoosterError] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getRewardSetting(filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setUsersFetched(true);
      }),
    );
  }, [dispatch, filterOptions, debouncedSearchTerm]);  

  const onSubmitClick = () => {    
    if (!gamePoints) {
      setGamePointsError(requiredMessage);
    }
    else if (!votingBooster) {
      setVotingBoosterError(requiredMessage);
    }             
    else {
      onCmpSave();
    }
  };

  const onCmpSave = () => {
    const RewardSettingDetail = {
      gamePoints,
      votingBooster
    };    
      dispatch(
        updateRewardSetting({...RewardSettingDetail}),
      );    
  };





  return (
    <div className={classes.root}>
          <Paper className={classes.paper}>   
              {/* <Box className={classes.authContent}> */}
         <form className='' style={{ display: "flex" ,justifyContent: "center",}}>
          <div className='' style={{ marginTop:"10px"}}>   
        <label htmlFor="">Game Points</label>    
            <Box style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }} >              
              <TextField
                style={{ width: "40%" }} 
                // fullWidth
              type="text"
                label={
                  // <IntlMessages id="appModule.userTypeCpm" />
                  "Min"
                }            
              onChange={(event) =>{
                 setGamePoints(event.target.value)
                 setGamePointsError("")
                }}
              defaultValue={RewardSettingDetelis?.gamePoints}
              margin="normal"
              variant="outlined"
                className={classes.textFieldRoot}
                helperText={gamePointsError}
                error={gamePointsError !== ''}
            />
              <TextField
                style={{ width: "40%" }} 
                // fullWidth
              type="text"
                label={
                  // <IntlMessages id="appModule.userTypeCpm" />
                  "Max"
                }            
              
              onChange={(event) =>{
                 setGamePoints(event.target.value)
                 setGamePointsError("")
                }}
              defaultValue={RewardSettingDetelis?.gamePoints}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
              helperText={gamePointsError}
              error={gamePointsError !== ''}
              />
              </Box>
          <label htmlFor="">Voting Booster</label>    
          <Box style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }} >              
            <TextField
            style={{width:"40%"}}
                // fullWidth
              type="text"
                label={
                  // <IntlMessages id="appModule.weight" />
                  "Min"
                }              
              onChange={event => {
                setVotingBooster(event.target.value)
                setVotingBoosterError("")
              }}
              defaultValue={RewardSettingDetelis?.votingBooster}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
              helperText={votingBoosterError}
              error={votingBoosterError !== ''}
              />                                                                                           
            
             <TextField
            style={{width:"40%"}}
                // fullWidth
              type="text"
                label={
                  // <IntlMessages id="appModule.weight" />
                  "Max"
                }              
              onChange={event => {
                setVotingBooster(event.target.value)
                setVotingBoosterError("")
              }}
              defaultValue={RewardSettingDetelis?.votingBooster}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
              helperText={votingBoosterError}
              error={votingBoosterError !== ''}
              />                                                                                                                                                                                                         
            </Box>
           
          <Box marginY={"10px"}  display="flex" alignItems="center" justifyContent="space-around" mb={5}>
              <Button
                type="reset" 
              //   onClick={onSubmit}
              variant="contained" color="neutral">
              <IntlMessages id="appModule.reset" />
            </Button>            
            <Button
              onClick={onSubmitClick}
              variant="contained" color="primary">
              <IntlMessages id="appModule.submit" />
            </Button>            
            
          </Box>
        </div>
      </form>
      </Paper>      
    </div>
  );
};

export default RewardSettingModule;
