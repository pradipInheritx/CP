import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Paper, Table, TableCell, TableContainer, TableRow, TextField } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';
import {getReturnSetting,updateReturnSetting} from '../../../redux/actions/ReturnSetting';

import ConfirmDialog from '../../../@jumbo/components/Common/ConfirmDialog';
import { useDebounce } from '../../../@jumbo/utils/commonHelper';
import useStyles from './index.style';
import GridContainer from '@jumbo/components/GridContainer';
import { Grid } from 'react-virtualized';
import AppTextInput from '@jumbo/components/Common/formElements/AppTextInput';
import IntlMessages from '@jumbo/utils/IntlMessages';
import { NavLink } from 'react-router-dom';
import { requiredMessage } from '@jumbo/constants/ErrorMessages';


const ReturnSettingModule = () => {
  const classes = useStyles();
 
  const [usersFetched, setUsersFetched] = useState(false);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const { ReturnSettingDetelis } = useSelector(({ ReturnSetting }) => ReturnSetting);  
   
  const [considerableAffec, setConsiderableAffec] = useState('');
  const [considerableAffecError, setConsiderableAffecError] = useState('');
  
  const [mediumAffect, setMediumAffect] = useState('');
  const [mediumAffectError, setMediumAffectError] = useState('');

  const [minorAffect, setMinorAffect] = useState('');
  const [minorAffectError, setMinorAffectError] = useState('');
    
  


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getReturnSetting(filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setUsersFetched(true);
      }),
    );
  }, [dispatch, filterOptions, debouncedSearchTerm]);  

  const onSubmitClick = () => {    
    if (!considerableAffec) {
      setConsiderableAffecError(requiredMessage);
    }
    else if (!mediumAffect) {
      setMediumAffectError(requiredMessage);
    }       
    else if (!minorAffect) {
      setMinorAffectError(requiredMessage);
    }       
    else {
      onCmpSave();
    }
  };

  const onCmpSave = () => {
    const ReturnSettingDetail = {
      considerableAffec,
      mediumAffect,
      minorAffect
    };    
      dispatch(
        updateReturnSetting({...ReturnSettingDetail}),
      );    
  };





  return (
    <div className={classes.root}>
          <Paper className={classes.paper}>   
              {/* <Box className={classes.authContent}> */}
         <form className='' style={{ display: "flex" ,justifyContent: "center",}}>
        <div className='' >                
            <Box style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }} >
              
              <TextField
                style={{ width: "75%" }} 
                // fullWidth
              type="text"
                label={
                  // <IntlMessages id="appModule.userTypeCpm" />
                  "Considerable Affec"
                }            
                onChange={event => {
                  setConsiderableAffec(event.target.value)
                  setConsiderableAffecError("")
                }}
              defaultValue={ReturnSettingDetelis?.considerableAffec}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
              helperText={considerableAffecError}
              error={considerableAffecError !== ''}
            />

            <TextField
            style={{width:"75%"}}
                // fullWidth
              type="text"
                label={
                  // <IntlMessages id="appModule.weight" />
                  "Medium Affect"
                }              
                onChange={event => {
                  setMediumAffect(event.target.value)
                  setMediumAffectError("")
                }}
              defaultValue={ReturnSettingDetelis?.mediumAffect}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
                helperText={mediumAffectError}
              error={mediumAffectError !== ''}
                
              />                                     
              
            <TextField
            style={{width:"75%"}}
                // fullWidth
              type="text"
                label={
                  // <IntlMessages id="appModule.weight" />
                  "Minor Affect"
                }              
                onChange={event => {
                  setMinorAffect(event.target.value)
                  setMinorAffectError("")
                }}
              defaultValue={ReturnSettingDetelis?.minorAffect}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
                helperText={minorAffectError}
              error={minorAffectError !== ''}                
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
              // onClick={onSubmit}
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

export default ReturnSettingModule;
