import React from "react";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableRow from "@material-ui/core/TableRow";
import {timeFromNow} from "../../../../@jumbo/utils/dateHelper";
import {
  Block,
  CheckCircleOutline,
  Delete,
  Edit,
  Mail,
  MoreHoriz,
  Visibility
} from "@material-ui/icons";
import CmtDropdownMenu from "../../../../@coremat/CmtDropdownMenu";
import CmtAvatar from "../../../../@coremat/CmtAvatar";
import {Box, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import {
  // sentMailToUser,
  updatePairStatus
} from "../../../../redux/actions/Pairs";

const useStyles = makeStyles(theme => ({
  titleRoot: {
    marginBottom: 2,
    fontSize: 14,
    letterSpacing: 0.25,
    color: theme.palette.common.dark
  }
}));

const getUserActions = user => {
  const actions = [
    {action: "view", label: "View", icon: <Visibility />},
    // {action: "edit", label: "Edit", icon: <Edit />},
    {action: "UpdateBar", label: "Update Bar", icon: <Edit />}
    // {action: "email", label: "Email", icon: <Mail />}
  ];

  if (user.status === "Active") {
    actions.push({action: "Inactive", label: "Inactive", icon: <Block />});
  } else {
    actions.push({
      action: "Active",
      label: "Reactivate",
      icon: <CheckCircleOutline />
    });
  }

  // actions.push({action: "delete", label: "Delete", icon: <Delete />});
  return actions;
};

const PairListRow = ({
  row,
  isSelected,
  onRowClick,
  onUserEdit,
  onUpdateBar,
  onUserStatusUpdate,
  onUserDelete,
  onUserView
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const onUserMenuClick = menu => {
    if (menu.action === "view") {
      onUserView(row);
    } else if (menu.action === "edit") {
      onUserEdit(row);
    } else if (menu.action === "UpdateBar") {
      onUpdateBar(row);
    } else if (menu.action === "Inactive") {
      onUserStatusUpdate(row)
      // dispatch(updatePairStatus({id: row.id, status: "suspended"}));
    } else if (menu.action === "Active") {
      onUserStatusUpdate(row)
      // dispatch(updatePairStatus({id: row.id, status: "active"}));
    } else if (menu.action === "delete") {
      onUserDelete(row);
    }
  };

  const labelId = `enhanced-table-checkbox-${row.id}`;
  const isItemSelected = isSelected(row.id);
  const userActions = getUserActions(row);

  return (
    <TableRow
      hover
      // onClick={event => onRowClick(event, row.id)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.id}
      selected={isItemSelected}
    >
      {/* <TableCell padding="checkbox">
        <Checkbox
          checked={isItemSelected}
          inputProps={{"aria-labelledby": labelId}}
        />
      </TableCell> */}
      {/* <TableCell component="th" id={labelId} scope="row" padding="normal">
        <Box display="flex" alignItems="center">
          <Box mr={{xs: 4, md: 5}}>
            <CmtAvatar size={40} src={row.profile_pic} alt={row.name} />
          </Box>
          <div>
            <Typography
              className={classes.titleRoot}
              component="div"
              variant="h4"
            >
              {row.name}
            </Typography>
          </div>
        </Box>
      </TableCell> */}
      <TableCell padding="normal">{row?.symbol1}</TableCell>
      <TableCell>{row?.symbol2}</TableCell>
      <TableCell>
        {row?.status === "Inactive" ? `Inactive` : row.status}
      </TableCell>
      <TableCell>{row.voteBarRange && row.voteBarRange[0] || 0}</TableCell>
      <TableCell>{row.voteBarRange && row.voteBarRange[1] || 0 }</TableCell>
      <TableCell>{row.voteBarRange && row.voteBarRange[2] || 0 }</TableCell>
      <TableCell>{row.voteBarRange && row.voteBarRange[3] || 0 }</TableCell>          
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

export default React.memo(PairListRow);
