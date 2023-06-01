import React, { useEffect, useState } from 'react';
import { Paper, Table, TableCell, TableContainer, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import FollowTableListRow from './FollowTableListRow';
import UserTableHead from './FollowTableHead';
import UserTableToolbar from './FollowTableToolbar';
import { getComparator, stableSort } from '../../../@jumbo/utils/tableHelper';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getFollowTable, getFollowersUsers, getFollowingUsers, setCurrentFollowTable, setFollowingUsers } from '../../../redux/actions/ThreeTable';
import ConfirmDialog from '../../../@jumbo/components/Common/ConfirmDialog';
import { useDebounce } from '../../../@jumbo/utils/commonHelper';
import useStyles from './index.style';
import UserDetailView from './FollowTableDetailView';
import NoRecordFound from './NoRecordFound';
import { useParams } from 'react-router';

const UsersModule = () => {
  const classes = useStyles();
  const { followerUsersList } = useSelector(({ ThreeTable }) => ThreeTable);
  const [orderBy, setOrderBy] = React.useState('name');
  const [order, setOrder] = React.useState('asc');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ name: '' });
  const [usersFetched, setUsersFetched] = useState(false);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);


  console.log(followerUsersList,"followerUsersList")
  const dispatch = useDispatch();
  const params = useParams();
  const userId=params.userId
  console.log(params.userId,"paramsName")
  useEffect(() => {
    dispatch(
      getFollowingUsers(userId,filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setUsersFetched(true);
      }),
    );
  }, [dispatch, filterOptions, debouncedSearchTerm]);

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    dispatch(setCurrentFollowTable(null));
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrderBy(property);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = followerUsersList.map(n => n.id);
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
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
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
    dispatch(setFollowingUsers(user));
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    dispatch(setFollowingUsers(null));
  };

  const handleUserEdit = user => {
    dispatch(setFollowingUsers(user));
    setOpenUserDialog(true);
  };

  const handleUserDelete = user => {
    setSelectedUser(user);
    setOpenConfirmDialog(true);
  };
  

  

  const isSelected = id => selected.indexOf(id) !== -1;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <UserTableToolbar
          selected={selected}
          setSelected={setSelected}
          onUserAdd={setOpenUserDialog}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <TableContainer className={classes.container}>
          <Table stickyHeader className={classes.table} aria-labelledby="tableTitle" aria-label="sticky enhanced table">
            <UserTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={followerUsersList.length}
            />
            <TableBody>
              {!!followerUsersList.length ? (
                stableSort(followerUsersList, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <FollowTableListRow
                      key={index}
                      row={row}
                      onRowClick={handleRowClick}
                      onUserEdit={handleUserEdit}
                      onUserDelete={handleUserDelete}
                      onUserView={handleUserView}
                      isSelected={isSelected}
                    />
                  ))
              ) : (
                <TableRow style={{ height: 53 * 6 }}>
                  <TableCell colSpan={7} rowSpan={10}>
                    {isFilterApplied ? (
                      <NoRecordFound>There are no records found with your filter.</NoRecordFound>
                    ) : (
                      <NoRecordFound>{usersFetched ? 'There are no records found.' : 'Loading followerUsersList...'}</NoRecordFound>
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
          count={followerUsersList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      {/* {openUserDialog && <AddEditUser open={openUserDialog} onCloseDialog={handleCloseUserDialog} />} */}
      {openViewDialog && <UserDetailView open={openViewDialog} onCloseDialog={handleCloseViewDialog} />}

    </div>
  );
};

export default UsersModule;
