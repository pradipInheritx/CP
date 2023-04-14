import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Collapse, IconButton, Link } from '@material-ui/core';
import { alpha } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';

import CmtImage from '../../../../@coremat/CmtImage';

import IntlMessages from '../../../utils/IntlMessages';
import { AuhMethods } from '../../../../services/auth';
import ContentLoader from '../../ContentLoader';
import { CurrentAuthMethod } from '../../../constants/AppConstants';
import AuthWrapper from './AuthWrapper';
import { bothNotPasswordMatch, requiredMessage } from '@jumbo/constants/ErrorMessages';

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
      order: 1,
      width: props => (props.variant === 'default' ? '50%' : '100%'),
    },
    [theme.breakpoints.up('xl')]: {
      padding: 50,
    },
  },
  titleRoot: {
    marginBottom: 14,
    color: theme.palette.text.primary,
  },
  textFieldRoot: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(theme.palette.common.dark, 0.12),
    },
  },
  alertRoot: {
    marginBottom: 10,
  },
}));

//variant = 'default', 'standard', 'bgColor'
const ResetPassword = ({ method = CurrentAuthMethod, variant = 'default', wrapperVariant = 'default' }) => {
  // const { send_forget_password_email } = useSelector(({ auth }) => auth);
  const [open, setOpen] = React.useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [bothNotMatch, setBothNotMatch] = useState('');
  const dispatch = useDispatch();
  const classes = useStyles({ variant });
  const history = useHistory();
  const location = useLocation();
  const  ResetToken =location?.search.replace("?token=","")
  


const  onSubmit = () => {
    if (!newPassword) {
      setNewPasswordError(requiredMessage);
    }else if (!confirmPassword) {
      setConfirmPasswordError(requiredMessage);
    }else if (newPassword !== confirmPassword) {
      setBothNotMatch(bothNotPasswordMatch);
    }
    else {
      onRestPassword();
    }
  };
  

  const onRestPassword = () => {
  const data = {
      newPassword:newPassword,
      reset_password_token:ResetToken
    }
    dispatch(AuhMethods[method].onResetPassword(data, () => {
        history.push("/signin")
    }));

    // dispatch(AuhMethods[method].onRegister(userDetail, () => {
    //      history.push("/signin")
    //     }));
  };





  return (
    <AuthWrapper variant={wrapperVariant}>
      {variant === 'default' ? (
        <div className={classes.authThumb}>
          <CmtImage src={'/images/auth/forgot-img.png'} />
        </div>
      ) : null}
      <div className={classes.authContent}>
        {/* <div className={'mb-7'}>
          <CmtImage src={'/images/logo.png'} />
        </div> */}
        <Typography component="div" variant="h1" className={classes.titleRoot}>
          Reset Password
        </Typography>
        <Collapse in={open}>
          <Alert
            variant="outlined"
            severity="success"
            className={classes.alertRoot}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }>
            A mail has been sent on your email address with reset password link.
          </Alert>
        </Collapse>
        <form>
          <div className={''}>
            <TextField
              label={<IntlMessages id="appModule.newpassword" />}
              type="password"
              fullWidth
              onChange={(event) => {
                setNewPassword(event.target.value)
                setNewPasswordError("")
                setBothNotMatch("")
              }}
              defaultValue={newPassword}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
              helperText={newPasswordError}
              error={false || newPasswordError || bothNotMatch != ""}
            />
          </div>
          <div className={'mb-5'}>
            <TextField
              type="password"
              label={<IntlMessages id="appModule.confirmpassword" />}
              fullWidth
              onChange={event => {
                setConfirmPassword(event.target.value)
                setConfirmPasswordError("")
                setBothNotMatch("")
              }}
              defaultValue={confirmPassword}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
              helperText={confirmPasswordError || bothNotMatch}
              error={false || confirmPasswordError || bothNotMatch != ""}
            />
          </div>
          <div className={'mb-5'}>
            <Button onClick={onSubmit} variant="contained" color="primary">
              <IntlMessages id="appModule.submit" />
            </Button>
          </div>

          {/* <div>
            <Typography>
              Don't remember your email?
              <span className={'ml-2'}>
                <Link href="#">
                  <IntlMessages id="appModule.contactSupport" />
                </Link>
              </span>
            </Typography>
          </div> */}
        </form>
        <ContentLoader />
      </div>
    </AuthWrapper>
  );
};

export default ResetPassword;
