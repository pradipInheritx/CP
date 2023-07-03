import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Paper, Table, TableCell, TableContainer, TableRow, TextField } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';
import {getVoteSetting,updateVoteSetting} from '../../../redux/actions/VoteSetting';

import ConfirmDialog from '../../../@jumbo/components/Common/ConfirmDialog';
import { useDebounce } from '../../../@jumbo/utils/commonHelper';
import useStyles from './index.style';
import GridContainer from '@jumbo/components/GridContainer';
import { Grid } from 'react-virtualized';
import AppTextInput from '@jumbo/components/Common/formElements/AppTextInput';
import IntlMessages from '@jumbo/utils/IntlMessages';
import { NavLink } from 'react-router-dom';
import { requiredMessage } from '@jumbo/constants/ErrorMessages';


const VoteSettingsModule = () => {
  const classes = useStyles();
 const  validRegExp = new RegExp(/^\d*\.?\d*$/);
  const [usersFetched, setUsersFetched] = useState(false);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const { VoteSettingDetelis } = useSelector(({ VoteSetting }) => VoteSetting);  
  const [allSettingData, setAllSettingData] = useState({});
  const [giveTime, setGiveTime] = useState('');
  const [giveTimeError, setGiveTimeError] = useState('');
  
  const [afterTimeVote, setAfterTimeVote] = useState('');
  const [afterTimeVoteError, setAfterTimeVoteError] = useState('');
    
  


  const dispatch = useDispatch();

  useEffect(() => {
    // setAllSettingData(ReturnSettingDetelis)
    if (VoteSettingDetelis) {      
      setGiveTime(VoteSettingDetelis?.voteRules?.timeLimit)
      setAfterTimeVote(VoteSettingDetelis?.voteRules?.maxVotes)      
      setAllSettingData(VoteSettingDetelis)
    }
  }, [VoteSettingDetelis]);

  useEffect(() => {
    dispatch(
      getVoteSetting(filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setUsersFetched(true);
      }),
    );
  }, [dispatch, filterOptions, debouncedSearchTerm]);  

  const onSubmitClick = () => {    
    if (!giveTime) {
      setGiveTimeError(requiredMessage);
    } else if (!afterTimeVote) {
      setAfterTimeVoteError(requiredMessage);
    }       
    else {
      onCmpSave();
    }
  };

  const onCmpSave = () => {
     var allDatainfo = {
      ...allSettingData.CPMSettings,
      ...allSettingData.voteRules,
    }
    allDatainfo["maxVotes"]=afterTimeVote
    allDatainfo["timeLimit"] = giveTime
    
    console.log(allDatainfo,"allDatainfo")

      dispatch(
        updateVoteSetting(allDatainfo),
      );    
  };





  return (
    <div className={classes.root}>
          <Paper className={classes.paper}>   
              {/* <Box className={classes.authContent}> */}
         <form className='' style={{ display: "flex" ,justifyContent: "center",}} >
        <div className='' >                
            <Box style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }} >
              
              <TextField
                // style={{ width: "55%" }} 
                fullWidth
              type="text"
                label={"Time limit"} 
                value={giveTime}
                onChange={event => {
                var finalValue = validRegExp.test(event.target.value);
                  if(finalValue) setGiveTime(event.target.value)
                setGiveTimeError("")
              }}
              
              margin="normal"
              variant="outlined"
                className={classes.textFieldRoot}
                helperText={giveTimeError}
              error={giveTimeError !== ''}

            />

            <TextField
            // style={{width:"55%"}}
                fullWidth
              type="text"
                label={
                  // <IntlMessages id="appModule.weight" />
                  "Max Votes"
                }              
                onChange={event => {
                var finalValue = validRegExp.test(event.target.value);
                  if(finalValue)setAfterTimeVote(event.target.value)
                setAfterTimeVoteError("")
              }}
              value={afterTimeVote}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
              helperText={afterTimeVoteError}
              error={afterTimeVoteError !== ''}
            />                                     
          </Box>
          <Box marginY={"10px"}  display="flex" alignItems="center" justifyContent="space-around" mb={5}>
              <Button
                type="reset" 
                // onClick={rest()}
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

export default VoteSettingsModule;
