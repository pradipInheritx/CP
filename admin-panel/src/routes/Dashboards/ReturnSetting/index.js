import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Grid
} from "@material-ui/core";

import { useDispatch, useSelector } from "react-redux";
import {
  getReturnSetting,
  updateReturnSetting
} from "../../../redux/actions/ReturnSetting";

import ConfirmDialog from "../../../@jumbo/components/Common/ConfirmDialog";
import { useDebounce } from "../../../@jumbo/utils/commonHelper";
import useStyles from "./index.style";
import GridContainer from "@jumbo/components/GridContainer";
// import { Grid } from 'react-virtualized';
import AppTextInput from "@jumbo/components/Common/formElements/AppTextInput";
import IntlMessages from "@jumbo/utils/IntlMessages";
import { NavLink } from "react-router-dom";
import { requiredMessage } from "@jumbo/constants/ErrorMessages";

const ReturnSettingModule = () => {
  const classes = useStyles();
  const validRegExp = new RegExp(/^\d*\.?\d*$/);
  const [usersFetched, setUsersFetched] = useState(false);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { ReturnSettingDetelis } = useSelector(
    ({ ReturnSetting }) => ReturnSetting
  );

  console.log(ReturnSettingDetelis, "ReturnSettingDetelis");

  const [allSettingData, setAllSettingData] = useState({});

  const [considerableAffec, setConsiderableAffec] = useState("");
  const [considerableAffecError, setConsiderableAffecError] = useState("");

  const [mediumAffect, setMediumAffect] = useState("");
  const [mediumAffectError, setMediumAffectError] = useState("");

  const [minorAffect, setMinorAffect] = useState("");
  const [minorAffectError, setMinorAffectError] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    // setAllSettingData(ReturnSettingDetelis)
    if (ReturnSettingDetelis) {
      setConsiderableAffec(ReturnSettingDetelis?.voteRules?.CPMReturnFailure);
      setMediumAffect(ReturnSettingDetelis?.voteRules?.CPMReturnInRange);
      setMinorAffect(ReturnSettingDetelis?.voteRules?.CPMReturnSuccess);
      setAllSettingData(ReturnSettingDetelis);
    }
  }, [ReturnSettingDetelis]);

  useEffect(() => {
    dispatch(
      getReturnSetting(filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setUsersFetched(true);
      })
    );
  }, [dispatch, filterOptions, debouncedSearchTerm]);

  const onSubmitClick = () => {
    if (!considerableAffec) {
      setConsiderableAffecError(requiredMessage);
    } else if (!mediumAffect) {
      setMediumAffectError(requiredMessage);
    } else if (!minorAffect) {
      setMinorAffectError(requiredMessage);
    } else {
      onCmpSave();
    }
  };

  const onCmpSave = () => {
    var allDatainfo = {
      ...allSettingData.CPMSettings,
      ...allSettingData.voteRules
    };
    allDatainfo["CPMReturnInRange"] = mediumAffect;
    allDatainfo["CPMReturnFailure"] = considerableAffec;
    allDatainfo["CPMReturnSuccess"] = minorAffect;
    dispatch(updateReturnSetting(allDatainfo));
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} style={{ padding: "30px" }}>
        <h3
          style={{ marginBottom: "20px", fontWeight: "bold", fontSize: "24px" }}
        >
          Return Setting
        </h3>

        {/* <Box className={classes.authContent}> */}
        <form className="">
          <div>
            <Grid container spacing={10}>
              <Grid item xs={4}>
                <TextField
                  style={{
                    width: "100%"
                  }}
                  type="text"
                  label={"Low Range"}
                  value={considerableAffec}
                  onChange={event => {
                    var finalValue = validRegExp.test(event.target.value);
                    if (finalValue) setConsiderableAffec(event.target.value);
                    setConsiderableAffecError("");
                  }}
                  margin="normal"
                  variant="outlined"
                  className={classes.textFieldRoot}
                  helperText={considerableAffecError}
                  error={considerableAffecError !== ""}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  style={{
                    width: "100%"
                  }}
                  type="text"
                  label={"Medium Range"}
                  value={mediumAffect}
                  onChange={event => {
                    var finalValue = validRegExp.test(event.target.value);
                    if (finalValue) setMediumAffect(event.target.value);
                    setMediumAffectError("");
                  }}
                  defaultValue={ReturnSettingDetelis?.mediumAffect}
                  margin="normal"
                  variant="outlined"
                  className={classes.textFieldRoot}
                  helperText={mediumAffectError}
                  error={mediumAffectError !== ""}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  style={{
                    width: "100%"
                  }}
                  type="text"
                  label={"High Range"}
                  value={minorAffect}
                  onChange={event => {
                    var finalValue = validRegExp.test(event.target.value);
                    if (finalValue) setMinorAffect(event.target.value);
                    setMinorAffectError("");
                  }}
                  defaultValue={ReturnSettingDetelis?.minorAffect}
                  margin="normal"
                  variant="outlined"
                  className={classes.textFieldRoot}
                  helperText={minorAffectError}
                  error={minorAffectError !== ""}
                />
              </Grid>
            </Grid>

            <Box
              marginY={"10px"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={5}
              gridGap={20}
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

export default ReturnSettingModule;
