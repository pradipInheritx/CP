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
  sentMailToSubAdmin,
  updateSubAdminStatus
} from "../../../../redux/actions/SubAdmin";

const useStyles = makeStyles(theme => ({
  titleRoot: {
    marginBottom: 2,
    fontSize: 14,
    letterSpacing: 0.25,
    color: theme.palette.common.dark
  }
}));

const getUserActions = user => {
  console.log(user,"userstatus")
  const actions = [
    {action: "view", label: "View", icon: <Visibility />},
    // {action: "edit", label: "Edit", icon: <Edit />},
    // {action: "email", label: "Email", icon: <Mail />}
  ];

  // if (user?.chosen === true) {
  //   actions.push({action: false, label: "Inactive", icon: <Block />});
  // } else {
  //   actions.push({
  //     action: true,
  //     label: "Active",
  //     icon: <CheckCircleOutline />
  //   });
  // }

  // actions.push({action: "delete", label: "Delete", icon: <Delete />});
  return actions;
};

const RewardTrListRow = ({
  row,
  isSelected,
  onRowClick,
  onUserEdit,
  onUserDelete,
  onUserView,
  onUserStatusUpdate
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const onUserMenuClick = menu => {
    // console.log(  row,"menuData")
    if (menu.action === "view") {
      onUserView(row);
    } else if (menu.action === "edit") {
      onUserEdit(row);
    }
    // else if (menu.action === "email") {
    //   dispatch(sentMailToSubAdmin());
    // }
    // else if (menu.action === false) {      
    //   dispatch(updateSubAdminStatus(row?.id,{ status: "Inactive"}));
    //   onUserStatusUpdate(row)
    // } else if (menu.action === true) {
    //   dispatch(updateSubAdminStatus(row?.id ,{ status: "Active"}));
    //   onUserStatusUpdate(row)
    // }
    else if (menu.action === "delete") {
      onUserDelete(row);
    }
  };

  const labelId = `enhanced-table-checkbox-${row?.id}`;
  const isItemSelected = isSelected(row?.id);
  const userActions = getUserActions(row);

  return (
    <TableRow
      hover
      // onClick={event => onRowClick(event, row?.id)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row?.id}
      selected={isItemSelected}
    >
      {/* <TableCell padding="checkbox">
        <Checkbox
          checked={isItemSelected}
          inputProps={{"aria-labelledby": labelId}}
        />
      </TableCell> */}
      {/* <TableCell component="th" id={labelId} scope="row" padding="none">
        <Box display="flex" alignItems="center">          
          <div>
            <Typography
              className={classes.titleRoot}
              component="div"
              variant="h4"
            >
              {row?.Coin} 
            </Typography>
          </div>
        </Box>
      </TableCell> */}
      <TableCell>{row?.displayName}</TableCell>
      <TableCell>{row?.totalVote}</TableCell>
      <TableCell>{row?.successVote}</TableCell>
      
      {/* <TableCell>{row?.phone}</TableCell> */}
      {/* <TableCell>
        {row?.chosen === "false" ? (
          
        `Inactive`
        ) : (
          
            `Active`
        )}
      </TableCell> */}
      <TableCell>{row?.userScore}</TableCell>
      <TableCell>{row?.userRank}</TableCell>
      <TableCell>{row?.userRank}</TableCell>
      {/* <TableCell align="right">{row.emailUsage} GB</TableCell> */}
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

export default React.memo(RewardTrListRow);
