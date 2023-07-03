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
import { emailNotValid, imageMessage, requiredMessage } from '../../../../@jumbo/constants/ErrorMessages';
import { useDispatch, useSelector } from 'react-redux';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import { isValidEmail } from '../../../../@jumbo/utils/commonHelper';
import { addNewRewardCard, updateRewardCard } from '../../../../redux/actions/RewardNft';
import { MenuItem } from '@material-ui/core';

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
const NftTierlabels = [
  { title: 'COMMON', slug: 'COMMON' },
  { title: 'UNCOMMON', slug: 'UNCOMMON' },
  { title: 'RARE', slug: 'RARE' },
  { title: 'EPIC', slug: 'EPIC' },
  { title: 'LEGENDARY', slug: 'LEGENDARY' },  
];

const splitName = user => {
  if (user) {
    const [fName, mName, lName] = user.name.split(' ');
    return [fName, lName ? mName + ' ' + lName : mName];
  }

  return ['', ''];
};

const AddEditCard = ({ open, onCloseDialog,selectType }) => {
  const classes = useStyles();
  // const { currentUser } = useSelector(({ usersReducer }) => usersReducer);
  const { currentAlbum,currentCard , albumList } = useSelector(({ RewardNFT }) => RewardNFT);

  const [profile_pic, setProfile_pic] = useState('');







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
  
  const [cardStatus, setCardStatus] = useState('');
  const [setsNames, setSetsNames] = useState('');
  
  const [cardImgaeSend, setCardImgaeSend] = useState('');
  const [cardImgaeShow, setCardImgaeShow] = useState('');
  
  const [updateAlbumName, setUpdateAlbumName] = useState('');
  const [updateSetName, setUpdateSetName] = useState('');

console.log(updateAlbumName,updateSetName,"updateSetName")
  const { getRootProps, getInputProps } = useDropzone({
    accept:'image/*',
    onDrop: acceptedFiles => {    
      setCardImgaeShow(URL.createObjectURL(acceptedFiles[0]));
      setCardImgaeSend(acceptedFiles[0]);
      setCardImgaeError("")
    },
  });


  console.log(currentAlbum,"currentAlbum")
  const dispatch = useDispatch();
  
  useEffect(() => {   
    console.log(currentCard,"currentCard")
    if (currentCard) {
      setCardName(currentCard?.cardName)
      setCardImgae(currentCard?.cardImageUrl)
      setNftTier(currentCard?.cardType)
      setCardStatus(currentCard?.cardStatus)
      setCollocation(currentCard?.albumId)
      setQuanlity(currentCard?.totalQuantity)
      // setSetsNames(albumList?.filter((item,index ) => item?.albumId == currentCard?.albumId && item))
      setSelectSets(currentCard?.setId)
    }    
  }, [currentCard]);

useEffect(() => {       
  if (currentCard)
  {
    albumList && albumList.filter((item, index) => {
      if (item?.albumId == currentCard?.albumId) {
      setSetsNames(item.setDetails)
      // setCollocation(item?.albumName)
      // item.setDetails.filter((childItem,inx) => {
      //   if (childItem?.setId == currentCard?.setId) {
      //     setSelectSets(childItem?.setName)
      //   }
      // })
    }
    })}
  }, [albumList,currentCard]);

console.log(setsNames,selectSets ,collocation,nftTier,"CollocationselectSets" )
  
  const onSubmitClick = () => {    
    if (!cardName) {
      setCardNameError(requiredMessage);
    } else if (!nftTier) {
      setNftTierError(requiredMessage);
    } else if (!quanlity) {
      setQuanlityError(requiredMessage);
    }
    else if (currentCard ? !cardImgae : !cardImgaeShow) {      

      console.log(cardImgae,cardImgaeShow ,"cardImgaeShow")
      setCardImgaeError(imageMessage);
    }
    else if (!collocation) {
      setCollocationError(requiredMessage);
    }
    else if (!selectSets) {
      setSelectSetsError(requiredMessage);
    }    
    else {
      onCardSubmit();
    }
  };

  const onCardSubmit = () => {

    // const getName = setsNames.find((item, index) => {
    //   if (item.setId == selectSets) {
    //     const name =item?.setName
    //     return name
    //   }
    // })
    
    // console.log(getName ,"setNameCheck")

     const CardDetail = {
    albumId: collocation,
    albumName:updateAlbumName,
    setId: selectSets,
    cardName: cardName,
    setName: updateSetName,    
    cardType: nftTier,
    totalQuantity: quanlity,
    cardStatus: cardStatus || "Active",
    cardImageUrl: cardImgae,    
    cardVideoUrl: ""
    }      
    const cardImageUrl=cardImgaeSend
    
      if (currentCard) {
      dispatch(
        updateRewardCard(currentCard?.cardId,{ ...currentCard, ...CardDetail },cardImageUrl, () => {
          onCloseDialog();
        }),
      );
        console.log({ ...currentCard, ...CardDetail },"submitData")
    } else {
      dispatch(
        addNewRewardCard(CardDetail, cardImageUrl,() => {
          onCloseDialog();
        }),
      );
        console.log({...CardDetail},"submitData")
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
  //       updateRewardCard({ ...currentUser, ...userDetail }, () => {
  //         onCloseDialog();
  //       }),
  //     );
  //   } else {
  //     dispatch(
  //       addNewRewardCard(userDetail, () => {
  //         onCloseDialog();
  //       }),
  //     );
  //   }
  // };
  
  const handelCollocationName = (e) => {
    setCollocation(e.target.value)
     albumList && albumList.filter((item, index) => {
       if (item?.albumId == e.target.value) {
         setUpdateAlbumName(item?.albumName)
          setSetsNames(item?.setDetails)
      // setCollocation(item?.albumName)
      // item.setDetails.filter((childItem,inx) => {
      //   if (childItem?.setId == currentCard?.setId) {
      //     setSelectSets(childItem?.setName)
      //   }
      // })
    }
    })    
  }
  const handelSetName = (e)=>{
    setSelectSets(e.target.value);
    setsNames.map((item,index) => {
      if (item?.setId == e.target.value) {
        setUpdateSetName(item?.setName)
      }
    })
  }

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}
    maxWidth="lg"
    >
      <DialogTitle className={classes.dialogTitleRoot}>{currentCard ? 'Edit Card Details' : 'Create New Card'}</DialogTitle>      
      <DialogContent dividers      
      >
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" mb={{ xs: 6, md: 5 }}>
          <Box {...getRootProps()} mr={{ xs: 0, md: 5 }} mb={{ xs: 3, md: 0 }} className="pointer">
            <input {...getInputProps()} />
            <CmtAvatar size={70} src={cardImgae} />
            {cardImgaeError != "" ? <span style={{color:"red",margin:"10px"}}>{cardImgaeError}</span>:""}
          </Box>
          <GridContainer>          
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
          </GridContainer>
        </Box>

        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" mb={{ xs: 6, md: 5 }}>
          <GridContainer>                       
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
                  data={albumList}
                  label="Select Collocation"
                  valueKey="albumName"
                  variant="outlined"
                  labelKey="title"
                  value={collocation}
                  onChange={e => {
                  // setCollocation(e.target.value);
                    handelCollocationName(e,)
                  setCollocationError('');
                  }}
                renderRow={(item, index) => (
                    <MenuItem key={index} value={item?.albumId}>
                      {item.albumName}
                    </MenuItem>
                  )}
                helperText={collocationError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <AppSelectBox
                  fullWidth
                  data={setsNames || []}
                  label="Select Sets"
                  // valueKey="slug"
                  variant="outlined"
                  labelKey="title"
                  value={selectSets}
                onChange={e => {

                  handelSetName(e)                  
                  console.log(e.target,"e.target")
                  setSelectSetsError('');
                }}
                renderRow={(item, index) => (
                    <MenuItem key={index} value={item?.setId} name={item?.setName}>
                      {item.setName}
                    </MenuItem>
                  )}
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
          </GridContainer>
        </Box>              
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

export default AddEditCard;

AddEditCard.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func,
};
