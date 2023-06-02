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
import {Block, CheckCircleOutline} from "@material-ui/icons";
import {Tooltip} from "@material-ui/core";

const PairDetailView = ({open, onCloseDialog}) => {
  const classes = useStyles();
  const {currentPair} = useSelector(({pairReducer}) => pairReducer);

  const {
    name,
    symbol,
    status,
    coinID,
    rank,
    CMP,
    coinLogo,
    Weight_Order_Book,
    Range_Result_CMP
  } = currentPair;
  console.log(currentPair,"currentPair")
  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <Box className={classes.userInfoRoot}>
        <Box mr={3} display="flex" alignItems="center">
          {/* <Box className={classes.avatarView} mr={{xs: 4, md: 6}}>
            <CmtAvatar size={70} src={currentPair?.coinLogo} alt={currentPair?.name} />
          </Box> */}

          <Box mt={-2}>
            <Box display="flex" alignItems="center">
              <Box mr={1}>
              <Typography className={classes.titleRoot}>{currentPair?.symbol1}</Typography>
              </Box>
              <Box ml={1}>
              <Typography className={classes.titleRoot}>{currentPair?.symbol2}</Typography>
              </Box>
              {/* <Box ml={1}>
                <Checkbox
                  icon={<StarBorderIcon />}
                  checkedIcon={<StarIcon style={{color: "#FF8C00"}} />}
                  checked={starred}
                />
              </Box> */}
            </Box>
            {/* {(designation || company) && (
              <Box mt={-1}>
                {designation && (
                  <Typography className={classes.subTitleRoot}>
                    {designation}
                  </Typography>
                )}
                {company && (
                  <Typography className={classes.subTitleRoot}>
                    @{company}
                  </Typography>
                )}
              </Box>
            )} */}
          </Box>
        </Box>
        <Box ml="auto" mt={-2} display="flex" alignItems="center">
          <Box ml={1}>
            <Tooltip title={currentPair?.status}>
              <IconButton aria-label="filter list">
                {currentPair?.status === "Inactive" && <Block color="primary" />}
                {currentPair?.status === "Active" && <CheckCircleOutline color="primary" />}
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
            Pair Detail
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          Symbol 1 : 
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentPair?.symbol1}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          Symbol 2 : 
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentPair?.symbol2}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          Rank :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentPair?.voteBarRange && currentPair?.voteBarRange[0] || 0}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          CMP :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentPair?.voteBarRange && currentPair?.voteBarRange[1] || 0}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          Weight Order Book : 
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {/* {currentPair?.Weight_Order_Book} */}
            {currentPair?.voteBarRange && currentPair?.voteBarRange[2] || 0}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          Range Result CMP :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {/* {currentPair?.Range_Result_CMP} */}
            {currentPair?.voteBarRange && currentPair?.voteBarRange[3] || 0}
          </Box>
        </Box>
        {/* <Box display="flex" alignItems="center" mb={{xs: 4, sm: 5}}>
          <PhoneIcon />
          <Box ml={5}>
            <CmtList
              data={phones}
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
        </Box> */}
      </Box>
    </Dialog>
  );
};

export default PairDetailView;

PairDetailView.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func
};
