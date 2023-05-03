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
import AppSelectBox from "@jumbo/components/Common/formElements/AppSelectBox";

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
  {title: "1 Month", slug: "1Month"},
  { title: "3 Month", slug: "3Month" },
  { title: "6 Month", slug: "6Month" },
  {title: "12 Month", slug: "12Month"},
  // {title: "Other", slug: "other"}
];

const splitName = user => {
  if (user) {
    const [ fName, mName, lName ] = user.name.split(" ");
    return [ fName, lName ? mName + " " + lName : mName ];
  }

  return [ "", "" ];
};

const AddEditVotePass = ({open, onCloseDialog}) => {
  const classes = useStyles(); 
  const { currentVotePass } = useSelector(({ VotePass }) => VotePass);
  

  const [passName, setPassName ] = useState("");
  const [ passNameError, setPassNameError ] = useState("");
  
  const [passDuration, setPassDuration] = useState("");
  const [passDurationError, setPassDurationError] = useState("");    

  const [passAmount, setPassAmount] = useState("");
  const [passAmountError, setPassAmountError] = useState("");    

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
      if (currentVotePass) {        
        setPassName(currentVotePass.passName);
        setPassDuration(currentVotePass.passDuration);      
        setPassAmount(currentVotePass.passAmount);      
        setVotes(currentVotePass.votes);      
      }
    },
    [ currentVotePass ]
  );
 
const onSubmitClick = () => {  
    if (!passName) {
      setPassNameError(requiredMessage);      
    }
    else if (!passDuration) {
      setPassDurationError(requiredMessage);
    }
    else if (!passAmount) {
      setPassAmountError(requiredMessage);
    }    
    else if (!votes) {
      setVotesError(requiredMessage);
    }    
    else {
      onUserSave();
    }
  };

  const onUserSave = () => {
    const VotePassDetail = {
      passAmount,
      passName,
      votes,
      passDuration,
      status:"Active"
    };

    if (currentVotePass) {
      dispatch(
        updateVotePerUser({...currentVotePass, ...VotePassDetail}, () => {
          onCloseDialog();
        })
      );
    } else {
      dispatch(
        addNewVotePerUser(VotePassDetail, () => {
          onCloseDialog();
        })
      );
    }
  };

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <DialogTitle className={classes.dialogTitleRoot}>
        {currentVotePass ? "Edit Vote Pass Details" : "Create New Vote Pass"}
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
                label="Pass Name"
                value={passName}
                onChange={e => {
                  setPassName(e.target.value);
                  setPassNameError("");                  
                }}
                helperText={passNameError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="Pass Amount"
                value={passAmount}
                onChange={e => {
                  setPassAmount(e.target.value);
                  setPassAmountError("");                  
                }}
                helperText={passAmountError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppSelectBox
                fullWidth
                data={labels}
                variant="outlined"
                valueKey="slug"
                labelKey="title"
                label="Pass Duration"
                value={passDuration}
                onChange={e => {
                  setPassDuration(e.target.value)
                  setPassDurationError("")
                }}
                helperText={passDurationError}
              />
             
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="Vote"
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

export default AddEditVotePass;

AddEditVotePass.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func
};
