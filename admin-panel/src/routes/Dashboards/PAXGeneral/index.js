import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Paper, Table, TableCell, TableContainer, TableRow, TextField } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';
import {getPAXGenera,updatePAXGenera} from '../../../redux/actions/PAXGenera';

import ConfirmDialog from '../../../@jumbo/components/Common/ConfirmDialog';
import { useDebounce } from '../../../@jumbo/utils/commonHelper';
import useStyles from './index.style';
import GridContainer from '@jumbo/components/GridContainer';
import { Grid } from 'react-virtualized';
import AppTextInput from '@jumbo/components/Common/formElements/AppTextInput';
import IntlMessages from '@jumbo/utils/IntlMessages';
import { NavLink } from 'react-router-dom';
import { requiredMessage } from '@jumbo/constants/ErrorMessages';


const PAXGeneralModule = () => {
  const classes = useStyles();
 
  const [usersFetched, setUsersFetched] = useState(false);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [userSetting, setUserSetting] = useState([]);

  const { PAXGeneraDetelis } = useSelector(({ UsersDetelis }) => UsersDetelis);  
   
  const [totalSupply, setTotalSupply] = useState('');
  const [totalSupplyError, setTotalSupplyError] = useState('');

  const [mintedQuantity, setMintedQuantity] = useState('');
  const [mintedQuantityError, setMintedQuantityError] = useState('');

  const [blockNumber, setBlockNumber] = useState('');
  const [blockNumberError, setBlockNumberError] = useState('');

  const [nextHalvingBlocks, setNextHalvingBlocks] = useState('');
  const [nextHalvingBlocksError, setNextHalvingBlocksError] = useState('');

  const [currentBlockRewardPAX, setCurrentBlockRewardPAX] = useState('');
  const [currentBlockRewardPAXError, setCurrentBlockRewardPAXError] = useState('');

  const [PAXValue, setPAXValue] = useState('');
  const [PAXValueError, setPAXValueError] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getPAXGenera(filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setUsersFetched(true);
      }),
    );
  }, [dispatch, filterOptions, debouncedSearchTerm]);  

  const onSubmitClick = () => {    
    // if (!totalSupply) {
    //   setTotalSupplyError(requiredMessage);
    // }    
    // else if (!mintedQuantity) {
    //   setMintedQuantityError(requiredMessage);
    // }
    // else if (!blockNumber) {
    //   setBlockNumberError(requiredMessage);
    // }
    // else if (!nextHalvingBlocks) {
    //   setNextHalvingBlocksError(requiredMessage);
    // }
    // else if (!currentBlockRewardPAX) {
    //   setCurrentBlockRewardPAXError(requiredMessage);
    // }
    // else
      if (!PAXValue) {
      setPAXValueError(requiredMessage);
    }
    else {
      onPAXGeneraSave();
    }
  };

  const onPAXGeneraSave = () => {
    const PAXGeneralDetail = {
      PAXValue
    };    
      dispatch(
        updatePAXGenera({...PAXGeneralDetail }),
      );    
  };

  return (
    <div className={classes.root}>
          <Paper className={classes.paper}>   
              {/* <Box className={classes.authContent}> */}
         <form className='' style={{ display: "flex"}}>
        <div className=''>                
            <Box style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }} >
              
            <TextField
              style={{width:"55%"}}                                  
              type="text"
              label={<IntlMessages id="appModule.totalSupply" />}            
              onChange={event => setTotalSupply(event.target.value)}
              // defaultValue={PAXGeneraDetelis?.totalSupply}
              defaultValue={"21,000,000"}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
                helperText={totalSupplyError}
                disabled
            />
            <TextField
              style={{width:"55%"}}                                  
              type="text"
              label={<IntlMessages id="appModule.mintedQuantity" />}            
              onChange={event => setMintedQuantity(event.target.value)}
              defaultValue={PAXGeneraDetelis?.mintedQuantity}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
                helperText={mintedQuantityError}
                disabled
            />
            <TextField
              style={{width:"55%"}}                                  
              type="text"
              label={<IntlMessages id="appModule.blockNumber" />}            
              onChange={event => setBlockNumber(event.target.value)}
              defaultValue={PAXGeneraDetelis?.blockNumber}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
                helperText={blockNumberError}
                disabled
            />
            <TextField
              style={{width:"55%"}}                                  
              type="text"
              label={<IntlMessages id="appModule.nextHalvingBlocks" />}            
              onChange={event => setNextHalvingBlocks(event.target.value)}
              defaultValue={PAXGeneraDetelis?.nextHalvingBlocks}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
                helperText={nextHalvingBlocksError}
                disabled
            />
            
            <TextField
              style={{width:"55%"}}                                  
              type="text"
              label={<IntlMessages id="appModule.currentBlockRewardPAX" />}            
              onChange={event => setCurrentBlockRewardPAX(event.target.value)}
              defaultValue={PAXGeneraDetelis?.currentBlockRewardPAX}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
                helperText={currentBlockRewardPAXError}
                disabled
            />
            <TextField
              style={{width:"55%"}}                                  
              type="text"
              label={<IntlMessages id="appModule.userTypeCpm" />}            
              onChange={event => setPAXValue(event.target.value)}
              defaultValue={PAXGeneraDetelis?.PAXValue}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
                helperText={PAXValueError}
                
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

export default PAXGeneralModule;
