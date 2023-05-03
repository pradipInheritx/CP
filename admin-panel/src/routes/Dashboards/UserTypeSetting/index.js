import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Paper, Table, TableCell, TableContainer, TableRow, TextField } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUsers, setCurrentUser ,getUserSetting} from '../../../redux/actions/UsersDetelis';

import ConfirmDialog from '../../../@jumbo/components/Common/ConfirmDialog';
import { useDebounce } from '../../../@jumbo/utils/commonHelper';
import useStyles from './index.style';
import GridContainer from '@jumbo/components/GridContainer';
import { Grid } from 'react-virtualized';
import AppTextInput from '@jumbo/components/Common/formElements/AppTextInput';
import IntlMessages from '@jumbo/utils/IntlMessages';
import { NavLink } from 'react-router-dom';


const UsersModule = () => {
  const classes = useStyles();
  const [userSetting, setUserSetting] = useState([]);
  const { usersDeteliSettings } = useSelector(({ UsersDetelis }) => UsersDetelis);  
   
  const [given_CMP_Vote, setGiven_CMP_Vote] = useState('');
  const [given_CMP_VoteError, setGiven_CMP_VoteError] = useState('');
  
  const [weight_for_SVI, setWeight_for_SVI] = useState('');
  const [weight_for_SVIError, setWeight_for_SVIError] = useState('');
  
  const [perEachType, setPerEachType] = useState('');
  const [perEachTypeError, setPerEachTypeError] = useState('');

  const [chairman, setChairman] = useState('');
  const [chairmanError, setChairmanError] = useState('');

    const [minister, setMinister] = useState('');
  const [ministerError, setMinisterError] = useState('');

    const [ambassador, setAmbassador] = useState('');
  const [ambassadorError, setAmbassadorError] = useState('');
    
  const [counsel, setCounsel] = useState('');
  const [counselError, setCounselError] = useState('');
  
  const [speaker, setSpeaker] = useState('');
  const [speakerError, setSpeakerError] = useState('');  
  
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ name: '' });
  const [usersFetched, setUsersFetched] = useState(false);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getUserSetting(filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setUsersFetched(true);
      }),
    );
  }, [dispatch, filterOptions, debouncedSearchTerm]);

  useEffect(() => {
  setUserSetting(usersDeteliSettings)
  }, [dispatch,usersDeteliSettings]);

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    dispatch(setCurrentUser(null));
  };

  const handleConfirmDelete = () => {
    setOpenConfirmDialog(false);
    dispatch(deleteUser(selectedUser.id));
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
  };

  const onSubmitClick = () => {    
    // if (!firstName) {
    //   setFirstNameError(requiredMessage);
    // } else if (!email) {
    //   setEmailError(requiredMessage);
    // } else if (!isValidEmail(email)) {
    //   setEmailError(emailNotValid);
    // } else if (phoneNumbers.length === 0) {
    //   setPhoneError(requiredMessage);
    // } else {
    //   onUserSave(phoneNumbers);
    // }
  };

  // const onUserSave = phoneNumbers => {
  //   const userDetail = {
  //     profile_pic,
  //     name: `${firstName} ${lastName}`,
  //     email,
  //     phones: phoneNumbers,
  //     company,
  //     designation,
  //   };

  //   if (currentUser) {
  //     dispatch(
  //       updateUser({ ...currentUser, ...userDetail }, () => {
  //         onCloseDialog();
  //       }),
  //     );
  //   } else {
  //     dispatch(
  //       addNewUser(userDetail, () => {
  //         onCloseDialog();
  //       }),
  //     );
  //   }
  // };





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
              label={<IntlMessages id="appModule.given_CMP_Vote" />}            
              onChange={event => setGiven_CMP_Vote(event.target.value)}
              defaultValue={given_CMP_Vote}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
            />

            <TextField
            style={{width:"55%"}}
              type="text"
              label={<IntlMessages id="appModule.weight_for_SVI" />}              
              onChange={event => setWeight_for_SVI(event.target.value)}
              defaultValue={weight_for_SVI}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
            />
                          
            <TextField
            style={{width:"55%"}}
              type="text"
              label={<IntlMessages id="appModule.per_Each_Type" />}              
              onChange={event => setPerEachType(event.target.value)}
              defaultValue={perEachType}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
              />
              
            <TextField
            style={{width:"55%"}}
              type="text"
              label={<IntlMessages id="appModule.chairman" />}          
              onChange={event => setChairman(event.target.value)}
              defaultValue={chairman}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
            />
                          
            <TextField
            style={{width:"55%"}}
              type="text"
              label={<IntlMessages id="appModule.ambassador" />}              
              onChange={event => setAmbassador(event.target.value)}
              defaultValue={ambassador}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
            />
                          
            <TextField
            style={{width:"55%"}}
              type="text"
              label={<IntlMessages id="appModule.minister" />}              
              onChange={event => setMinister(event.target.value)}
              defaultValue={minister}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
            />
                          
            <TextField
            style={{width:"55%"}}
              type="text"
              label={<IntlMessages id="appModule.counsel" />}              
              onChange={event => setCounsel(event.target.value)}
              defaultValue={counsel}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
            />
                          
            <TextField
            style={{width:"55%"}}
              type="text"
              label={<IntlMessages id="appModule.speaker" />}              
              onChange={event => setSpeaker(event.target.value)}
              defaultValue={speaker}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
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

      <ConfirmDialog
        open={openConfirmDialog}
        title={`Confirm delete ${selectedUser.name}`}
        content={'Are you sure, you want to  delete this user?'}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default UsersModule;
