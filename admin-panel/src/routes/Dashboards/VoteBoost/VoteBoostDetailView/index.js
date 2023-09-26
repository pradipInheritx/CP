import React from "react";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import CmtAvatar from "../../../../@coremat/CmtAvatar";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarIcon from "@material-ui/icons/Star";
import {useSelector} from "react-redux";
import CmtList from "../../../../@coremat/CmtList";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import ClearIcon from "@material-ui/icons/Clear";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import useStyles from "./index.style";
import { Block, CheckCircleOutline } from "@material-ui/icons";

import {Tooltip} from "@material-ui/core";
import { timeFromNow } from "@jumbo/utils/dateHelper";

const VoteBoostDetailView = ({open, onCloseDialog}) => {
  const classes = useStyles();  
const { currentVoteBoost } = useSelector(({ VoteBoost }) => VoteBoost);

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <Box className={classes.userInfoRoot}>
        <Box mr={3} display="flex" alignItems="center">
          {/* <Box className={classes.avatarView} mr={{xs: 4, md: 6}}>
            <CmtAvatar size={70} src={profile_pic} alt={name} />
          </Box> */}
          <Box mt={-2}>
            <Box display="flex" alignItems="center">
              <Typography className={classes.titleRoot}>{`${currentVoteBoost?.displayName}`}</Typography>
            </Box>
            
          </Box>
        </Box>
        <Box ml="auto" mt={-2} display="flex" alignItems="center">
          <Box ml={1}>
            <Tooltip title={"status"}>
              <IconButton aria-label="filter list">
                {currentVoteBoost?.status === false && <Block color="primary" />}
                {currentVoteBoost?.status === true && <CheckCircleOutline color="primary" />}
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
          Vote Booster Details
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          {/* <EmailIcon /> */}
          Booster Name : 
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentVoteBoost?.BoosterName}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          {/* <EmailIcon /> */}
          Price : 
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentVoteBoost?.price}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          {/* <EmailIcon /> */}
        Votes : 
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentVoteBoost?.Votes}
          </Box>
        </Box>        
      </Box>
    </Dialog>
  );
};

export default VoteBoostDetailView;

VoteBoostDetailView.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func
};
