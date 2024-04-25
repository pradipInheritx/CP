import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { MoreHoriz, Visibility } from "@material-ui/icons";
import CmtDropdownMenu from "../../../../@coremat/CmtDropdownMenu";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

const useStyles = makeStyles(theme => ({
  titleRoot: {
    marginBottom: 2,
    fontSize: 14,
    letterSpacing: 0.25,
    color: theme.palette.common.dark
  }
}));

const getUserActions = user => {
  const actions = [{ action: "view", label: "View", icon: <Visibility /> }];
  return actions;
};

const UserListRow = ({ row, isSelected, onUserView }) => {
  const onUserMenuClick = menu => {
    if (menu.action === "view") {
      onUserView(row);
    }
  };

  const isItemSelected = isSelected(row?.id);
  const userActions = getUserActions(row);

  function convertToDate(date) {
    if (!date) return "-";
    const epochTime = new Date(date * 1000);
    const formattedDate = moment(epochTime).format("YYYY-DD-MM");
    return formattedDate;
  }

  return (
    <TableRow
      hover
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row?.id}
      selected={isItemSelected}
    >
      <TableCell align="center">
        {row?.userName ? row?.userName : row?.name ? row?.name : "-"}
      </TableCell>
      <TableCell align="center">
        {convertToDate(row?.signUpTime?._seconds) || "-"}
      </TableCell>
      <TableCell align="center">
        {convertToDate(row?.lastVoteDay?._seconds) || "-"}
      </TableCell>
      <TableCell align="center">
        {convertToDate(row?.lastLoginDay?._seconds)}
      </TableCell>
      <TableCell align="center">{row?.email || "-"}</TableCell>
      <TableCell align="center">
        {row?.Country ? row?.Country.trim() || "-" : "-"}
      </TableCell>
      <TableCell align="center">{row?.GameTitle || "-"}</TableCell>
      <TableCell align="center">{row?.TotalCPM || "-"}</TableCell>
      <TableCell>{row?.totalVotes || "-"}</TableCell>
      <TableCell align="center">{row?.averageVotes || "-"}</TableCell>
      <TableCell align="center">{row?.noOfVotesDays || "-"}</TableCell>
      <TableCell align="center">{row?.extraVotePurchased || "-"}</TableCell>
      <TableCell align="center">{row?.source || "-"}</TableCell>
      <TableCell align="center">{row?.TotalAmbassadorRewards || "-"}</TableCell>
      <TableCell align="center">{row?.userId || "-"}</TableCell>
      <TableCell align="center" onClick={event => event.stopPropagation()}>
        <CmtDropdownMenu
          items={userActions}
          onItemClick={onUserMenuClick}
          TriggerComponent={<MoreHoriz />}
        />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(UserListRow);
