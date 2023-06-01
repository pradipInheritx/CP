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
import { Grid } from 'react-virtualized';
import GridContainer from '@jumbo/components/GridContainer';
import ThreeTable from 'redux/reducers/ThreeTable';

const FollowTableDetailView = ({ open, onCloseDialog }) => {
  const classes = useStyles();
  const { currentFollowerUsers } = useSelector(({ ThreeTable}) => ThreeTable);

  // const { name, email, status, phones, company, designation, profile_pic, starred } = currentFollowerUsers;

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <Box className={classes.userInfoRoot}>
        <Box mr={3} display="flex" alignItems="center">
          <Box mt={-2}>
            <Box display="flex" alignItems="center">
              <Typography className={classes.titleRoot}>{currentFollowerUsers?.name}</Typography>
              {/* <Box ml={1}>
                <Checkbox
                  icon={<StarBorderIcon />}
                  checkedIcon={<StarIcon style={{ color: '#FF8C00' }} />}
                  checked={starred}
                />
              </Box> */}
            </Box>
            {/* {(designation || company) && (
              <Box mt={-1}>
                {designation && <Typography className={classes.subTitleRoot}>{designation}</Typography>}
                {company && <Typography className={classes.subTitleRoot}>@{company}</Typography>}
              </Box>
            )} */}
          </Box>
        </Box>
        <Box ml="auto" mt={-2} display="flex" alignItems="center">
          <Box ml={1}>
            {/* <Tooltip title={currentFollowerUsers?.status}>
              <IconButton aria-label="filter list">
                {currentFollowerUsers?.status === 'suspended' && <Block color="primary" />}
                {currentFollowerUsers?.status === 'active' && <CheckCircleOutline color="primary" />}
              </IconButton>
            </Tooltip> */}
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
          All Detail
        </Box>
        
        
            <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
              {/* <EmailIcon /> */}
             Display Name :
              <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentFollowerUsers?.displayName}
              </Box>
                  
            </Box>
            <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
              {/* <EmailIcon /> */}
              Phone :
              <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentFollowerUsers?.phone}
              </Box>
                  
            </Box>       
          <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
              {/* <EmailIcon /> */}
              Email :
              <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentFollowerUsers?.email}
                  </Box>
                  
              </Box>  
          <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
              {/* <EmailIcon /> */}
              Referee Scrore :
              <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentFollowerUsers?.refereeScrore}
                  </Box>
                  
              </Box>  

          </Box> 
    </Dialog>
  );
};

export default FollowTableDetailView;

FollowTableDetailView.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func,
};
