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
  const { currentAlbum ,currentCard } = useSelector(({ RewardNFT }) => RewardNFT);

  // const { name, email, status, phones, company, designation, profile_pic, starred } = currentUser;

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <Box className={classes.userInfoRoot}>
        <Box mr={3} display="flex" alignItems="center">
          <Box className={classes.avatarView} mr={{ xs: 4, md: 6 }}>
            <CmtAvatar size={70} src={currentAlbum?.profile_pic || currentCard?.profile_pic} alt={currentCard?.name || currentAlbum?.name} />
          </Box>

          <Box mt={-2}>
            <Box display="flex" alignItems="center">
              <Typography className={classes.titleRoot}>{currentCard?.name || currentAlbum?.name}</Typography>
              
            </Box>           
          </Box>
        </Box>
        <Box ml="auto" mt={-2} display="flex" alignItems="center">
          <Box ml={1}>
            {selectType=="album" && <Tooltip title={currentAlbum?.status}>
              <IconButton aria-label="filter list">
                {currentAlbum?.status === 'suspended' && <Block color="primary" />}
                {currentAlbum?.status === 'active' && <CheckCircleOutline color="primary" />}
              </IconButton>
            </Tooltip>}
            {selectType=="card" && <Tooltip title={currentCard?.status}>
              <IconButton aria-label="filter list">
                {currentCard?.status === 'suspended' && <Block color="primary" />}
                {currentCard?.status === 'active' && <CheckCircleOutline color="primary" />}
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
            {currentAlbum?.email}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Total Sets :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentAlbum?.email}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Total Cards :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentAlbum?.email}
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
          <Box ml={5}>
            <CmtList
              data={currentAlbum?.phones}
              renderRow={(item, index) => (
                <Box key={index} display="flex" alignItems="center">
                  <Box color="text.secondary">{item.phone}</Box>
                  <Box ml={2} className={classes.labelRoot}>
                    {item.label}
                  </Box>
                </Box>
              )}
            />
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Album Video :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentAlbum?.email}
          </Box>
        </Box>
      </Box>}

      {selectType =="card" && <Box px={6} py={5}>
        <Box mb={5} component="p" color="common.dark">
          Card Detail
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Card Name :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentCard?.email}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Rarity :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentCard?.email}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Collocation :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentCard?.email}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Minted Time :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentCard?.email}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Total Quanlity :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentCard?.email}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Number of Holder :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentCard?.email}
          </Box>
        </Box>                
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Card Image :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentCard?.email}
          </Box>
        </Box>
      </Box>}
    </Dialog>
  );
};

export default UserDetailView;

UserDetailView.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func,
};
