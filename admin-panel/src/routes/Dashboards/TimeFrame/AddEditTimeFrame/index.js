import React, {useEffect, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import Box from "@material-ui/core/Box";
import GridContainer from "../../../../@jumbo/components/GridContainer";
import Grid from "@material-ui/core/Grid";
import AppTextInput from "../../../../@jumbo/components/Common/formElements/AppTextInput";
import Button from "@material-ui/core/Button";
import {
  requiredMessage
} from "../../../../@jumbo/constants/ErrorMessages";
import {useDispatch, useSelector} from "react-redux";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { addNewTimeFrame, updateTimeFrame } from "redux/actions/TimeFrame";

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

const AddEditTimeFrame = ({open, onCloseDialog}) => {
  const classes = useStyles();
  const { currentTimeFrame } = useSelector(({ TimeFrame }) => TimeFrame);
  

  const [ name, setName ] = useState("");
  const [ nameError, setNameError ] = useState("");
  
  const [seconds, setSeconds] = useState("");
  const [secondsError, setSecondsError] = useState("");    
  
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
      if (currentTimeFrame) {        
        setName(currentTimeFrame.name);
        setSeconds(currentTimeFrame.seconds);      
      }
    },
    [ currentTimeFrame ]
  );
 
const onSubmitClick = () => {  
    if (!name) {
      setName(requiredMessage);
    }else if (!seconds) {
      setSeconds(requiredMessage);
    }    
    else {
      onUserSave();
    }
  };

  const onUserSave = () => {
    const timeFrameDetail = {
    name,
    seconds,
      chosen: true,  
    index:1,
    };

    if (currentTimeFrame) {
      dispatch(
        updateTimeFrame({...currentTimeFrame, ...timeFrameDetail}, () => {
          onCloseDialog();
        })
      );
    } else {
      dispatch(
        addNewTimeFrame(timeFrameDetail, () => {
          onCloseDialog();
        })
      );
    }
  };

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <DialogTitle className={classes.dialogTitleRoot}>
        {currentTimeFrame ? "Edit Time Frame Details" : "Create New Time Frame"}
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
                label="Name"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  setNameError("");
                }}
                helperText={nameError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="Seconds"
                value={seconds}
                onChange={e => {
                  setSeconds(e.target.value)
                  setSecondsError("")
                }}
                helperText={secondsError}
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

export default AddEditTimeFrame;

AddEditTimeFrame.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func
};
