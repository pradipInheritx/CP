import React, {useEffect, useState} from "react";
import Toolbar from "@material-ui/core/Toolbar";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import PropTypes from "prop-types";
import {Button, Chip, Grid, InputLabel, Menu, MenuItem, Select} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import ConfirmDialog from "../../../../@jumbo/components/Common/ConfirmDialog";
import CmtSearch from "../../../../@coremat/CmtSearch";
import useStyles from "./index.style";
import Checkbox from "@material-ui/core/Checkbox";
import AppSelectBox from "@jumbo/components/Common/formElements/AppSelectBox";
import { getRewardTr } from "redux/actions/RewardTr";

const filterOptionsList = [
  {label: "Active", value: "active"},
  {label: "Suspended", value: "suspended"}
];

const RewardTrTableToolbar = ({
  selected,
  setSelected,
  onUserAdd,
  filterOptions,
  setFilterOptions,
  searchTerm,
  setSearchTerm
}) => {
  const classes = useStyles();
  const [ openConfirmDialog, setOpenConfirmDialog ] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [getUserID, setGetUserID] = React.useState("none");
  // const [fullList, setFullList] = React.useState([]);
  

  const dispatch = useDispatch();
  const { usersDetelisList } = useSelector(({ UsersDetelis }) => UsersDetelis);

  const fullList=[] 

// useEffect(() => {
//   if (usersDetelisList) {
//     usersDetelisList.map((item ,index) => {
//       fullList.push({uid:item.uid, slug:item.displayName})
//     })
//   }
// }, [usersDetelisList])

// console.log(fullList,"afullList")
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onDeleteCLick = () => {
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setOpenConfirmDialog(false);
    // dispatch(deleteBulkSubAdmin(selected, () => setSelected([])));
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
  };

  const onFilterOptionClick = option => {
    setFilterOptions(prevState => {
      if (prevState.includes(option.value)) {
        return prevState.filter(item => item !== option.value);
      } else {
        return [ ...prevState, option.value ];
      }
    });
  };

  const onChipDelete = option => {
    setFilterOptions(filterOptions.filter(item => item !== option.value));
  };

  const onSearchChipDelete = () => setSearchTerm("");

  const numSelected = selected.length;

  const getRewardTRList = (id) => {
    const IdData = {
      data: {
        "uid": `${id}`
      }
    }
    dispatch(
        getRewardTr(IdData)        
      );
  }


  return (
    <React.Fragment>
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0
        })}
      >
        {numSelected > 0 ? (
          <Typography
            className={classes.title}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            className={classes.title}
            variant="h4"
            id="tableTitle"
            component="div"
          >
              {/* Users{" "} */}
            Reward Transactions
          </Typography>
        )}

        <Grid item xs={12} sm={6}>
                  {/* <InputLabel id="demo-simple-select-autowidth-label">Select User</InputLabel> */}
              <Select
                  fullWidth
                  data={usersDetelisList}
                  labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                  label="Select User"
                  valueKey="slug"
                  variant="outlined"
                  labelKey="title"
                  value={getUserID}
                onChange={e => {
                  setGetUserID(e.target.value);
                  // setCollocationError('');
                }}
                // helperText={collocationError}                     
          >
            <MenuItem value={"none"}>
              Select User 
            </MenuItem>
          {usersDetelisList.map((item, index) => {
          return (
            <MenuItem key={index} value={item.uid}
              onClick={()=>getRewardTRList(item.uid)}
            >
              {item.displayName || "-"}
            </MenuItem>
          );
          })}
        </Select>
        </Grid>
        

        
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="delete" onClick={onDeleteCLick}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <React.Fragment>
            <CmtSearch
              onChange={e => setSearchTerm(e.target.value)}
              value={searchTerm}
              border={false}
              onlyIcon
            />
            <div className={classes.chipsRoot}>
              {searchTerm && (
                <Chip label={searchTerm} onDelete={onSearchChipDelete} />
              )}
              {filterOptionsList.map(
                (option, index) =>
                  filterOptions.includes(option.value) && (
                    <Chip
                      key={index}
                      label={option.label}
                      onDelete={() => onChipDelete(option)}
                    />
                  )
              )}
            </div>
            <Tooltip title="Filter list">
              <IconButton aria-label="filter list" onClick={handleClick}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Menu
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {filterOptionsList.map((option, index) => (
                <MenuItem
                  key={index}
                  onClick={() => onFilterOptionClick(option)}
                >
                  <Checkbox
                    checked={filterOptions.includes(option.value)}
                    inputProps={{"aria-labelledby": option.label}}
                  />
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </React.Fragment>
        )}
      </Toolbar>

      <ConfirmDialog
        open={openConfirmDialog}
        title={`Confirm delete Coin Pair`}
        content={"Are you sure, you want to  delete selected Coin Pair?"}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </React.Fragment>
  );
};

RewardTrTableToolbar.propTypes = {
  selected: PropTypes.array,
  setSelected: PropTypes.func,
  filterOptions: PropTypes.array,
  setFilterOptions: PropTypes.func,
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
  onUserAdd: PropTypes.func
};

export default React.memo(RewardTrTableToolbar);
