import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Formik, Form } from "formik"; // Import Formik components
import * as Yup from "yup"; // Import Yup for validation

import TextField from "@material-ui/core/TextField";
import { alpha } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Collapse, IconButton } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";

import CmtImage from "../../../../@coremat/CmtImage";

import IntlMessages from "../../../utils/IntlMessages";
import { AuhMethods } from "../../../../services/auth";
import ContentLoader from "../../ContentLoader";
import { CurrentAuthMethod } from "../../../constants/AppConstants";
import AuthWrapper from "./AuthWrapper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  authThumb: {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    [theme.breakpoints.up("md")]: {
      width: "50%",
      order: 2
    }
  },
  authContent: {
    padding: 30,
    [theme.breakpoints.up("md")]: {
      order: 1,
      width: props => (props.variant === "default" ? "50%" : "100%")
    },
    [theme.breakpoints.up("xl")]: {
      padding: 50
    }
  },
  titleRoot: {
    marginBottom: 14,
    color: theme.palette.text.primary
  },
  textFieldRoot: {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(theme.palette.common.dark, 0.12)
    }
  },
  alertRoot: {
    marginBottom: 10
  }
}));

const ResetPassword = ({
  method = CurrentAuthMethod,
  variant = "default",
  wrapperVariant = "default"
}) => {
  const dispatch = useDispatch();
  const classes = useStyles({ variant });
  const history = useHistory();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ResetToken = location?.search.replace("?token=", "");

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required("New Password is required")
      .min(8, "New password must be at least 8 characters")
      .max(16, "New password should not exceed 16 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "New password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required")
  });

  // Initial form values
  const initialValues = {
    newPassword: "",
    confirmPassword: ""
  };

  // Submit handler
  const onSubmit = (values, { setSubmitting }) => {
    const data = {
      newPassword: values.newPassword,
      reset_password_token: ResetToken
    };
    dispatch(
      AuhMethods[method].onResetPassword(data, () => {
        history.push("/signin");
      })
    );
    setSubmitting(false);
  };

  // Render component
  return (
    <AuthWrapper variant={wrapperVariant}>
      {variant === "default" ? (
        <div className={classes.authThumb}>
          <CmtImage src={"/images/auth/forgot-img.png"} />
        </div>
      ) : null}
      <div className={classes.authContent}>
        <Typography component="div" variant="h1" className={classes.titleRoot}>
          Reset Password
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, handleChange, handleBlur }) => (
            <Form>
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
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  A mail has been sent on your email address with reset password
                  link.
                </Alert>
              </Collapse>
              <div className={""}>
                <TextField
                  label={<IntlMessages id="appModule.newpassword" />}
                  type="password"
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="newPassword"
                  margin="normal"
                  variant="outlined"
                  helperText={
                    touched.newPassword && errors.newPassword
                      ? errors.newPassword
                      : ""
                  }
                  error={touched.newPassword && Boolean(errors.newPassword)}
                  className={classes.textFieldRoot}
                />
              </div>

              <div className={"mb-5"}>
                <TextField
                  label={<IntlMessages id="appModule.confirmpassword" />}
                  type="password"
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="confirmPassword"
                  margin="normal"
                  variant="outlined"
                  helperText={
                    touched.confirmPassword && errors.confirmPassword
                      ? errors.confirmPassword
                      : ""
                  }
                  error={
                    touched.confirmPassword && Boolean(errors.confirmPassword)
                  }
                  className={classes.textFieldRoot}
                />
              </div>
              <div className={"mb-5"}>
                <Button type="submit" variant="contained" color="primary">
                  <IntlMessages id="appModule.submit" />
                </Button>
              </div>
            </Form>
          )}
        </Formik>
        <ContentLoader />
      </div>
    </AuthWrapper>
  );
};

export default ResetPassword;
