import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import GridContainer from '../../../../@jumbo/components/GridContainer';
import Grid from '@material-ui/core/Grid';
import AppTextInput from '../../../../@jumbo/components/Common/formElements/AppTextInput';
import CmtAvatar from '../../../../@coremat/CmtAvatar';
import { useDropzone } from 'react-dropzone';
import Button from '@material-ui/core/Button';
import CmtList from '../../../../@coremat/CmtList';
import IconButton from '@material-ui/core/IconButton';
import AppSelectBox from '../../../../@jumbo/components/Common/formElements/AppSelectBox';
import { emailNotValid, requiredMessage } from '../../../../@jumbo/constants/ErrorMessages';
import { useDispatch, useSelector } from 'react-redux';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import { isValidEmail } from '../../../../@jumbo/utils/commonHelper';
import { addNewUser, updateUser } from '../../../../redux/actions/Users';

const useStyles = makeStyles(theme => ({
  dialogRoot: {
    position: 'relative',
  },
  dialogTitleRoot: {
    '& .MuiTypography-h6': {
      fontSize: 16,
      color: theme.palette.common.dark,
    },
  },
}));

function NumberFormatCustom({ onChange, ...other }) {
  return (
    <NumberFormat
      {...other}
      onValueChange={values => {
        onChange(values.formattedValue);
      }}
      format="(###) ###-####"
    />
  );
}

const labels = [
  { title: 'Home', slug: 'home' },
  { title: 'Office', slug: 'office' },
  { title: 'Other', slug: 'other' },
];
const NftTierlabels = [
  { title: 'Common', slug: 'Common' },
  { title: 'Uncommon', slug: 'Uncommon' },
  { title: 'Rare', slug: 'Rare' },
  { title: 'Epic', slug: 'Epic' },
  { title: 'Legendary', slug: 'Legendary' },  
];

const splitName = user => {
  if (user) {
    const [fName, mName, lName] = user.name.split(' ');
    return [fName, lName ? mName + ' ' + lName : mName];
  }

  return ['', ''];
};

const AddEditUser = ({ open, onCloseDialog,selectType }) => {
  const classes = useStyles();
  const { currentUser } = useSelector(({ usersReducer }) => usersReducer);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profile_pic, setProfile_pic] = useState('');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [phones, setPhones] = useState([{ phone: '', label: 'home' }]);
  const [firstNameError, setFirstNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [albumName, setAlbumName] = useState('');
  const [albumNameError, setAlbumNameError] = useState('');

  const [totalSets, setTotalSets] = useState('');
  const [totalSetsError, setTotalSetsError] = useState('');

  const [setsName, setSetsName] = useState([{sets:""}]);
  const [setsNameError, setSetsNameError] = useState('');

  const [albumVideo, setAlbumVideo] = useState('');
  const [albumVideoError, setAlbumVideoError] = useState('');

  const [distributionLimit, setDistributionLimit] = useState('');
  const [distributionLimitError, setDistributionLimitError] = useState('');

  const [cardName, setCardName] = useState('');
  const [cardNameError, setCardNameError] = useState('');

  const [cardImgae, setCardImgae] = useState('');
  const [cardImgaeError, setCardImgaeError] = useState('');

  const [nftTier, setNftTier] = useState('');
  const [nftTierError, setNftTierError] = useState('');

  const [quanlity, setQuanlity] = useState('');
  const [quanlityError, setQuanlityError] = useState('');

  const [collocation, setCollocation] = useState('');
  const [collocationError, setCollocationError] = useState('');

  const [selectSets, setSelectSets] = useState('');
  const [selectSetsError, setSelectSetsError] = useState('');
  

  const { getRootProps, getInputProps } = useDropzone({
    accept: `${selectType=="album"?'video/mp4,video/mkv,video/x-m4v,video/*':'image/*'}`,
    onDrop: acceptedFiles => {
      setProfile_pic(URL.createObjectURL(acceptedFiles[0]));
    },
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      const [fName, lName] = splitName(currentUser);
      setFirstName(fName);
      setLastName(lName);
      setProfile_pic(currentUser.profile_pic);
      setEmail(currentUser.email);
      setCompany(currentUser.company);
      setDesignation(currentUser.designation);
      setPhones(currentUser.phones);
    }    
  }, [currentUser]);

 

  const onSetsNameAdd = (name, index) => {
    const updatedList = [...setsName];
    updatedList[index].sets = name.target.value;
    setSetsName(updatedList);
    setSetsNameError('');
  };

  const onSetsNameRowRemove = index => {
    const updatedList = [...setsName];
    updatedList.splice(index, 1);
    setSetsName(updatedList);
  };
