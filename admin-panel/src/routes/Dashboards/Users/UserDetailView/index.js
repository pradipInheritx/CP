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

const UserDetailView = ({ open, onCloseDialog }) => {
  const classes = useStyles();
  const { currentUserDetelis } = useSelector(({ UsersDetelis }) => UsersDetelis);

  const { name, email, status, phones, company, designation, profile_pic, starred } = currentUserDetelis;

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <Box className={classes.userInfoRoot}>
        <Box mr={3} display="flex" alignItems="center">
          <Box className={classes.avatarView} mr={{ xs: 4, md: 6 }}>
            <CmtAvatar size={70} src={currentUserDetelis?.avatar} alt={currentUserDetelis?.displayName} />
          </Box>

          <Box mt={-2}>
            <Box display="flex" alignItems="center">
              <Typography className={classes.titleRoot}>{currentUserDetelis?.displayName}</Typography>
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
            <Tooltip title={status}>
              <IconButton aria-label="filter list">
                {currentUserDetelis?.status === 'suspended' && <Block color="primary" />}
                {currentUserDetelis?.status === 'active' && <CheckCircleOutline color="primary" />}
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
          User Detail
        </Box>
        
        
            <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
              {/* <EmailIcon /> */}
              User ID :
              <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentUserDetelis?.uid}
              </Box>
                  
            </Box>
            <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
              {/* <EmailIcon /> */}
              Display Name :
              <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentUserDetelis?.displayName}
              </Box>
                  
            </Box>
            <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
              {/* <EmailIcon /> */}
              Name :
              <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentUserDetelis?.firstName  + currentUserDetelis?.lastName}
              </Box>                  
        </Box>
        
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
              {/* <EmailIcon /> */}
              Country :
              <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentUserDetelis?.country}
              </Box>                  
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
              {/* <EmailIcon /> */}
              Address :
              <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentUserDetelis?.address}
              </Box>                  
        </Box>        
            <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
              {/* <EmailIcon /> */}
              Email :
              <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentUserDetelis?.email}
                  </Box>
                  
              </Box>              
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 5 }}>
          {/* <PhoneIcon /> */} Phone :        
            <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentUserDetelis?.phone}
                  </Box>        
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 5 }}>
          {/* <PhoneIcon /> */} Plan :        
            <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentUserDetelis?.Plan}
                  </Box>        
        </Box>
         <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
              {/* <EmailIcon /> */}
              Unique Referral Link :
              <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentUserDetelis?.Unique_Referral_Link}
                  </Box>
                  
          </Box>  
         <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
              {/* <EmailIcon /> */}
              Parent :
              <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentUserDetelis?.Parent}
                  </Box>
                  
          </Box>  
          <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
              {/* <EmailIcon /> */}
              Quantity of Children :
              <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentUserDetelis?.Quantity_of_Children}
                  </Box>
                  
              </Box>  
          <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
              {/* <EmailIcon /> */}
              Chosen Foundation :
              <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentUserDetelis?.ChosenFoundation}
                  </Box>
                  
              </Box>  
          <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
              {/* <EmailIcon /> */}
              Chosen Foundation :
              <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentUserDetelis?.Chosen_Foundation}
                  </Box>
                  
              </Box>  
          <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
              {/* <EmailIcon /> */}
              Registration Time :
              <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentUserDetelis?.Registration_Time}
                  </Box>
                  
              </Box>  
          <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
              {/* <EmailIcon /> */}
              Last Login Time :
              <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentUserDetelis?.Last_Login_Time}
                  </Box>
                  
              </Box>  
          <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
              {/* <EmailIcon /> */}
              2 Factor Authentication :
              <Box ml={5} color="primary.main" component="p" className="pointer d-block">
                {currentUserDetelis?.two_Factor_Authentication}
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
