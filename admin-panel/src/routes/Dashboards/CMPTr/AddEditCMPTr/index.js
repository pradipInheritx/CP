import React, {useEffect, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import Box from "@material-ui/core/Box";
import GridContainer from "../../../../@jumbo/components/GridContainer";
import Grid from "@material-ui/core/Grid";
import AppTextInput from "../../../../@jumbo/components/Common/formElements/AppTextInput";
import Button from "@material-ui/core/Button";
import {
  requiredMessage,canNotbothEmpty
} from "../../../../@jumbo/constants/ErrorMessages";
import {useDispatch, useSelector} from "react-redux";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { addNewVotePerUser, updateVotePerUser } from "redux/actions/VotePerUser";

const useStyles = makeStyles(theme => ({
  dialogRoot: {
    position: "relative"
  },
  dialogTitleRoot: {
    "& .MuiTypography-h6": {
      fontSize: 16,
      color: theme.palette.common.dark
    }
  }
}));

function NumberFormatCustom({onChange, ...other}){
  return (
    <NumberFormat
      {...other}
      onValueChange={values => {
        onChange(values.formattedValue);
      }}
      format="#####-#####"
    />
  );
}

const labels = [
  {title: "Zerodha", slug: "Zerodha"},
  {title: "WazirX", slug: "WazirX"},
  // {title: "Other", slug: "other"}
];

const splitName = user => {
  if (user) {
    const [ fName, mName, lName ] = user.name.split(" ");
    return [ fName, lName ? mName + " " + lName : mName ];
  }

  return [ "", "" ];
};

const AddEditCMPTr = ({open, onCloseDialog}) => {
  const classes = useStyles(); 
  const { currentRewardTr } = useSelector(({ RewardTr }) => RewardTr);
  

  const [ coinName, setCoinName ] = useState("");
  const [ coinNameError, setCoinNameError ] = useState("");
  
  const [pairName, setPairName] = useState("");
  const [pairNameError, setPairNameError] = useState("");    

  const [quantity, setQuantity] = useState("");
  const [quantityError, setQuantityError] = useState("");    
  
  // const adminDetelis= JSON.parse(localStorage.getItem("userData"))
  // const {getRootProps, getInputProps} = useDropzone({
  //   accept: "image/*",
  //   onDrop: acceptedFiles => {
  //     setProfile_pic(URL.createObjectURL(acceptedFiles[0]));
  //   }
  // });
  
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (currentRewardTr) {        
        setCoinName(currentRewardTr.coin);
        setPairName(currentRewardTr.pair);      
        setQuantity(currentRewardTr.quantity);      
      }
    },
    [ currentRewardTr ]
  );
 
const onSubmitClick = () => {  
    if (!coinName && !pairName ) {
      setCoinNameError(canNotbothEmpty);
      setPairNameError(canNotbothEmpty);
    }
    // else if (!pairName) {
    //   setPairNameError(requiredMessage);
    // }
    else if (!quantity) {
      setQuantityError(requiredMessage);
    }    
    else {
      onUserSave();
    }
  };

  const onUserSave = () => {
    const timeFrameDetail = {
    coin:coinName,
    pair:pairName,
    quantity
    };

    if (currentRewardTr) {
      dispatch(
        updateVotePerUser({...currentRewardTr, ...timeFrameDetail}, () => {
          onCloseDialog();
        })
      );
    } else {
      dispatch(
        addNewVotePerUser(timeFrameDetail, () => {
          onCloseDialog();
        })
      );
    }
  };

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <DialogTitle className={classes.dialogTitleRoot}>
        {currentRewardTr ? "Edit Time Frame Details" : "Create New Time Frame"}
      </DialogTitle>
      <DialogContent dividers>
        <Box
          display="flex"
          flexDirection={{xs: "column", md: "row"}}
          alignItems="center"
          mb={{xs: 6, md: 5}}
        >
          <GridContainer>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="Coin Name"
                value={coinName}
                onChange={e => {
                  setCoinName(e.target.value);
                  setCoinNameError("");
                  setPairNameError("");
                }}
                helperText={coinNameError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="Pair Name"
                value={pairName}
                onChange={e => {
                  setPairName(e.target.value);
                  setPairNameError("");
                  setCoinNameError("");
                }}
                helperText={pairNameError}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="Quantity"
                value={quantity}
                onChange={e => {
                  setQuantity(e.target.value)
                  setQuantityError("")
                }}
                helperText={quantityError}
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

export default AddEditCMPTr;

AddEditCMPTr.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func
};
