import React, { useEffect, useState } from 'react';
import { Paper, Tab, Table, TableCell, TableContainer, TableRow, Tabs } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import CardListRow from '../CardListRow';
import UserTableHead from '../UserTableHead';
import UserTableToolbar from '../UserTableToolbar';

import { useDispatch, useSelector } from 'react-redux';

import AddEditCard from '../AddEditCard';


import useStyles from '../index.style';
import CardDetailView from '../CardDetailView';
import NoRecordFound from '../NoRecordFound';
import ConfirmDialog from '@jumbo/components/Common/ConfirmDialog';
import { useDebounce } from '@jumbo/utils/commonHelper';
import { getComparator ,stableSort} from '@jumbo/utils/tableHelper';
import { deleteRewardCard, getRewardAlbum, getRewardCard, setCurrentCard, updateRewardCard } from 'redux/actions/RewardNft';

const RewardCardList = () => {
  const classes = useStyles();  
  const { cardList , albumList} = useSelector(({ RewardNFT }) => RewardNFT);
  const [orderBy, setOrderBy] = React.useState('name');
  const [order, setOrder] = React.useState('asc');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [ openStatusDialog, setOpenStatusDialog ] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ name: '' });
  const [usersFetched, setUsersFetched] = useState(false);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getRewardCard(filterOptions, debouncedSearchTerm,page,rowsPerPage,orderBy,order, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setUsersFetched(true);
      }),
    );
  }, [dispatch, filterOptions, debouncedSearchTerm, page, rowsPerPage, orderBy, order]);
  
    useEffect(() => {
    dispatch(
      getRewardAlbum(filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setUsersFetched(true);
      }),
    );
  }, [dispatch, filterOptions, debouncedSearchTerm]);

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    dispatch(setCurrentCard(null));
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrderBy(property);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = cardList.map(n => n.id);
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
    dispatch(setCurrentCard(user));
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    dispatch(setCurrentCard(null));
  };

  const handleUserEdit = user => {
    dispatch(setCurrentCard(user));
    setOpenUserDialog(true);
  };

  const handleStatusUpdate = user => {
    setSelectedUser(user);
    setOpenStatusDialog(true);
  };
const handleConfirmUpdate = () => {
    setOpenStatusDialog(false);
  dispatch(updateRewardCard(selectedUser?.cardId, {
    ...selectedUser,
    cardStatus: `${selectedUser?.cardStatus == "Active" ? "Inactive" : "Active"}`
  }));

  console.log({
    ...selectedUser,
    cardStatus: `${selectedUser?.cardStatus == "Active" ? "Inactive" : "Active"}`
  },"checkstatusUpdate")
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
    dispatch(deleteRewardCard(selectedUser.albumId));
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
  };

  const isSelected = id => selected.indexOf(id) !== -1;



  return (
    <>      
    <div className={classes.root}>
      <Paper className={classes.paper}>
          <UserTableToolbar
          selectType={"card"}
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
                selectType={"card"}
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={cardList.length}
            />
            <TableBody>
              {!!cardList.length ? (
                stableSort(cardList, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <CardListRow
                      key={index}
                      row={row}
                      onRowClick={handleRowClick}
                      onUserEdit={handleUserEdit}
                      onUserDelete={handleUserDelete}
                      onUserView={handleUserView}
                      isSelected={isSelected}
                      onUserStatusUpdate={handleStatusUpdate}
                    />
                  ))
              ) : (
                <TableRow style={{ height: 53 * 6 }}>
                  <TableCell colSpan={7} rowSpan={10}>
                    {isFilterApplied ? (
                      <NoRecordFound>There are no records found with your filter.</NoRecordFound>
                    ) : (
                      <NoRecordFound>{usersFetched ? 'There are no records found.' : 'Loading cardList...'}</NoRecordFound>
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
          count={cardList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      {openUserDialog && <AddEditCard selectType={"card"} open={openUserDialog} onCloseDialog={handleCloseUserDialog} />}
      {openViewDialog && <CardDetailView selectType={"card"} open={openViewDialog} onCloseDialog={handleCloseViewDialog} />}

      <ConfirmDialog
        open={openConfirmDialog}
        title={`Confirm delete ${selectedUser.name}`}
        content={'Are you sure, you want to  delete this user?'}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        />
        <ConfirmDialog
        open={openStatusDialog}
        title={`Confirm Status Change ${selectedUser.cardName}`}
        content={`Are you sure, you want to ${selectedUser?.cardStatus=="Active"?"Inactive":"Active"} this Card?`}
        onClose={handleCancelUpdate}
        onConfirm={handleConfirmUpdate}
      />
      </div>
      </>
  );
};

export default RewardCardList;
