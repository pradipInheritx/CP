import React, {useEffect, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import Box from "@material-ui/core/Box";
import GridContainer from "../../../../@jumbo/components/GridContainer";
import Grid from "@material-ui/core/Grid";
import AppTextInput from "../../../../@jumbo/components/Common/formElements/AppTextInput";
import CmtAvatar from "../../../../@coremat/CmtAvatar";
import {useDropzone} from "react-dropzone";
import Button from "@material-ui/core/Button";
import CmtList from "../../../../@coremat/CmtList";
import IconButton from "@material-ui/core/IconButton";
import AppSelectBox from "../../../../@jumbo/components/Common/formElements/AppSelectBox";
import {
  emailNotValid,
  requiredMessage
} from "../../../../@jumbo/constants/ErrorMessages";
import {useDispatch, useSelector} from "react-redux";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CancelIcon from "@material-ui/icons/Cancel";
import {isValidEmail} from "../../../../@jumbo/utils/commonHelper";
import {addNewPair, updatePair} from "../../../../redux/actions/Pairs";

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
      format="(###) ###-####"
    />
  );
}

const UpdateCoinBar = ({open, onCloseDialog}) => {
  const classes = useStyles();
  const {currentUser} = useSelector(({usersReducer}) => usersReducer);

  const [ name, setName ] = useState("");
  const [ symbol, setSymbol ] = useState("");
  const [ coinID, setCoinID ] = useState("");
  const [ rank, setRank ] = useState("");
  const [ wob, setWOB ] = useState("");
  const [ rrc, setRRC ] = useState("");
  const [ cmp, setCMP ] = useState("");
  const [ coinLogo, setCoinLogo ] = useState("");

  const [ nameError, setNameError ] = useState("");

  const [ symbolError, setSymbolError ] = useState("");
  const [ coinIDError, setCoinIDError ] = useState("");
  const [ rankError, setRankError ] = useState("");
  const [ wobError, setWOBError ] = useState("");
  const [ rrcError, setRRCError ] = useState("");
  const [ cmpError, setCMPError ] = useState("");
  const [ coinLogoError, setCoinLogoError ] = useState("");

  const {getRootProps, getInputProps} = useDropzone({
    accept: "image/*",
    onDrop: acceptedFiles => {
      setCoinLogo(URL.createObjectURL(acceptedFiles[0]));
    }
  });

  const dispatch = useDispatch();

  useEffect(
    () => {
      if (currentUser) {
        // const [ fName, lName ] = splitName(currentUser);
        setName(currentUser.name);
        setSymbol(currentUser.symbol);
        setCoinID(currentUser.coinID);
        setRank(currentUser.rank);
        setCMP(currentUser.CMP);
        setWOB(currentUser.Weight_Order_Book);
        setRRC(currentUser.Range_Result_CMP);
        setCoinLogo(currentUser.coinLogo);
      }
    },
    [ currentUser ]
  );

  const onSubmitClick = () => {
    // const phoneNumbers = phones.filter(item => item.phone.trim());
    // if (!firstName) {
    //   setFirstNameError(requiredMessage);
    // } else if (!email) {
    //   setEmailError(requiredMessage);
    // } else if (!isValidEmail(email)) {
    //   setEmailError(emailNotValid);
    // } else if (phoneNumbers.length === 0) {
    //   setPhoneError(requiredMessage);
    // } else {
    //   onUserSave(phoneNumbers);
    // }
  };

  const onUserSave = phoneNumbers => {
    const userDetail = {
      coinLogo,
      name,
      symbol,
      cmp,
      wob,
      rrc,
      rank,
      coinID
    };
    if (currentUser) {
      dispatch(
        updatePair({...currentUser, ...userDetail}, () => {
          onCloseDialog();
        })
      );
    } else {
      dispatch(
        addNewPair(userDetail, () => {
          onCloseDialog();
        })
      );
    }
  };

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <DialogTitle className={classes.dialogTitleRoot}>
        {/* {currentUser ? "Edit Coin Details" : "Create New Coin"} */}
        Update Coin Vote bar
      </DialogTitle>
      <DialogContent dividers>
        <Box
          display="flex"
          flexDirection={{xs: "column", md: "row"}}
          alignItems="center"
          mb={{xs: 6, md: 5}}
        >
          {/* <Box
            {...getRootProps()}
            mr={{xs: 0, md: 5}}
            mb={{xs: 3, md: 0}}
            className="pointer"
          >
            <input {...getInputProps()} />
            <CmtAvatar size={70} src={coinLogo} />
          </Box> */}
          {/* <GridContainer>
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
                label="Symbol"
                value={symbol}
                onChange={e => {
                  setSymbol(e.target.value);
                  setSymbolError("");
                }}
                helperText={symbolError}
              />
            </Grid>  
          </GridContainer> */}
        </Box>
        <Box mb={{xs: 6, md: 5}}>
          <GridContainer>
            {/* <Grid item xs={12} sm={12}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="Coin ID"
                value={coinID}
                onChange={e => {
                  setCoinID(e.target.value);
                  setCoinIDError("");
                }}
                helperText={coinIDError}
              />
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="Rank"
                value={rank}
                onChange={e => {
                  setRank(e.target.value);
                  setRankError("");
                }}
                helperText={rankError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="CMP"
                value={cmp}
                onChange={e => {
                  setCMP(e.target.value);
                  setCMPError("");
                }}
                helperText={cmpError}
              />
            </Grid>
          </GridContainer>
        </Box>

        <Box mb={{xs: 6, md: 5}}>
          <GridContainer>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="Weight Order Book"
                value={wob}
                onChange={e => {
                  setWOB(e.target.value);
                  setWOBError("");
                }}
                helperText={wobError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="Range Result CMP"
                value={rrc}
                onChange={e => {
                  setRRC(e.target.value);
                  setRRCError("");
                }}
                helperText={rrcError}
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

export default UpdateCoinBar;

UpdateCoinBar.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func
};
