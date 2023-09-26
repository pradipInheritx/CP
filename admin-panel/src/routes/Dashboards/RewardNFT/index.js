import React, { useEffect, useState } from 'react';
import { Paper, Tab, Table, TableCell, TableContainer, TableRow, Tabs } from '@material-ui/core';
import useStyles from './index.style';
import RewardAlbumList from './AlbumList';
import RewardCardList from './CardList';

const RewardNFT = () => {
  const classes = useStyles();    
//  for tab 
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    console.log(newValue,"newValue")
    setValue(newValue);
  };



  return (
    <>
      <div style={{margin:"10px 0px 20px 0px"}}>
      <Paper className={classes.root}>
      <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
        <Tab label="All Album List" />
        <Tab label="All Card List" />        
      </Tabs>
    </Paper>
      </div>   
      <div>
       {value==0? <RewardAlbumList/> : <RewardCardList />}
      </div>
      </>
  );
};

export default RewardNFT;
