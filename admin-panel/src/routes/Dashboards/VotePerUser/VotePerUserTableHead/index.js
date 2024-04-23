import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import PropTypes from "prop-types";
import React from "react";

const headCells = [
  {
    id: "displayName",
    numeric: false,
    disablePadding: false,
    label: "Display Name"
  },
  {
    id: "totalVote",
    numeric: false,
    disablePadding: false,
    label: "Total Vote"
  },
  {
    id: "successVote",
    numeric: false,
    disablePadding: false,
    label: "Success Vote"
  },

  {
    id: "userScore",
    numeric: false,
    disablePadding: false,
    label: "User Score"
  },
  {
    id: "userRank",
    numeric: false,
    disablePadding: false,
    label: "User Rank"
  }
  // { id: 'emailUsage', numeric: true, disablePadding: false, label: 'Email Usage' },
];

function VotePerUserTableHead({
  classes,
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort
}) {
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
              className={classes.headerLable}
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
        <TableCell align="center" className={classes.headerLable}>
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

VotePerUserTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

export default React.memo(VotePerUserTableHead);
