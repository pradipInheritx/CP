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
  requiredMessage,
  bothNotSelectSame
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
import { MenuItem } from "@material-ui/core";

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

const AddEditPair = ({open,coinList, onCloseDialog}) => {
  const classes = useStyles();
  const {currentUser} = useSelector(({usersReducer}) => usersReducer);

  
  const [ id, setId ] = useState("");
  const [ symbol1, setSymbol1 ] = useState("");
  const [ symbol2, setSymbol2 ] = useState("");
  const [coinLogo, setCoinLogo] = useState("");  
  
  
  
  const [ idError, setIdError ] = useState("");
  const [ symbol1Error, setSymbol1Error ] = useState("");
  const [ symbol2Error, setSymbol2Error ] = useState("");
  const [coinLogoError, setCoinLogoError] = useState("");  

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
       setSymbol1(currentUser?.symbol1)
       setSymbol2(currentUser?.symbol2)
      }
    },
    [ currentUser ]
  );


  const onSubmitClick = () => {
    // const phoneNumbers = phones.filter(item => item.phone.trim());
    if (!symbol1) {
      setSymbol1Error(requiredMessage);
    } else if (!symbol2) {
      setSymbol2Error(requiredMessage);
    }else if (symbol1 == symbol2) {
      setSymbol1Error(bothNotSelectSame);
      setSymbol2Error(bothNotSelectSame);
    }
    else {
      onUserSave();
    }
  };

  const onUserSave = () => {
    const pairDetail = {    
      symbol1,    
      symbol2,    
      status: "Active",
      logo:""
    };
    dispatch(
        addNewPair(pairDetail, () => {
          onCloseDialog();
        })
      );
    // if (currentUser) {
    //   dispatch(
    //     updatePair({...currentUser, ...userDetail}, () => {
    //       onCloseDialog();
    //     })
    //   );
    // } else {
      // dispatch(
      //   addNewPair(userDetail, () => {
      //     onCloseDialog();
      //   })
      // );
    // }
  };
  

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}
    fullWidth
    >
      <DialogTitle className={classes.dialogTitleRoot}>
        {currentUser ? "Edit Coin Details" : "Create New Pair"}
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
        </Box>
        <Box mb={{xs: 6, md: 5}}>         
           <GridContainer>
            <Grid item xs={12} sm={6}>
              <AppSelectBox
                fullWidth
                data={coinList}
                variant="outlined"
                label="Symbol 1"                
                value={symbol1}
                onChange={e => {
                  setSymbol1(e.target.value);
                  setSymbol1Error("");
                  setSymbol2Error("");
                }}
                error={symbol1Error || ""}
                renderRow={(item, index) => (
                  <MenuItem key={index} value={item.symbol}>
                    {item.symbol}
                  </MenuItem>
                )}
                helperText={symbol1Error}
              />
            </Grid>
            
             
            <Grid item xs={12} sm={6}>
              <AppSelectBox
                fullWidth
                data={coinList}
                variant="outlined"
                label="Symbol 2"                
                value={symbol2}
                onChange={e => {
                  setSymbol2(e.target.value);
                  setSymbol2Error("");
                  setSymbol1Error("");
                }}
                renderRow={(item, index) => (
                  <MenuItem key={index} value={item.symbol}>
                    {item.symbol}
                  </MenuItem>
                )}        
                error={symbol2Error || ""}
                helperText={symbol2Error}
              />
            </Grid>  
          </GridContainer>
        </Box>  
        
        {/* <Box mb={{xs: 6, md: 5}}>
          <GridContainer>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={4}>
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
        </Box>                */}
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

export default AddEditPair;

AddEditPair.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func
};
