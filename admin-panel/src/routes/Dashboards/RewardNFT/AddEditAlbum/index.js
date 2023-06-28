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
import { emailNotValid,videoMessage, requiredMessage } from '../../../../@jumbo/constants/ErrorMessages';
import { useDispatch, useSelector } from 'react-redux';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import { isValidEmail } from '../../../../@jumbo/utils/commonHelper';
import { addNewRewardAlbum, updateRewardAlbum } from '../../../../redux/actions/RewardNft';

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
  { title: 'Common', slug: 'Common' ,  },
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

const AddEditAlbum = ({ open, onCloseDialog,selectType }) => {
  const classes = useStyles();
  // const { currentUser } = useSelector(({ usersReducer }) => usersReducer);
  const { currentAlbum,currentCard } = useSelector(({ RewardNFT }) => RewardNFT);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  // const [profile_pic, setProfile_pic] = useState('');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [phones, setPhones] = useState([{ phone: '', label: 'home' }]);
  const [firstNameError, setFirstNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

// const [profile_pic, setProfile_pic] = useState('');
//   const [profile_picError, setProfile_picError] = useState('');
  
  const [albumName, setAlbumName] = useState('');
  const [albumNameError, setAlbumNameError] = useState('');

  const [totalSets, setTotalSets] = useState('');
  const [totalSetsError, setTotalSetsError] = useState('');

  const [setsName, setSetsName] = useState([]);
  const [setsNameError, setSetsNameError] = useState([]);

  const [albumVideo, setAlbumVideo] = useState('');
  const [albumVideoError, setAlbumVideoError] = useState('');

  const [albumVideoShow, setAlbumVideoShow] = useState("");
  

  const [albumVideoSend, setAlbumVideoSend] = useState('');
  

  const { getRootProps, getInputProps } = useDropzone({

    accept: `${selectType=="album"?'video/mp4,video/mkv,video/x-m4v,video/*':'image/*'}`,
    onDrop: acceptedFiles => {      
      setAlbumVideo(URL.createObjectURL(acceptedFiles[0]));
      setAlbumVideoSend(acceptedFiles[0]);
      setAlbumVideoError("");
    },
  });

const  validRegExp = new RegExp(/^\d*\.?\d*$/);
  console.log(currentAlbum,"currentAlbum")
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentAlbum) {
      setAlbumName(currentAlbum?.albumName)
      setAlbumVideo(currentAlbum?.albumVideoUrl)
      setTotalSets(currentAlbum?.setQuantity || currentAlbum?.setQunatity)      
      setSetsName(currentAlbum?.setDetails)      
    }    
  }, [currentAlbum]);

 

  const onSetsNameAdd = (name, index) => {
    const updatedList = [...setsName];
    updatedList[index].setName = name.target.value;
    setSetsName(updatedList);
    setSetsNameError('');
  };

  const onSetsNameRowRemove = index => {
    const updatedList = [...setsName];
    updatedList.splice(index, 1);
    setSetsName(updatedList);
  };
  const onSetsNameRowAdd = () => {

    const sequenceNumber=setsName.length
    if (sequenceNumber < 5) {
    setSetsName(setsName.concat({ setName: '',sequence:sequenceNumber + 1}));    
    } else {
      alert("can not add more then 5")
    }  
  };
  const onSubmitClick = () => { 
    const allsetsNameError = [...setsNameError]
    const setsNameCheck = setsName?.every((item,index) => {
      if (item.setName == "") {   
        allsetsNameError[index] = requiredMessage
        setSetsNameError(allsetsNameError)
          // return false
      }
      else {
        return true
      }      
    });
    console.log(setsNameCheck,"setsNameCheck")
    if (!albumName) {
      setAlbumNameError(requiredMessage);
    } else if (!albumVideo) {
      setAlbumVideoError(videoMessage);
    }  else if (!totalSets) {
      setTotalSetsError(requiredMessage);
    }
     else if (!setsNameCheck) {
      // setPhoneError(requiredMessage);
      console.log("i am working")
    }
    else {
      // onUserSave(phoneNumbers);
      onAlbumSubmit()
    }
  };

console.log(albumNameError,albumVideoError,totalSetsError,setsNameError,"allError")

 const onAlbumSubmit = () => {
    const AlbumDetail = {      
      albumName:albumName,
      setQunatity:totalSets,
      setDetails:setsName,            
    albumImageUrl: "",
    albumVideoUrl: albumVideo,
    };
   const videoUrl = albumVideoSend
   console.log(currentAlbum,"submitData")   
     if (currentAlbum) {
      dispatch(
        updateRewardAlbum(currentAlbum?.albumId,AlbumDetail,videoUrl, () => {
          onCloseDialog();
        }),
      );
    } else {
      dispatch(
        addNewRewardAlbum(AlbumDetail,videoUrl, () => {
          onCloseDialog();
        }),
      );
    }
}

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
  //       updateRewardAlbum({ ...currentUser, ...userDetail }, () => {
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
  
  const isSetsNameMultiple = setsName.length > 1;

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}
    maxWidth="lg"
    >      
        <DialogTitle className={classes.dialogTitleRoot}>{currentAlbum ? 'Edit Album Details' : 'Create New Album'}</DialogTitle>      
      <DialogContent dividers      
      >
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" mb={{ xs: 6, md: 5 }}>
          <Box {...getRootProps()} mr={{ xs: 0, md: 5 }} mb={{ xs: 3, md: 0 }} className="pointer">
            <input {...getInputProps()} />
            <CmtAvatar size={70} src={albumVideo} />
            {albumVideoError != "" ? <span style={{color:"red",margin:"10px"}}>{albumVideoError}</span>:""}
          </Box>
          <GridContainer>
            <Grid item xs={12} sm={12}>
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
                error={albumNameError || ""}
              />
            </Grid>           
          </GridContainer>
        </Box>

        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" mb={{ xs: 6, md: 5 }}>
          <GridContainer>
            
            <Grid item xs={12} sm={12}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="Total Sets"
                value={totalSets}
                onChange={e => {
               var finalValue = validRegExp.test(e.target.value);
                if(finalValue)setTotalSets(e.target.value);                  
                  setTotalSetsError('');
                }}
                helperText={totalSetsError}
              />
            </Grid>
              {/* <Grid item xs={12} sm={6}>
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
                </Grid>  */}                                            
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
                  value={item.setName}
                  onChange={name => onSetsNameAdd(name, index)}
                  helperText={setsNameError[index]}
                  error={setsNameError[index] || ""}
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
          <Box ml={2}>{setsName.length > 0 ? "Add More" :"Add Set"}</Box>
          </Box>
          </>
        }        
        <Box display="flex" justifyContent="flex-end" mb={4}>
          <Button onClick={onCloseDialog}>Cancel</Button>
          <Box ml={2}>
            <Button variant="contained" color="primary" onClick={onSubmitClick}>
              Save
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditAlbum;

AddEditAlbum.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func,
};
