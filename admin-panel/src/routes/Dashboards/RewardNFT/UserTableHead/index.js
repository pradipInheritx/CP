import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import PropTypes from 'prop-types';
import React from 'react';

const headCells = [
  {
    id: 'Album Name',
    numeric: false,
    disablePadding: false,
    label: 'Album Name',
    type:"album",
  },
  { id: 'Total Sets', numeric: false, disablePadding: false, label: 'Total Sets' ,type:"album"},
  { id: 'Total Card', numeric: false, disablePadding: false, label: 'Total Card' ,type:"album"},
  { id: 'Relative Quanlity', numeric: false, disablePadding: false, label: 'Relative Quanlity' ,type:"album"},
  { id: 'Random Card', numeric: false, disablePadding: false, label: 'Random Card' ,type:"album"},
  { id: 'Distribution limit', numeric: false, disablePadding: false, label: 'Distribution limit' ,type:"album"},  
  
  { id: 'Card Name', numeric: false, disablePadding: false, label: 'Card Name' ,type:"card"},
  { id: 'CardType', numeric: false, disablePadding: false, label: 'Card Type' ,type:"card"},
  { id: 'Status', numeric: false, disablePadding: false, label: 'Status' ,type:"card"},
  { id: 'Rarity', numeric: false, disablePadding: false, label: 'Rarity' ,type:"card"},
  { id: 'Collection', numeric: false, disablePadding: false, label: 'Collection' ,type:"card"},
  { id: 'Minted Time', numeric: false, disablePadding: false, label: 'Minted Time' ,type:"card"},
  { id: 'Quanlity', numeric: false, disablePadding: false, label: 'Quanlity' ,type:"card"},
  { id: 'No. of Holders', numeric: false, disablePadding: false, label: 'No. of Holders' ,type:"card"},
  
];

function UserTableHead({ classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort ,selectType}) {
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
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell> */}
        {headCells.map((headCell) => 
        {
          return (
            <>
            {headCell.type== selectType && <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={onSortOrderChange(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
              ) : null}
            </TableSortLabel>
              </TableCell>}
              </>
              )
          
        }                                        
        )}
        <TableCell align="center">Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

UserTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default React.memo(UserTableHead);

//  <TableCell
//             key={headCell.id}
//             align={headCell.numeric ? 'right' : 'left'}
//             padding={headCell.disablePadding ? 'none' : 'normal'}
//             sortDirection={orderBy === headCell.id ? order : false}>
//             <TableSortLabel
//               active={orderBy === headCell.id}
//               direction={orderBy === headCell.id ? order : 'asc'}
//               onClick={onSortOrderChange(headCell.id)}>
//               {headCell.label}
//               {orderBy === headCell.id ? (
//                 <span className={classes.visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
//               ) : null}
//             </TableSortLabel>
//           </TableCell>  