import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Paper, Table, TableCell, TableContainer, TableRow, TextField } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';
import {getCMPSetting,updateCMPSetting} from '../../../redux/actions/CMPSetting';

import ConfirmDialog from '../../../@jumbo/components/Common/ConfirmDialog';
import { useDebounce } from '../../../@jumbo/utils/commonHelper';
import useStyles from './index.style';
import GridContainer from '@jumbo/components/GridContainer';
import { Grid } from 'react-virtualized';
import AppTextInput from '@jumbo/components/Common/formElements/AppTextInput';
import IntlMessages from '@jumbo/utils/IntlMessages';
import { NavLink } from 'react-router-dom';
import { requiredMessage } from '@jumbo/constants/ErrorMessages';


const CMPSettingsModule = () => {
  const classes = useStyles();
 
  const [usersFetched, setUsersFetched] = useState(false);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [userSetting, setUserSetting] = useState([]);
  const { cmpSettingDetelis } = useSelector(({ UsersDetelis }) => UsersDetelis);  
   
  const [weight, setWeight] = useState('');
  const [weightError, setWeightError] = useState('');
  
  const [returnCMP, setReturnCMP] = useState('');
  const [returnCMPError, setReturnCMPError] = useState('');
  
  const [sharePer, setSharePer] = useState('');
  const [sharePerError, setSharePerError] = useState('');

  const [userTypeCpm, setUserTypeCpm] = useState('');
  const [userTypeCpmError, setUserTypeCpmError] = useState('');   
  


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getCMPSetting(filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setUsersFetched(true);
      }),
    );
  }, [dispatch, filterOptions, debouncedSearchTerm]);  

  const onSubmitClick = () => {    
    if (!userTypeCpm) {
      setUserTypeCpmError(requiredMessage);
    } else if (!weight) {
      setWeightError(requiredMessage);
    }    
    else if (!returnCMP) {
      setReturnCMPError(requiredMessage);
    }
    else if (!sharePer) {
      setSharePerError(requiredMessage);
    }
    else {
      onCmpSave();
    }
  };

  const onCmpSave = () => {
    const CmpDetail = {
      userTypeCpm,
      weight,
      returnCMP,
      sharePer
    };    
      dispatch(
        updateCMPSetting({...CmpDetail }),
      );    
  };





  return (
    <div className={classes.root}>
          <Paper className={classes.paper}>   
              {/* <Box className={classes.authContent}> */}
         <form className='' style={{ display: "flex",justifyContent: "center",}}>
        <div className=''>                
            <Box style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }} >
              
              <TextField
              style={{width:"55%"}}                                  
              type="text"
              label={<IntlMessages id="appModule.userTypeCpm" />}            
                onChange={event => {
                  setUserTypeCpm(event.target.value)
                  setUserTypeCpmError("")
                }}
              defaultValue={cmpSettingDetelis?.userTypeCpm}
              margin="normal"
              variant="outlined"
                className={classes.textFieldRoot}
                helperText={userTypeCpmError}
              error={userTypeCpmError !== ''}
                
            />

            <TextField
            style={{width:"55%"}}
              type="text"
              label={<IntlMessages id="appModule.weight" />}              
                onChange={event => {
                  setWeight(event.target.value)
                  setWeightError("")
                }}
              defaultValue={cmpSettingDetelis?.weight}
              margin="normal"
              variant="outlined"
                className={classes.textFieldRoot}
                helperText={weightError}
              error={weightError !== ''}               
            />
                          
            <TextField
            style={{width:"55%"}}
              type="text"
              label={<IntlMessages id="appModule.returnCMP" />}              
                onChange={event => {
                  setReturnCMP(event.target.value)
                  setReturnCMPError("")
                }}
              defaultValue={cmpSettingDetelis?.returnCMP}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
                helperText={returnCMPError}
              error={returnCMPError !== ''}                               
              />
              
            <TextField
            style={{width:"55%"}}
              type="text"
              label={<IntlMessages id="appModule.sharePercent" />}          
                onChange={event => {
                  setSharePer(event.target.value)
                  setSharePerError("")
                }}
              defaultValue={cmpSettingDetelis?.sharePer}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
                helperText={sharePerError}
              error={sharePerError !== ''}                               
                
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

export default CMPSettingsModule;
