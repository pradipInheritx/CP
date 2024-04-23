import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow
} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import VotePerUserListRow from "./VotePerUserListRow";
import VotePerUserTableHead from "./VotePerUserTableHead";
import VotePerUserTableToolbar from "./VotePerUserTableToolbar";
import { getComparator, stableSort } from "../../../@jumbo/utils/tableHelper";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteVotePerUser,
  getVotePerUser,
  setCurrentVotePerUser,
  updateVotePerUserStatus
} from "../../../redux/actions/VotePerUser";
import AddEditUser from "./AddEditVotePerUser";
import ConfirmDialog from "../../../@jumbo/components/Common/ConfirmDialog";
import { useDebounce } from "../../../@jumbo/utils/commonHelper";
import useStyles from "./index.style";
import TimeFrameDetailView from "./VotePerUserDetailView";
import NoRecordFound from "./NoRecordFound";

const VotePerUserModule = () => {
  const classes = useStyles();
  // const {votePerUserList} = useSelector(({subAdmin}) => subAdmin);
  const { votePerUserList, totalCount } = useSelector(
    ({ VotePerUser }) => VotePerUser
  );

  const [orderBy, setOrderBy] = React.useState("");
  const [order, setOrder] = React.useState("desc");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  const [usersFetched, setUsersFetched] = useState(false);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getVotePerUser(
        filterOptions,
        debouncedSearchTerm,
        page,
        rowsPerPage,
        orderBy,
        order,
        () => {
          setFilterApplied(!!filterOptions?.length || !!debouncedSearchTerm);
          setUsersFetched(true);
        }
      )
    );
  }, [
    dispatch,
    filterOptions,
    debouncedSearchTerm,
    page,
    rowsPerPage,
    orderBy,
    order
  ]);
  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    dispatch(setCurrentVotePerUser(null));
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrderBy(property);
    setOrder(isAsc ? "desc" : "asc");
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = votePerUserList.map(n => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleRowClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected?.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUserView = user => {
    dispatch(setCurrentVotePerUser(user));
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    dispatch(setCurrentVotePerUser(null));
  };

  const handleUserEdit = user => {
    dispatch(setCurrentVotePerUser(user));
    setOpenUserDialog(true);
  };

  const handleStatusUpdate = user => {
    setSelectedUser(user);
    setOpenStatusDialog(true);
  };
  const handleConfirmUpdate = () => {
    setOpenStatusDialog(false);
    dispatch(
      updateVotePerUserStatus(selectedUser?.timeframeId, {
        ...selectedUser,
        chosen: `${!selectedUser?.chosen}`
      })
    );
  };

  const handleCancelUpdate = () => {
    setOpenStatusDialog(false);
  };

  const handleUserDelete = user => {
    setSelectedUser(user);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setOpenConfirmDialog(false);
    dispatch(deleteVotePerUser(selectedUser.timeframeId));
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
  };

  const isSelected = id => selected.indexOf(id) !== -1;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <VotePerUserTableToolbar
          selected={selected}
          setSelected={setSelected}
          onUserAdd={setOpenUserDialog}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setPage={setPage}
        />
        <TableContainer className={classes.container}>
          <Table
            stickyHeader
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="sticky enhanced table"
          >
            <VotePerUserTableHead
              classes={classes}
              numSelected={selected?.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={votePerUserList?.length}
            />
            <TableBody>
              {!!votePerUserList.length ? (
                // stableSort(votePerUserList, getComparator(order, orderBy))
                //   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                votePerUserList?.map((row, index) => (
                  <VotePerUserListRow
                    key={index}
                    row={row}
                    onRowClick={handleRowClick}
                    onUserEdit={handleUserEdit}
                    onUserDelete={handleUserDelete}
                    onUserStatusUpdate={handleStatusUpdate}
                    onUserView={handleUserView}
                    isSelected={isSelected}
                  />
                ))
              ) : (
                <TableRow style={{ height: 53 * 6 }}>
                  <TableCell colSpan={7} rowSpan={10}>
                    {isFilterApplied ? (
                      <NoRecordFound>
                        There are no records found with your filter.
                      </NoRecordFound>
                    ) : (
                      <NoRecordFound>
                        {usersFetched
                          ? "There are no records found."
                          : "Loading..."}
                      </NoRecordFound>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      {openUserDialog && (
        <AddEditUser
          open={openUserDialog}
          onCloseDialog={handleCloseUserDialog}
        />
      )}
      {openViewDialog && (
        <TimeFrameDetailView
          open={openViewDialog}
          onCloseDialog={handleCloseViewDialog}
        />
      )}

      <ConfirmDialog
        open={openConfirmDialog}
        title={`Confirm delete ${selectedUser.firstName}`}
        content={"Are you sure, you want to  delete this Time Frame?"}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
      <ConfirmDialog
        open={openStatusDialog}
        title={`Confirm Status Change ${selectedUser?.name}`}
        content={`Are you sure, you want to ${
          selectedUser?.chosen == true ? "Inactive" : "Active"
        } this Time Frame?`}
        onClose={handleCancelUpdate}
        onConfirm={handleConfirmUpdate}
      />
    </div>
  );
};

export default VotePerUserModule;
