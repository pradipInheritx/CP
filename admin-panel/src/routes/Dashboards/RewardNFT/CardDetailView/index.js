import React from 'react';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import CmtAvatar from '../../../../@coremat/CmtAvatar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import { useSelector } from 'react-redux';
import CmtList from '../../../../@coremat/CmtList';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import ClearIcon from '@material-ui/icons/Clear';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import useStyles from './index.style';
import { Block, CheckCircleOutline } from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';

const UserDetailView = ({ selectType, open, onCloseDialog }) => {
  const classes = useStyles();
  const { currentAlbum ,currentCard ,albumList} = useSelector(({ RewardNFT }) => RewardNFT);

  // const { name, email, status, phones, company, designation, profile_pic, starred } = currentUser;

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <Box className={classes.userInfoRoot}>
        <Box mr={3} display="flex" alignItems="center">
          {/* <Box className={classes.avatarView} mr={{ xs: 4, md: 6 }}>
            <CmtAvatar size={70} src={currentCard?.cardImageUrl} alt={currentCard?.name} />
          </Box> */}

          <Box mt={-2}>
            <Box display="flex" alignItems="center">
              <Typography className={classes.titleRoot}>{currentCard?.cardName}</Typography>
              
            </Box>           
          </Box>
        </Box>
        <Box ml="auto" mt={-2} display="flex" alignItems="center">
          <Box ml={1}>
            
            <Tooltip title={currentCard?.status}>
              <IconButton aria-label="filter list">
                {currentCard?.cardStatus === 'Inactive' && <Block color="primary" />}
                {currentCard?.cardStatus === 'Active' && <CheckCircleOutline color="primary" />}
              </IconButton>
            </Tooltip>
          </Box>
          <Box ml={1}>
            <IconButton onClick={onCloseDialog}>
              <ClearIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>      
      <Box px={6} py={5}>
        <Box mb={5} component="p" color="common.dark">
          Card Detail
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Card Name :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentCard?.cardName}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Rarity :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentCard?.rarity}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Collocation :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {albumList.filter((item, index) => {
              if (item.albumId == currentCard?.albumId) {
                return item.albumName
              }
            })}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Minted Time :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentCard?.MintedTime}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Total Quanlity :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentCard?.totalQuantity}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Number of Holder :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentCard?.noOfCardHolder}
          </Box>
        </Box>                
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Card Image :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            <img src={currentCard?.cardImageUrl} alt="" width={250}/>            
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UserDetailView;

UserDetailView.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func,
};
