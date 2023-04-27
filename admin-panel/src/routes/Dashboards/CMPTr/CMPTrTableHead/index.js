import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import PropTypes from "prop-types";
import React from "react";

const headCells = [
  {
    id: "TransactionID",
    numeric: false,
    disablePadding: false,
    label: "Transaction ID"
  },
  {id: "TransactionType", numeric: false, disablePadding: false, label: "Transaction Type"},  
  { id: "ConnectActionID", numeric: false, disablePadding: false, label: "Connect Action ID" },
  
  {
    id: "Transaction Time",
    numeric: false,
    disablePadding: false,
    label: "Transaction Time"
  },
  {
    id: "Transaction Amount",
    numeric: false,
    disablePadding: false,
    label: "Transaction Amount"
  },
  {
    id: "Status",
    numeric: false,
    disablePadding: false,
    label: "Status"
  },
  {
    id: "Child Action",
    numeric: false,
    disablePadding: false,
    label: "Child Action"
  },
  {
    id: "CMP Balance",
    numeric: false,
    disablePadding: false,
    label: "CMP Balance"
  },
  {
    id: "User",
    numeric: false,
    disablePadding: false,
    label: "User"
  },
  // { id: 'emailUsage', numeric: true, disablePadding: false, label: 'Email Usage' },
];

function CMPTrTableHead({
  classes,
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort
}){
  const onSortOrderChange = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{"aria-label": "select all desserts"}}
          />
        </TableCell> */}
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={onSortOrderChange(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="center">Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

CMPTrTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf([ "asc", "desc" ]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

export default React.memo(CMPTrTableHead);
