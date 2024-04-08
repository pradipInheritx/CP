import React, { useState } from "react";
import Toolbar from "@material-ui/core/Toolbar";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import PropTypes from "prop-types";
import {
  Button,
  Chip,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { deleteBulkUsers } from "../../../../redux/actions/Users";
import ConfirmDialog from "../../../../@jumbo/components/Common/ConfirmDialog";
import CmtSearch from "../../../../@coremat/CmtSearch";
import useStyles from "./index.style";
import { useFormik } from "formik";
import * as yup from "yup";
// import DateRangePicker from "@material-ui/lab/DateRangePicker";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { DatePicker } from "@material-ui/pickers";
import { TextField } from "@material-ui/core";

const filterOptionsList = [
  { label: "SignUp Time", value: "signUpTime" },
  { label: "Last Login Day", value: "lastLoginDay" },
  { label: "Last Vote Day", value: "lastVoteDay" }
];

const UserTableToolbar = ({
  selected,
  setSelected,
  onUserAdd,
  filterOptions,
  setFilterOptions,
  searchTerm,
  setSearchTerm,
  setFilter,
  filter
}) => {
  const classes = useStyles();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [filterTypeError, setFilterTypeError] = useState(false);

  const validationSchema = yup.object().shape({
    startDate: yup
      .date()
      .required("Start date is required")
      .max(yup.ref("endDate"), "Start date cannot be after end date"),
    endDate: yup
      .date()
      .required("End date is required")
      .min(yup.ref("startDate"), "End date must be after start date")
  });

  const dispatch = useDispatch();

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onDeleteCLick = () => {
    setOpenConfirmDialog(true);
  };

  const handleOptionChange = event => {
    setSelectedOption(event.target.value);
  };

  const handleConfirmDelete = () => {
    setOpenConfirmDialog(false);
    dispatch(deleteBulkUsers(selected, () => setSelected([])));
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
  };

  const onFilterOptionClick = option => {
    setFilterType(option.value);
    setFilterTypeError(false);
    // setFilterOptions((prevState) => {
    //   if (prevState.includes(option.value)) {
    //     return prevState.filter((item) => item !== option.value);
    //   } else {
    //     return [...prevState, option.value];
    //   }
    // });
  };

  const formik = useFormik({
    initialValues: {
      startDate: null,
      endDate: null
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      if (!selectedOption) {
        setFilterTypeError(true);
      } else {
        setFilter({ ...filter, ...values, filterFields: selectedOption });
        handleClose();
      }
    }
  });

  const handleCancel = () => {
    formik.resetForm();
    setFilterType();
    setFilterTypeError(false);
    setSelectedOption(null);
    setFilter("");
    handleClose();
  };

  const onChipDelete = option => {
    setFilterOptions(filterOptions.filter(item => item !== option.value));
  };

  const onSearchChipDelete = () => setSearchTerm("");

  const numSelected = selected.length;

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
            Users List{" "}
            {/* <Button color="primary" onClick={() => onUserAdd(true)}>
              Add New User
            </Button> */}
          </Typography>
        )}

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
              <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                {filterOptionsList.map((option, index) => (
                  <MenuItem key={index}>
                    <FormControlLabel
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                      onClick={() => onFilterOptionClick(option)}
                    />
                  </MenuItem>
                ))}
              </RadioGroup>
              {filterTypeError && (
                <span style={{ color: "red" }}>
                  {"Please select filter by key"}
                </span>
              )}

              <MenuItem>
                <TextField
                  // variant="inline"
                  type="date"
                  margin="normal"
                  id="start-date-picker"
                  label="From"
                  value={formik.values.startDate}
                  onChange={event =>
                    formik.setFieldValue("startDate", event.target.value)
                  }
                  InputLabelProps={{
                    shrink: true
                  }}
                  error={
                    formik.touched.startDate && Boolean(formik.errors.startDate)
                  }
                  helperText={
                    formik.touched.startDate && formik.errors.startDate
                  }
                  InputProps={{
                    inputProps: { max: new Date().toISOString().split("T")[0] } // Disable future dates
                  }}
                />
              </MenuItem>
              <MenuItem>
                <TextField
                  // variant="inline"
                  type="date"
                  margin="normal"
                  id="end-date-picker"
                  label="To"
                  value={formik.values.endDate}
                  onChange={event =>
                    formik.setFieldValue("endDate", event.target.value)
                  }
                  InputLabelProps={{
                    shrink: true
                  }}
                  error={
                    formik.touched.endDate && Boolean(formik.errors.endDate)
                  }
                  helperText={formik.touched.endDate && formik.errors.endDate}
                  InputProps={{
                    inputProps: { max: new Date().toISOString().split("T")[0] } // Disable future dates
                  }}
                />
              </MenuItem>
              <MenuItem>
                <Button color="primary" onClick={formik.handleSubmit}>
                  Apply
                </Button>
                <Button color="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </Toolbar>

      <ConfirmDialog
        open={openConfirmDialog}
        title={`Confirm delete users`}
        content={"Are you sure, you want to  delete selected users?"}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </React.Fragment>
  );
};

UserTableToolbar.propTypes = {
  selected: PropTypes.array,
  setSelected: PropTypes.func,
  filterOptions: PropTypes.array,
  setFilterOptions: PropTypes.func,
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
  onUserAdd: PropTypes.func
};

export default React.memo(UserTableToolbar);