const onSetsNameRowAdd = () => {
    setSetsName(setsName.concat({ sets: ''}));
  };


  // const onPhoneNoAdd = (number, index) => {
  //   const updatedList = [...phones];
  //   updatedList[index].phone = number;
  //   setPhones(updatedList);
  //   setPhoneError('');
  // };

  // const onPhoneRowRemove = index => {
  //   const updatedList = [...phones];
  //   updatedList.splice(index, 1);
  //   setPhones(updatedList);
  // };

  
  // const onPhoneRowAdd = () => {
  //   setPhones(phones.concat({ phone: '', label: 'home' }));
  // };



 const onCardSubmit = () => {
    const CardDetail = {
      profile_pic,
      cardName,
      nftTier,
      quanlity,
      selectSets,
      collocation,
    };
   console.log(CardDetail,"submitData")
 }
  
 const onAlbumSubmit = () => {
    const AlbumDetail = {
      profile_pic,
      albumName,
      totalSets,
      setsName,
      distributionLimit,      
    };
   console.log(AlbumDetail,"submitData")
}

  // const onSubmitClick = () => {
  //   const phoneNumbers = phones.filter(item => item.phone.trim());
  //   if (!firstName) {
  //     setFirstNameError(requiredMessage);
  //   } else if (!email) {
  //     setEmailError(requiredMessage);
  //   } else if (!isValidEmail(email)) {
  //     setEmailError(emailNotValid);
  //   } else if (phoneNumbers.length === 0) {
  //     setPhoneError(requiredMessage);
  //   } else {
  //     onUserSave(phoneNumbers);
  //   }
  // };

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

  const isPhonesMultiple = phones.length > 1;
  const isSetsNameMultiple = setsName.length > 1;

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      {selectType == "card"?<DialogTitle className={classes.dialogTitleRoot}>{currentUser ? 'Edit Card Details' : 'Create New Card'}</DialogTitle>
      :<DialogTitle className={classes.dialogTitleRoot}>{currentUser ? 'Edit Album Details' : 'Create New Album'}</DialogTitle>}
      <DialogContent dividers>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" mb={{ xs: 6, md: 5 }}>
          <Box {...getRootProps()} mr={{ xs: 0, md: 5 }} mb={{ xs: 3, md: 0 }} className="pointer">
            <input {...getInputProps()} />
            <CmtAvatar size={70} src={profile_pic} />
          </Box>
          <GridContainer>
            {selectType == "album" && <Grid item xs={12} sm={12}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="Album Name"
                value={albumName}
                onChange={e => {
                  setAlbumName(e.target.value);
                  setAlbumNameError('');
                }}
                helperText={albumNameError}
              />
            </Grid>}
            {selectType == "card" &&
              <>
              <Grid item xs={12} sm={12}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="Card Name"
                value={cardName}
                onChange={e => {
                  setCardName(e.target.value);
                  setCardNameError('');
                }}
                helperText={cardNameError}
              />
              </Grid>              
              </>
            }
          </GridContainer>
        </Box>

        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" mb={{ xs: 6, md: 5 }}>
          <GridContainer>
            {selectType == "album" &&
              <>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="Total Sets"
                value={totalSets}
                onChange={e => {
                  setTotalSets(e.target.value);
                  setTotalSetsError('');
                }}
                helperText={totalSetsError}
              />
              </Grid>
              <Grid item xs={12} sm={6}>
                <AppTextInput
                  fullWidth
                  variant="outlined"
                  label="Distribution Limit"
                  value={distributionLimit}
                  onChange={e => {
                    setDistributionLimit(e.target.value);
                    setDistributionLimitError('');
                  }}
                  helperText={distributionLimitError}
                />
                </Grid> 
            </>
            }
            
            {selectType == "card" &&
              <>
               <Grid item xs={12} sm={6}>
              <AppSelectBox
                  fullWidth
                  data={NftTierlabels}
                  label="Select Nft Tier"
                  valueKey="slug"
                  variant="outlined"
                  labelKey="title"
                  value={nftTier}
                onChange={e => {
                  setNftTier(e.target.value);
                  setNftTierError('');
                }}
                helperText={nftTierError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <AppSelectBox
                  fullWidth
                  data={NftTierlabels}
                  label="Select Collocation"
                  valueKey="slug"
                  variant="outlined"
                  labelKey="title"
                  value={collocation}
                onChange={e => {
                  setCollocation(e.target.value);
                  setCollocationError('');
                }}
                helperText={collocationError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <AppSelectBox
                  fullWidth
                  data={NftTierlabels}
                  label="Select Sets"
                  valueKey="slug"
                  variant="outlined"
                  labelKey="title"
                  value={selectSets}
                onChange={e => {
                  setSelectSets(e.target.value);
                  setSelectSetsError('');
                }}
                helperText={selectSetsError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="Total Quanlity"
                value={quanlity}
                onChange={e => {
                  setQuanlity(e.target.value);
                  setQuanlityError('');
                }}
                helperText={quanlityError}
              />
              </Grid>
              </>              
            }            
          </GridContainer>
        </Box>
        {selectType == "album" && 
        <>
        <CmtList
          data={setsName}
          renderRow={(item, index) => (
            <GridContainer style={{ marginBottom: 12 }} key={index}>
              <Grid item xs={12} sm={isSetsNameMultiple ? 10 : 12}>
                <AppTextInput
                  fullWidth
                  variant="outlined"
                  label="Add Sets"
                  value={item.sets}
                  onChange={name => onSetsNameAdd(name, index)}
                  helperText={setsNameError}
                  // InputProps={{
                  //   inputComponent: NumberFormatCustom,
                  // }}
                />
              </Grid>              
              {index > 0 && (
                <Grid item xs={2} sm={2}>
                  <IconButton onClick={() => onSetsNameRowRemove(index)}>
                    <CancelIcon />
                  </IconButton>
                </Grid>
              )}
            </GridContainer>
          )}
        />
        <Box
          mb={{ xs: 6, md: 5 }}
          display="flex"
          alignItems="center"
          onClick={onSetsNameRowAdd}
          className="pointer"
          color="primary.main">
          <AddCircleOutlineIcon />
          <Box ml={2}>Add More</Box>
          </Box>
          </>
        }        
        <Box display="flex" justifyContent="flex-end" mb={4}>
          <Button onClick={onCloseDialog}>Cancel</Button>
          <Box ml={2}>
            <Button variant="contained" color="primary" onClick={
             selectType=="card"? onCardSubmit :onAlbumSubmit
            }>
              Save
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditUser;

AddEditUser.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func,
};
