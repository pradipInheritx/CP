import React from "react";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import CmtAvatar from "../../../../@coremat/CmtAvatar";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarIcon from "@material-ui/icons/Star";
import { useSelector } from "react-redux";
import CmtList from "../../../../@coremat/CmtList";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import ClearIcon from "@material-ui/icons/Clear";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import useStyles from "./index.style";
import { Block, CheckCircleOutline } from "@material-ui/icons";
import { Tooltip } from "@material-ui/core";
import { Grid } from "react-virtualized";
import GridContainer from "@jumbo/components/GridContainer";

const UserDetailView = ({ open, onCloseDialog }) => {
  const classes = useStyles();
  const { currentUserDetelis } = useSelector(
    ({ UsersDetelis }) => UsersDetelis
  );
  const {
    name,
    email,
    status,
    phones,
    company,
    designation,
    profile_pic,
    starred
  } = currentUserDetelis;

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <Box className={classes.userInfoRoot}>
        <Box mr={3} display="flex" alignItems="center">
          <Box className={classes.avatarView} mr={{ xs: 4, md: 6 }}>
            <CmtAvatar
              size={70}
              src={currentUserDetelis?.avatar}
              alt={currentUserDetelis?.userName}
            />
          </Box>

          <Box mt={-2}>
            <Box display="flex" alignItems="center">
              <Typography className={classes.titleRoot}>
                {currentUserDetelis?.userName}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box ml="auto" mt={-2} display="flex" alignItems="center">
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
          User ID :
          <Box
            ml={5}
            color="primary.main"
            component="p"
            className="pointer d-block"
          >
            {currentUserDetelis?.userId ? currentUserDetelis?.userId : "-"}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          User Name :
          <Box
            ml={5}
            color="primary.main"
            component="p"
            className="pointer d-block"
          >
            {currentUserDetelis?.userName ? currentUserDetelis?.userName : "-"}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Email :
          <Box
            ml={5}
            color="primary.main"
            component="p"
            className="pointer d-block"
          >
            {currentUserDetelis?.email ? currentUserDetelis?.email : "-"}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Country :
          <Box
            ml={5}
            color="primary.main"
            component="p"
            className="pointer d-block"
          >
            {currentUserDetelis?.Country ? currentUserDetelis?.Country : "-"}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Game Title :
          <Box
            ml={5}
            color="primary.main"
            component="p"
            className="pointer d-block"
          >
            {currentUserDetelis?.GameTitle
              ? currentUserDetelis?.GameTitle
              : "-"}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          TotalCPM :
          <Box
            ml={5}
            color="primary.main"
            component="p"
            className="pointer d-block"
          >
            {currentUserDetelis?.TotalCPM ? currentUserDetelis?.TotalCPM : "-"}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 5 }}>
          Last Vote Day :
          <Box
            ml={5}
            color="primary.main"
            component="p"
            className="pointer d-block"
          >
            {currentUserDetelis?.lastVoteDay
              ? currentUserDetelis?.lastVoteDay
              : "-"}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 5 }}>
          Total Votes :
          <Box
            ml={5}
            color="primary.main"
            component="p"
            className="pointer d-block"
          >
            {currentUserDetelis?.totalVotes
              ? currentUserDetelis?.totalVotes
              : "-"}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Average Votes :
          <Box
            ml={5}
            color="primary.main"
            component="p"
            className="pointer d-block"
          >
            {currentUserDetelis?.averageVotes
              ? currentUserDetelis?.averageVotes
              : "-"}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          NoOfVotesDays:
          <Box
            ml={5}
            color="primary.main"
            component="p"
            className="pointer d-block"
          >
            {currentUserDetelis?.noOfVotesDays
              ? currentUserDetelis?.noOfVotesDays
              : "-"}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Extra Vote Purchased :
          <Box
            ml={5}
            color="primary.main"
            component="p"
            className="pointer d-block"
          >
            {currentUserDetelis?.extraVotePurchased
              ? currentUserDetelis?.extraVotePurchased
              : "-"}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          TotalAmbassadorRewards :
          <Box
            ml={5}
            color="primary.main"
            component="p"
            className="pointer d-block"
          >
            {currentUserDetelis?.TotalAmbassadorRewards
              ? currentUserDetelis?.TotalAmbassadorRewards
              : "-"}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          AccountUpgrade :
          <Box
            ml={5}
            color="primary.main"
            component="p"
            className="pointer d-block"
          >
            {currentUserDetelis?.accountUpgrade
              ? currentUserDetelis?.accountUpgrade
              : "-"}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          Source :
          <Box
            ml={5}
            color="primary.main"
            component="p"
            className="pointer d-block"
          >
            {currentUserDetelis?.source ? currentUserDetelis?.source : "-"}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 7 }}>
          SignUp Time :
          <Box
            ml={5}
            color="primary.main"
            component="p"
            className="pointer d-block"
          >
            {currentUserDetelis?.signUpTime
              ? currentUserDetelis?.signUpTime
              : "-"}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UserDetailView;

UserDetailView.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func
};
