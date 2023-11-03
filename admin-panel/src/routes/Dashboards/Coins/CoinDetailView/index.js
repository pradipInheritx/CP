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

const CoinDetailView = ({open, onCloseDialog}) => {
  const classes = useStyles();
  const {currentCoin} = useSelector(({coinReducer}) => coinReducer);

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
  } = currentCoin;

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <Box className={classes.userInfoRoot}>
        <Box mr={3} display="flex" alignItems="center">
          {/* <Box className={classes.avatarView} mr={{xs: 4, md: 6}}>
            <CmtAvatar size={70} src={currentCoin?.coinLogo} alt={currentCoin?.name} />
          </Box> */}

          <Box mt={-2}>
            <Box display="flex" alignItems="center">
              <Typography className={classes.titleRoot}>{currentCoin?.name}</Typography>
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
            <Tooltip title={currentCoin?.status}>
              <IconButton aria-label="filter list">
                {currentCoin?.status === "InActive" && <Block color="primary" />}
                {currentCoin?.status === "Active" && <CheckCircleOutline color="primary" />}
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
          Coin Details
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          Name : 
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentCoin?.name}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          Symbol : 
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentCoin?.symbol}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          Coin Id : 
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentCoin?.id}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          Rank 
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentCoin?.voteBarRange &&  currentCoin?.voteBarRange[0] || 0 }
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          CMP :
          <Box ml={5} color="primary.main" component="p" className="pointer">
                {currentCoin?.voteBarRange && currentCoin?.voteBarRange[1] || 0}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          Weight Order Book :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {/* {currentCoin?.Weight_Order_Book} */}
                {currentCoin?.voteBarRange && currentCoin?.voteBarRange[2] || 0}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          Range Result CMP :
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {/* {currentCoin?.Range_Result_CMP} */}
                {currentCoin?.voteBarRange && currentCoin?.voteBarRange[3] || 0}
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

export default CoinDetailView;

CoinDetailView.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func
};