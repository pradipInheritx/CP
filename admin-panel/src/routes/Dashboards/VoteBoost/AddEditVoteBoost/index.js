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

const AddEditVotePerUser = ({open, onCloseDialog}) => {
  const classes = useStyles(); 
  const { currentVotePerUser } = useSelector(({ VotePerUser }) => VotePerUser);
  

  const [ boosterName, setBoosterName ] = useState("");
  const [ boosterNameError, setBoosterNameError ] = useState("");
  
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");    

  const [votes, setVotes] = useState("");
  const [votesError, setVotesError] = useState("");      
  
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
      if (currentVotePerUser) {        
        setBoosterName(currentVotePerUser.boosterName);
        setPrice(currentVotePerUser.price);      
        setVotes(currentVotePerUser.votes);      
      }
    },
    [ currentVotePerUser ]
  );
 
const onSubmitClick = () => {  
    if (!boosterName ) {
     setBoosterNameError(requiredMessage)
    }
    else if (!price) {
      setPriceError(requiredMessage);
    }
    else if (!votes) {
      setVotesError(requiredMessage);
    }    
    else {
      onUserSave();
    }
  };

  const onUserSave = () => {
    const VoteBoostDetail = {
    boosterName,
    price,
    votes,
    };

    if (currentVotePerUser) {
      dispatch(
        updateVotePerUser({...currentVotePerUser, ...VoteBoostDetail}, () => {
          onCloseDialog();
        })
      );
    } else {
      dispatch(
        addNewVotePerUser(VoteBoostDetail, () => {
          onCloseDialog();
        })
      );
    }
  };

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <DialogTitle className={classes.dialogTitleRoot}>
        {currentVotePerUser ? "Edit Time Frame Details" : "Create New Time Frame"}
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
                label="Booster Name"
                value={boosterName}
                onChange={e => {
                  setBoosterName(e.target.value);
                  setBoosterNameError("");                  
                }}
                helperText={boosterNameError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                style={{margin: 0}}
                fullWidth
                type="text"
                variant="outlined"
                label="Price"
                value={price}
                inputProps={{pattern: "[a-z]{1,15}" }}
                onChange={e => {
                  setPrice(e.target.value);
                  setPriceError("");
                  
                }}
                helperText={priceError}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="Votes"
                value={votes}
                onChange={e => {
                  setVotes(e.target.value)
                  setVotesError("")
                }}
                helperText={votesError}
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

export default AddEditVotePerUser;

AddEditVotePerUser.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func
};
