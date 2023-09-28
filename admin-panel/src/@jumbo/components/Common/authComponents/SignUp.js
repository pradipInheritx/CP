import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import IntlMessages from '../../../utils/IntlMessages';
import Button from '@material-ui/core/Button';
import { AuhMethods } from '../../../../services/auth';
import ContentLoader from '../../ContentLoader';
import { alpha, makeStyles } from '@material-ui/core/styles';
import CmtImage from '../../../../@coremat/CmtImage';
import Typography from '@material-ui/core/Typography';
import { CurrentAuthMethod } from '../../../constants/AppConstants';
import AuthWrapper from './AuthWrapper';
import { NavLink, useHistory } from 'react-router-dom';
import NumberFormat from "react-number-format";
import { isValidEmail } from '@jumbo/utils/commonHelper';
import { emailNotValid, requiredMessage } from '@jumbo/constants/ErrorMessages';

const useStyles = makeStyles(theme => ({
  authThumb: {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    [theme.breakpoints.up('md')]: {
      width: '50%',
      order: 2,
    },
  },
  authContent: {
    padding: 30,
    [theme.breakpoints.up('md')]: {
      width: props => (props.variant === 'default' ? '50%' : '100%'),
      order: 1,
    },
    [theme.breakpoints.up('xl')]: {
      padding: 50,
    },
  },
   textCenter: {
    display: "flex",
    justifyContent:"center"
  },
  titleRoot: {
    marginBottom: 14,
    color: theme.palette.text.primary,
  },
  heading: {
    marginBottom: 14,    
    fontSize:"25px",    
    color: "#3f51b5",
  },
  textFieldRoot: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(theme.palette.common.dark, 0.12),
    },
  },
  textCapital: {
    textTransform: 'capitalize',
  },
  textAcc: {
    textAlign: 'center',
    '& a': {
      marginLeft: 4,
    },
  },
  alrTextRoot: {
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      textAlign: 'right',
    },
  },
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


//variant = 'default', 'standard', 'bgColor'
const SignUp = ({ method = CurrentAuthMethod, variant = 'default', wrapperVariant = 'default' }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');  
  const [phone, setPhone] = useState('');  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [appAccess, setAppAccess] = useState([]);
  const [appAccessError, setAppAccessError] = useState([]);
  const [ firstNameError, setFirstNameError ] = useState("");
  const [ lastNameError, setLastNameError ] = useState("");
  const [ emailError, setEmailError ] = useState("");
  const [ phoneError, setPhoneError ] = useState("");
  const dispatch = useDispatch();
  const classes = useStyles({ variant });

  const labels = [
  {title: "Zerodha", slug: "Zerodha"},
  {title: "WazirX", slug: "WazirX"},
  // {title: "Other", slug: "other"}
];
const history = useHistory();
  
  const  onSubmit = () => {
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
      onCreateAdmin();
    }
  };
  

  const onCreateAdmin = () => {
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
      isAdmin: true,
      adminUserId: null
    };

    dispatch(AuhMethods[method].onRegister(userDetail, () => {
         history.push("/signin")
        }));
  };

  
  
  
  // const onSubmit = () => {
  //   dispatch(AuhMethods[method].onRegister({ firstName,lastName, email, password,phone }));
  // };

  return (
    <AuthWrapper variant={wrapperVariant}>
      {variant === 'default' ? (
        <Box className={classes.authThumb}>
          <CmtImage src={'/images/auth/sign-up-img.png'} />
        </Box>
      ) : null}
      <Box className={classes.authContent}>
        {/* <Box mb={7}>
          <CmtImage src={'/images/logo.png'} />
        </Box> */}
        <Box mb={7} className={classes.textCenter}>
          {/* <CmtImage src={'/images/logo.png'} /> */}
          <strong className={classes.heading}>Coin Parliament</strong>
        </Box>
        <Typography component="div" variant="h1" className={classes.titleRoot}>
          Create an account
        </Typography>
        <form>
          <Box
            mb={2}            
          >
            <TextField
              label={<IntlMessages id="appModule.firstname" />}
              fullWidth
              onChange={e => {
                setFirstName(e.target.value);
                  setFirstNameError("");
              }}
              defaultValue={firstName}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
              helperText={firstNameError}
              error={false || firstNameError != ""}
            />             
          </Box>
          <Box mb={2}>
            <TextField
              label={<IntlMessages id="appModule.lastname" />}
              fullWidth
              onChange={e => {
                setLastName(e.target.value)
                setLastNameError("");
              }}
              defaultValue={lastName}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
              helperText={lastNameError}
              error={false || lastNameError != ""}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label={<IntlMessages id="appModule.email" />}
              fullWidth
              onChange={e => {
                setEmail(e.target.value)
                setEmailError("")
              }}
              defaultValue={email}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
              helperText={emailError}
              error={false || emailError != ""}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label={<IntlMessages id="appModule.phone" />}
              fullWidth
              onChange={e => {
                setPhone(e.target.value)
                setPhoneError("")
              }}
              defaultValue={phone}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
              helperText={phoneError}
              error={false || phoneError != ""}
              // InputProps={{
              //       inputComponent: NumberFormatCustom
              //     }}
              // type="phone"
            />
          </Box>          
          
          <FormControl
            fullWidth
            variant="outlined"                  
          >
              <InputLabel id="demo-simple-select-helper-label"><IntlMessages id="appModule.appaccess" /></InputLabel>
                <Select              
                    multiple
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={appAccess}
                    
                    onChange={e => {
                        setAppAccess(e.target.value)
                      setAppAccessError("")
                    }}                  
                    error={false || appAccessError != ""}>              
                    {
                      labels.map((item,index) => {
                        return <MenuItem value={item.title} key={index}>{item.title}</MenuItem>
                      })
                    }
                  </Select>
                  {appAccessError && <FormHelperText error={false || appAccessError != ""}>{appAccessError}</FormHelperText>}
            </FormControl>

          <Box
            display="flex"
            className='mt-3'
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems={{ sm: 'center' }}
            justifyContent={{ sm: 'space-between' }}
            mb={3}>
            <Box mb={{ xs: 2, sm: 0 }}>
              <Button onClick={onSubmit} variant="contained" color="primary">
                <IntlMessages id="appModule.regsiter" />
              </Button>
            </Box>

            <Typography className={classes.alrTextRoot}>
              <NavLink to="/signin">
                <IntlMessages id="signUp.alreadyMember" />
              </NavLink>
            </Typography>
          </Box>
        </form>

        <Box mb={3}>{dispatch(AuhMethods[method].getSocialMediaIcons())}</Box>

        <Typography className={classes.textAcc}>
          Have an account?
          <NavLink to="/signin">Sign In</NavLink>
        </Typography>
        <ContentLoader />
      </Box>
    </AuthWrapper>
  );
};

export default SignUp;
