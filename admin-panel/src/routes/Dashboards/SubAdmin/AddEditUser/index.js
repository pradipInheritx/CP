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
import {addNewSubAdmin, updateSubAdmin} from "../../../../redux/actions/SubAdmin";

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

const AddEditUser = ({open, onCloseDialog}) => {
  const classes = useStyles();
  const { currentUser } = useSelector(({ subAdmin }) => subAdmin);
  

  const [ firstName, setFirstName ] = useState("");
  const [ lastName, setLastName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ profile_pic, setProfile_pic ] = useState("");
  const [ company, setCompany ] = useState("");
  const [ designation, setDesignation ] = useState("");
  const [ phone, setPhone ] = useState("");
  const [ lastNameError, setLastNameError ] = useState("");
  const [ firstNameError, setFirstNameError ] = useState("");
  const [ emailError, setEmailError ] = useState("");
  const [ phoneError, setPhoneError ] = useState("");
  const [ appAccessError, setAppAccessError ] = useState("");
  const [ appAccess, setAppAccess ] = useState([]);
const adminDetelis= JSON.parse(localStorage.getItem("userData"))
  const {getRootProps, getInputProps} = useDropzone({
    accept: "image/*",
    onDrop: acceptedFiles => {
      setProfile_pic(URL.createObjectURL(acceptedFiles[0]));
    }
  });

  
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (currentUser) {
        // const [ fistName, lastName ] = splitName(currentUser);
        setFirstName(currentUser.firstName);
        setLastName(currentUser.lastName);
        // setProfile_pic(currentUser.profile_pic);
        setEmail(currentUser.email);
        // setCompany(currentUser.company);
        // setDesignation(currentUser.designation);
        setPhone(currentUser.phone);
        setAppAccess(currentUser.webAppAccess);
      }
    },
    [ currentUser ]
  );

  // const onPhoneNoAdd = (number, index) => {
  //   const updatedList = [ ...phone ];
  //   updatedList[index].phone = number;
  //   setPhone(updatedList);
  //   setPhoneError("");
  // };

  // const onPhoneRowRemove = index => {
  //   const updatedList = [ ...phone ];
  //   updatedList.splice(index, 1);
  //   setPhone(updatedList);
  // };

  // const onPhoneRowAdd = () => {
  //   setPhone(phone.concat({phone: "", label: "home"}));
  // };

  // const onLabelChange = (value, index) => {
  //   const updatedList = [ ...phone ];
  //   updatedList[index].label = value;
  //   setPhone(updatedList);
  // };

  const  onSubmitClick = () => {
    // const phoneNumbers = phone.filter(item => item.phone.trim());
    if (!firstName) {
      setFirstNameError(requiredMessage);
    }else if (!lastName) {
      setLastNameError(requiredMessage);
    }else if (!email) {
      setEmailError(requiredMessage);
    } else if (!isValidEmail(email)) {
      setEmailError(emailNotValid);
    }
    else if (phone.length === 0) {
      setPhoneError(requiredMessage);
    }
    else if (appAccess.length === 0) {
      setAppAccessError(requiredMessage);
    }
    else {
      onUserSave();
    }
  };

  const onUserSave = () => {
    const userDetail = {
      // profile_pic,
      // name: `${firstName} ${lastName}`,
      lastName,
      firstName,
      email,
      phone,
       status:"Active",
      // company,       
      webAppAccess: [...appAccess],
      isAdmin: false,
      adminUserId: adminDetelis?.id
    };

    if (currentUser) {
      dispatch(
        updateSubAdmin({...currentUser, ...userDetail}, () => {
          onCloseDialog();
        })
      );
    } else {
      dispatch(
        addNewSubAdmin(userDetail, () => {
          onCloseDialog();
        })
      );
    }
  };

  // const isPhonesMultiple = phone.length > 1;

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <DialogTitle className={classes.dialogTitleRoot}>
        {currentUser ? "Edit  Sub Admin Details" : "Create New Sub Admin"}
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
            <CmtAvatar size={70} src={profile_pic} />
          </Box> */}
          <GridContainer>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="First name"
                value={firstName}
                onChange={e => {
                  setFirstName(e.target.value);
                  setFirstNameError("");
                }}
                helperText={firstNameError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput
                fullWidth
                variant="outlined"
                label="Last name"
                value={lastName}
                onChange={e => {
                  setLastName(e.target.value)
                  setLastNameError("")
                }}
                helperText={lastNameError}
              />
            </Grid>
          </GridContainer>
        </Box>
        <Box mb={{xs: 6, md: 5}}>
          <AppTextInput
            fullWidth
            variant="outlined"
            label="Email Address"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            helperText={emailError}
          />
        </Box>
        
            <GridContainer style={{marginBottom: 12}} >
              <Grid item xs={12} sm={12}>
                <AppTextInput
                  fullWidth
                  variant="outlined"
                  label="Phone"
                  value={phone}
                  onChange={number => setPhone(number)}
                  helperText={phoneError}
                  InputProps={{
                    inputComponent: NumberFormatCustom
                  }}
                />
              </Grid>
              <Grid item xs={ 12} sm={12}>
                <AppSelectBox
                  fullWidth
                  data={labels}
                  label="App Access"
                  valueKey="slug"
                  variant="outlined"
                  labelKey="title"
                  multiple={true}
                  value={appAccess}
                  onChange={e => setAppAccess(e.target.value)}
                  helperText={appAccessError}
                />
              </Grid>              
            </GridContainer>
        
        {/* <Box
          mb={{ xs: 6, md: 5 }}
          display="flex"
          alignItems="center"
          onClick={onPhoneRowAdd}
          className="pointer"
          color="primary.main">
          <AddCircleOutlineIcon />
          <Box ml={2}>Add More</Box>
        </Box> */}
        {/* <GridContainer style={{ marginBottom: 12 }}>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              fullWidth
              variant="outlined"
              label="Company name"
              value={company}
              onChange={e => setCompany(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              fullWidth
              variant="outlined"
              label="Job title"
              value={designation}
              onChange={e => setDesignation(e.target.value)}
            />
          </Grid>
        </GridContainer> */}
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

export default AddEditUser;

AddEditUser.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func
};
