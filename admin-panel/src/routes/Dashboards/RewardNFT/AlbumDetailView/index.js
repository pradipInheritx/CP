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
import { CardMedia, Tooltip } from '@material-ui/core';

const AlbumDetailView = ({ selectType, open, onCloseDialog }) => {
  const classes = useStyles();
  const { currentAlbum ,currentCard } = useSelector(({ RewardNFT }) => RewardNFT);

  // const { name, email, status, phones, company, designation, profile_pic, starred } = currentUser;

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <Box className={classes.userInfoRoot}>
        <Box mr={3} display="flex" alignItems="center">
          <Box className={classes.avatarView} mr={{ xs: 4, md: 6 }}>
            {/* <CmtAvatar size={70} src={currentAlbum?.profile_pic} alt={currentAlbum?.name} /> */}
          </Box>

          <Box mt={-2}>
            <Box display="flex" alignItems="center">
              <Typography className={classes.titleRoot}>{currentAlbum?.albumName}</Typography>              
            </Box>           
          </Box>
        </Box>
        <Box ml="auto" mt={-2} display="flex" alignItems="center">
          <Box ml={1}>
            {selectType=="album" && <Tooltip title={currentAlbum?.status}>
              <IconButton aria-label="filter list">
                {/* {currentAlbum?.status === 'suspended' && <Block color="primary" />}
                {currentAlbum?.status === 'active' && <CheckCircleOutline color="primary" />} */}
              </IconButton>
            </Tooltip>}            
          </Box>
          <Box ml={1}>
            <IconButton onClick={onCloseDialog}>
              <ClearIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      {selectType =="album" && <Box px={6} py={5}>
        <Box mb={5} component="p" color="common.dark">
          Album Detail
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Album Name :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentAlbum?.albumName}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Total Sets :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentAlbum?.setQunatity}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Total Cards :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentAlbum?.TotalCards}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Relative quanlity :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentAlbum?.email}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Random Card :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentAlbum?.email}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Distribution Limit :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentAlbum?.email}
          </Box>
        </Box>        
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 5 }}>
          Sets Name :
          {/* <Box ml={5}>
            <CmtList
              data={currentAlbum?.setDetails}
              renderRow={(item, index) => (
                <Box key={index} display="flex" alignItems="center">
                  <Box color="text.secondary">{item?.setName}</Box>
                  <Box ml={2} className={classes.labelRoot}>
                    {item?.setName}
                  </Box>
                </Box>
              )}
            />
          </Box> */}
          <Box ml={5} display="flex">
            {currentAlbum?.setDetails.map((item, index) => {              
              return (<Box key={index}>                                  
                  {item?.setName} {currentAlbum?.setDetails.lenght-1 !== index ? " , " :""}              
                </Box>)
            })}
          </Box>
        </Box>

        <Box display="flex"  mb={{ xs: 4, sm: 7 }}>
          Album Video :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {/* {currentAlbum?.email} */}
            <CardMedia
            component='video'
            className={classes.media}
            // image={"path/to/file/video.webm"}
            src={currentAlbum?.albumVideoUrl}
            autoPlay
          />
          </Box>
        </Box>
      </Box>}
      
    </Dialog>
  );
};

export default AlbumDetailView;

AlbumDetailView.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func,
};
