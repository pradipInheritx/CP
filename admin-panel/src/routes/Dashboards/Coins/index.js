import React, {useEffect, useState} from "react";
import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow
} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import CoinListRow from "./CoinListRow";
import CoinTableHead from "./CoinTableHead";
import UserTableToolbar from "./UserTableToolbar";
import {getComparator, stableSort} from "../../../@jumbo/utils/tableHelper";
import {useDispatch, useSelector} from "react-redux";
import {
  deleteCoin,
  getCoins,
  setCurrentCoin
} from "../../../redux/actions/Coins";
import AddEditCoin from "./AddEditCoin";
import ConfirmDialog from "../../../@jumbo/components/Common/ConfirmDialog";
import {useDebounce} from "../../../@jumbo/utils/commonHelper";
import useStyles from "./index.style";
import CoinDetailView from "./CoinDetailView";
import NoRecordFound from "./NoRecordFound";
import UpdateCoinBar from "./UpdateCoinBar";

const CoinsModule = () => {
  const classes = useStyles();
  const {coinList} = useSelector(({coinReducer}) => coinReducer);
  const [ orderBy, setOrderBy ] = React.useState("name");
  const [ order, setOrder ] = React.useState("asc");
  const [ page, setPage ] = React.useState(0);
  const [ rowsPerPage, setRowsPerPage ] = React.useState(10);
  const [ selected, setSelected ] = React.useState([]);
  const [ openViewDialog, setOpenViewDialog ] = useState(false);
  const [ openUserDialog, setOpenUserDialog ] = useState(false);
  const [ openUpdatelog, setOpenUpdatelog ] = useState(false);
  const [ openConfirmDialog, setOpenConfirmDialog ] = useState(false);
  const [ selectedUser, setSelectedUser ] = useState({name: ""});
  const [ usersFetched, setUsersFetched ] = useState(false);
  const [ isFilterApplied, setFilterApplied ] = useState(false);
  const [ filterOptions, setFilterOptions ] = React.useState([]);
  const [ searchTerm, setSearchTerm ] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(
        getCoins(filterOptions, debouncedSearchTerm, () => {
          setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
          setUsersFetched(true);
        })
      );
    },
    [ dispatch, filterOptions, debouncedSearchTerm ]
  );
  // useEffect(
  //   () => {
  //     dispatch(
  //       getUsers(filterOptions, debouncedSearchTerm, () => {
  //         setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
  //         setUsersFetched(true);
  //       })
  //     );
  //   },
  //   [ dispatch, filterOptions, debouncedSearchTerm ]
  // );

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    dispatch(setCurrentCoin(null));
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrderBy(property);
    setOrder(isAsc ? "desc" : "asc");
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = coinList.map(n => n.id);
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
    dispatch(setCurrentCoin(user));
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    dispatch(setCurrentCoin(null));
  };

  const handleUserEdit = user => {
    dispatch(setCurrentCoin(user));
    setOpenUserDialog(true);
  };

  const handleUpdateBar = user => {
    dispatch(setCurrentCoin(user));
    setOpenUpdatelog(true);
  };
  const handleCloseUpdateDialog = () => {
    setOpenUpdatelog(false);
    dispatch(setCurrentCoin(null));
  };

  const handleUserDelete = user => {
    setSelectedUser(user);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setOpenConfirmDialog(false);
    dispatch(deleteCoin(selectedUser.id));
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
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
          <Table
            stickyHeader
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="sticky enhanced table"
          >
            <CoinTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={coinList.length}
            />
            <TableBody>
              {!!coinList.length ? (
                stableSort(coinList, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <CoinListRow
                      key={index}
                      row={row}
                      onRowClick={handleRowClick}
                      onUserEdit={handleUserEdit}
                      onUpdateBar={handleUpdateBar}
                      onUserDelete={handleUserDelete}
                      onUserView={handleUserView}
                      isSelected={isSelected}
                    />
                  ))
              ) : (
                <TableRow style={{height: 53 * 6}}>
                  <TableCell colSpan={7} rowSpan={10}>
                    {isFilterApplied ? (
                      <NoRecordFound>
                        There are no records found with your filter.
                      </NoRecordFound>
                    ) : (
                      <NoRecordFound>
                        {usersFetched ? (
                          "There are no records found."
                        ) : (
                          "Loading List..."
                        )}
                      </NoRecordFound>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[ 10, 20, 50 ]}
          component="div"
          count={coinList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      {openUserDialog && (
        <AddEditCoin
          open={openUserDialog}
          onCloseDialog={handleCloseUserDialog}
        />
      )}
      {openUpdatelog && (
        <UpdateCoinBar
          open={openUpdatelog}
          onCloseDialog={handleCloseUpdateDialog}
        />
      )}
      {openViewDialog && (
        <CoinDetailView
          open={openViewDialog}
          onCloseDialog={handleCloseViewDialog}
        />
      )}

      <ConfirmDialog
        open={openConfirmDialog}
        title={`Confirm delete ${selectedUser.name}`}
        content={"Are you sure, you want to  delete this user?"}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default CoinsModule;
