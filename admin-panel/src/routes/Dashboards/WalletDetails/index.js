import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Radio, Select, Table, TableCell, TableContainer, TableRow, TextField } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';
import { getVoteSetting, updateVoteSetting } from '../../../redux/actions/VoteSetting';

import ConfirmDialog from '../../../@jumbo/components/Common/ConfirmDialog';
import { useDebounce } from '../../../@jumbo/utils/commonHelper';
import useStyles from './index.style';
import GridContainer from '@jumbo/components/GridContainer';
import { Grid } from 'react-virtualized';
import AppTextInput from '@jumbo/components/Common/formElements/AppTextInput';
import IntlMessages from '@jumbo/utils/IntlMessages';
import { NavLink } from 'react-router-dom';
import { requiredMessage } from '@jumbo/constants/ErrorMessages';



const WalletDetailsModule = () => {
  const classes = useStyles();
  const validRegExp = new RegExp(/^\d*\.?\d*$/);
  const [usersFetched, setUsersFetched] = useState(false);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectRadio, setSelectRadio] = useState('');
  const [limitType, setLimitType] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [walletDetailsObj, setWalletDetailsObj] = useState([{
    coin: "ETH",
    address: "0x0189705803Cb6819Ee80D209A9CCeAf56fD99E24",
  },
  ]);
  const [coinList, setCoinList] = useState(["ETH", "BTC", "BNB", "MATIC"]);
  const [walletDetails, setWalletDetails] = useState({
    coin: "",
    address: "",
  });

  const { VoteSettingDetelis } = useSelector(({ VoteSetting }) => VoteSetting);
  const [allSettingData, setAllSettingData] = useState({});
  const [giveTime, setGiveTime] = useState('');
  const [giveTimeError, setGiveTimeError] = useState('');

  const [afterTimeVote, setAfterTimeVote] = useState('');
  const [afterTimeVoteError, setAfterTimeVoteError] = useState('');
  const [timeAmount, setTimeAmount] = useState({
    time: "",
    amount: ""
  })
  const [timeValue, setTimeValue] = useState("");
  const [amountValue, setAmountValue] = useState("");
  const [timeType, setTimeType] = useState('time');


  const dispatch = useDispatch();

  useEffect(() => {
    // setAllSettingData(ReturnSettingDetelis)
    if (VoteSettingDetelis) {
      setGiveTime(VoteSettingDetelis?.voteRules?.timeLimit)
      setAfterTimeVote(VoteSettingDetelis?.voteRules?.maxVotes)
      setAllSettingData(VoteSettingDetelis)
    }
  }, [VoteSettingDetelis]);

  useEffect(() => {
    dispatch(
      getVoteSetting(filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setUsersFetched(true);
      }),
    );
  }, [dispatch, filterOptions, debouncedSearchTerm]);

  const onSubmitClick = () => {
    if (!giveTime) {
      setGiveTimeError(requiredMessage);
    } else if (!afterTimeVote) {
      setAfterTimeVoteError(requiredMessage);
    }
    else {
      onCmpSave();
    }
  };

  const onCmpSave = () => {
    var allDatainfo = {
      ...allSettingData.CPMSettings,
      ...allSettingData.voteRules,
    }
    allDatainfo["maxVotes"] = afterTimeVote
    allDatainfo["timeLimit"] = giveTime

    console.log(allDatainfo, "allDatainfo")

    dispatch(
      updateVoteSetting(allDatainfo),
    );
  };
  const handleChangeValue = (e, type) => {
    let name = e.target.name;
    let value = e.target.value
    setWalletDetails({ ...walletDetails, [name]: value })
    // setErrorValue({
    //     coinError: "",
    //     walletError: ""
    // })
  }

  console.log(walletDetails, "WalletDetails")


  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {/* <Box className={classes.authContent}> */}
        <form className={classes.bigDiv} >
          <div className={classes.itmeCenter}><h4>{(`Wallet Adderss`).toLocaleUpperCase()}</h4></div>

          {walletDetailsObj.map((item, index) => {
            return (<div key={index} className='' style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", alignItems: "center", padding: "20px 0px" }} >
              <Box style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }} >
                <TextField
                  style={{ margin: "0px 20px" }}
                  // fullWidth
                  type="text"
                  label={"Coin"}
                  value={item.coin}
                  margin="normal"
                  variant="outlined"
                  className={classes.textFieldRoot}
                  disabled={true}

                />

                <TextField
                  style={{ margin: "0px 20px" }}
                  // fullWidth
                  type="text"
                  label={
                    "Wallet Address"
                  }
                  value={item.address}
                  margin="normal"
                  variant="outlined"

                  className={classes.textFieldRoot}
                  disabled={true}
                />

              </Box>
              <div>
                <div
                  className={classes.buttonDiv}
                >
                  {/* <IntlMessages id="appModule.submit" /> */}
                  -
                </div>
              </div>
            </div>)
          })}


          <div className='' style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", alignItems: "center", padding: "20px 0px" }} >
            <Box style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }} >
              <FormControl
                // fullWidth
                style={{ width: "220px", margin: "0px 20px" }}
                variant="outlined"
              >
                <InputLabel id="demo-simple-select-helper-label">Select Coin</InputLabel>
                <Select
                  // multiple
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={walletDetails.coin}
                  name="coin"
                  onChange={(e) => {
                    handleChangeValue(e, "")
                  }}
                >
                  {
                    coinList.map((item, index) => {
                      return <MenuItem value={item} key={index}>{item}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>

              <TextField
                style={{ margin: "0px 20px" }}
                // fullWidth
                type="text"
                name="address"
                value={walletDetails.address}
                label={
                  "Wallet Address"
                }
                margin="normal"
                variant="outlined"

                className={classes.textFieldRoot}
                onChange={(e) => {
                  handleChangeValue(e, "")
                }}
              />

            </Box>
            <div>
              <div
                className={classes.buttonDiv}
              >
                {/* <IntlMessages id="appModule.submit" /> */}
                +
              </div>
            </div>
          </div>

          <div className={classes.itmeCenter}>
            <h4>{(`Wallet Adderss`).toLocaleUpperCase()}</h4>
          </div>
          <div
            style={{
              margin: "0px 10px"
            }}
          >
            <div className={classes.RadioButton}>
              <Radio
                checked={selectRadio === 'IMMEDIATE'}
                onChange={() =>
                  setSelectRadio('IMMEDIATE')
                }
                value="a"
                name="radio-buttons"
                inputProps={{ 'aria-label': 'A' }}
                style={{
                  color: "#3f51b5"
                }}
              />
              <label htmlFor="immediate" >IMMEDIATE</label>
            </div>
            <div className={classes.RadioButton}>
              <Radio
                checked={selectRadio == 'LIMIT'}
                onChange={() =>
                  setSelectRadio('LIMIT')
                }
                value="a"
                name="radio-buttons"
                inputProps={{ 'aria-label': 'A' }}
                style={{
                  color: "#3f51b5"
                }}
              />
              <label htmlFor="limit" >LIMIT</label>
            </div>
            {selectRadio == 'LIMIT' && <div style={{
              margin: "5px 0px 20px 50px",
              display: "flex"
            }}>
              <div className={classes.CheckboxDiv}>
                <Checkbox
                  style={{ fontSize: "20px", marginRight: "10px", color: "#3f51b5" }}
                  type="checkbox"
                  id={`Time`}
                  checked={limitType == 'TIME'}
                  onChange={() => {
                    setLimitType("TIME")
                  }}
                />
                <label htmlFor="default-checkbox" style={{ marginRight: "20px" }}> {"Time"} </label>
              </div>
              <div className={classes.CheckboxDiv}>
                <Checkbox
                  style={{ fontSize: "20px", marginRight: "10px", color: "#3f51b5" }}
                  type="checkbox"
                  id={`Amount`}
                  checked={limitType == 'AMOUNT'}
                  onChange={() => {
                    setLimitType("AMOUNT")
                  }}
                />
                <label htmlFor="default-checkbox" style={{ marginRight: "20px" }}> {"Amount"} </label>
              </div>

              <div className={classes.CheckboxDiv}>
                <Checkbox
                  style={{ fontSize: "20px", marginRight: "10px", color: "#3f51b5" }}
                  type="checkbox"
                  id={`AnyofThem`}
                  checked={limitType == 'ANYOFTHEM'}
                  onChange={() => {
                    setLimitType("ANYOFTHEM")
                  }}
                />
                <label htmlFor="default-checkbox" style={{ marginRight: "20px" }} > {"Any of Them"} </label>
              </div>
            </div>}
            {limitType == 'TIME' && <div className={`${window.screen.width > 350 ? 'd-flex ' : ''}mt-2`} style={{ marginLeft: '2em', marginBottom: "10px" }}>
              <FormControl
                // fullWidth
                style={{ width: "220px", margin: "0px 20px" }}
                variant="outlined"
              >
                <InputLabel id="demo-simple-select-helper-label">Please Select</InputLabel>
                <Select
                  // multiple
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  defaultValue={timeType}
                  value={timeValue}
                  onChange={e => {
                    // setTimeAmount({ ...timeAmount, time: e.target.value })                      
                    setTimeValue(e.target.value)
                  }}
                >
                  <MenuItem value=''>Please Select</MenuItem>
                  <MenuItem value='1 DAY'>1 Day</MenuItem>
                  <MenuItem value='1 WEEK'>1 Week</MenuItem>
                  <MenuItem value='1 MONTH'>1 Month</MenuItem>
                </Select>
              </FormControl>
            </div>}
            {limitType == 'AMOUNT' &&
              <div
                style={{ marginLeft: '2em', marginBottom: "10px" }}
              >
                <TextField
                  style={{ margin: '0px 20px' }}
                  maxLength={10}
                  type="text" name="" id=""
                  label={
                    "Enter Amount"
                  }
                  margin="normal"
                  variant="outlined"

                  className={classes.textFieldRoot}
                  value={amountValue}
                  onChange={(e) => {
                    const re = /^[0-9\b]+$/;
                    if (e.target.value === '' || re.test(e.target.value)) {
                      setAmountValue(e.target.value)
                    }
                  }}
                />
              </div>
            }

            {limitType == 'ANYOFTHEM' && <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px"
              }}
            >


              <div style={{ marginLeft: '2em' }}>
                <FormControl
                  // fullWidth
                  style={{ width: "220px", margin: "0px 20px" }}
                  variant="outlined"
                >
                  <InputLabel id="demo-simple-select-helper-label">Please Select</InputLabel>
                  <Select
                    // multiple
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    defaultValue={timeType}
                    value={timeValue}
                    onChange={e => {
                      // setTimeAmount({ ...timeAmount, time: e.target.value })                      
                      setTimeValue(e.target.value)
                    }}
                  >
                    <MenuItem value=''>Please Select</MenuItem>
                    <MenuItem value='1 DAY'>1 Day</MenuItem>
                    <MenuItem value='1 WEEK'>1 Week</MenuItem>
                    <MenuItem value='1 MONTH'>1 Month</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div
                style={{ marginLeft: '20px' }}
              >
                <TextField

                  maxLength={10}
                  type="text" name="" id=""
                  label={
                    "Enter Amount"
                  }
                  margin="normal"
                  variant="outlined"

                  className={classes.textFieldRoot}
                  value={amountValue}
                  onChange={(e) => {
                    const re = /^[0-9\b]+$/;
                    if (e.target.value === '' || re.test(e.target.value)) {
                      setAmountValue(e.target.value)
                    }
                  }}
                />
              </div>
            </div>
            }

          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              style={{
                marginBottom: "20px"
              }}
              type="reset"
              // onClick={rest()}
              variant="contained" color="primary">
              {/* <IntlMessages id="appModule.reset" /> */}
              Update Wallet
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default WalletDetailsModule;
