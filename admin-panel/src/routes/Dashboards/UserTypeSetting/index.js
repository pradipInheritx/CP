import React, { useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserSetting,
  updateUserSetting
} from "../../../redux/actions/UserTypeSetting";
import { useDebounce } from "../../../@jumbo/utils/commonHelper";
import useStyles from "./index.style";
import IntlMessages from "@jumbo/utils/IntlMessages";
import { AllrequiredMessage } from "@jumbo/constants/ErrorMessages";

const UsersModule = () => {
  const classes = useStyles();
  const { userTypeData } = useSelector(
    ({ UserTypeSetting }) => UserTypeSetting
  );

  const [allUserTypeSetting, setAllUserTypeSetting] = useState([]);
  const [userTypeSettingError, setUserTypeSettingError] = useState([]);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const validRegExp = new RegExp(/^\d*\.?\d*$/);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userTypeData) {
      setAllUserTypeSetting(userTypeData);
    }
  }, [userTypeData]);
  useEffect(() => {
    dispatch(getUserSetting());
  }, [dispatch, filterOptions, debouncedSearchTerm]);

  const onSubmitClick = () => {
    const allUserTypeInfo = [...allUserTypeSetting];
    let allUserTypeInfoError = [...userTypeSettingError];

    const checkevery = allUserTypeInfo.every((item, index) => {
      if (
        item.minVote == "" ||
        item.weight == "" ||
        item.share == "" ||
        item.givenCPM == ""
      ) {
        allUserTypeInfoError[index] = AllrequiredMessage;
        setUserTypeSettingError(allUserTypeInfoError);
      } else {
        return true;
      }
    });
    if (checkevery) {
      onUserSave();
    }
  };

  const onUserSave = () => {
    console.log(allUserTypeSetting, "allUserTypeSetting");

    const userTypeDetail = {
      userTypes: [...allUserTypeSetting]
    };

    dispatch(updateUserSetting(userTypeDetail));
  };

  const handelOnChangeState = (e, type, index) => {
    const userSetting = [...allUserTypeSetting];
    var finalValue = validRegExp.test(e.target.value);
    if (finalValue) userSetting[index][type] = e.target.value;
    setAllUserTypeSetting(userSetting);
    setUserTypeSettingError([]);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} style={{ padding: "30px" }}>
        <h3
          style={{ marginBottom: "20px", fontWeight: "bold", fontSize: "24px" }}
        >
          User Type Setting
        </h3>

        {/* <Box className={classes.authContent}> */}
        <form className="" style={{ display: "flex" }}>
          <div className="" style={{ width: "100%" }}>
            {allUserTypeSetting &&
              allUserTypeSetting?.map((item, index) => {
                return (
                  <div
                    style={{
                      padding: "0px 10px 0px 10px"
                      // border: `${userTypeSettingError[index] !== "" ? "1px solid red" : ""}`
                    }}
                    key={index}
                  >
                    <label htmlFor="">{item.name} </label>

                    <Grid container spacing={10}>
                      <Grid item xs={3}>
                        <TextField
                          style={{
                            width: "100%"
                          }}
                          type="text"
                          label={"Cmp Vote"}
                          onChange={event =>
                            handelOnChangeState(event, "givenCPM", index)
                          }
                          value={item.givenCPM}
                          margin="normal"
                          variant="outlined"
                          className={classes.textFieldRoot}
                        />
                      </Grid>

                      <Grid item xs={3}>
                        <TextField
                          style={{
                            width: "100%"
                          }}
                          type="text"
                          label={"Weight"}
                          onChange={event =>
                            handelOnChangeState(event, "weight", index)
                          }
                          value={item.weight}
                          margin="normal"
                          variant="outlined"
                          className={classes.textFieldRoot}
                        />
                      </Grid>

                      <Grid item xs={3}>
                        <TextField
                          style={{
                            width: "100%"
                          }}
                          type="text"
                          label={"Percent"}
                          onChange={event =>
                            handelOnChangeState(event, "share", index)
                          }
                          value={item.share}
                          margin="normal"
                          variant="outlined"
                          className={classes.textFieldRoot}
                        />
                      </Grid>

                      <Grid item xs={3}>
                        <TextField
                          style={{
                            width: "100%"
                          }}
                          type="text"
                          label={"Min Vote"}
                          onChange={event =>
                            handelOnChangeState(event, "minVote", index)
                          }
                          value={item.minVote}
                          margin="normal"
                          variant="outlined"
                          className={classes.textFieldRoot}
                        />
                      </Grid>
                    </Grid>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateRows: "repeat(4, 1fr)"
                      }}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        border: `${
                          userTypeSettingError[index] != undefined &&
                          userTypeSettingError[index] != ""
                            ? "1px solid red"
                            : ""
                        }`
                      }}
                    ></Box>
                    {userTypeSettingError[index] != "" ? (
                      <span style={{ color: "red", margin: "10px" }}>
                        {userTypeSettingError[index]}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            <Box
              marginY={"10px"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              gridGap={20}
              mb={5}
            >
              <Button
                type="reset"
                //   onClick={onSubmit}
                variant="contained"
                color="neutral"
              >
                <IntlMessages id="appModule.reset" />
              </Button>
              <Button
                onClick={onSubmitClick}
                variant="contained"
                color="primary"
              >
                <IntlMessages id="appModule.submit" />
              </Button>
            </Box>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default UsersModule;
