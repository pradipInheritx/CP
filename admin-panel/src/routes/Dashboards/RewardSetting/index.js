import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Paper, Table, TableCell, TableContainer, TableRow, TextField } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';
import {getRewardSetting,updateRewardSetting} from '../../../redux/actions/RewardSetting';

import ConfirmDialog from '../../../@jumbo/components/Common/ConfirmDialog';
import { useDebounce } from '../../../@jumbo/utils/commonHelper';
import useStyles from './index.style';
import GridContainer from '@jumbo/components/GridContainer';
import { Grid } from 'react-virtualized';
import AppTextInput from '@jumbo/components/Common/formElements/AppTextInput';
import IntlMessages from '@jumbo/utils/IntlMessages';
import { NavLink } from 'react-router-dom';
import { AllrequiredMessage } from '@jumbo/constants/ErrorMessages';


const RewardSettingModule = () => {
  const classes = useStyles();  
  const [rewardInfo, setRewardInfo] = useState([]);
  const [rewardInfoError, setRewardInfoError] = useState([]);
  const [CmpNumber, setCmpNumber] = useState([]);
  const [Cardtype, setCardtype] = useState(["Common","Uncommon","Rare","Epic","Legendary"]);
  const [GamePoint, setGamePoint] = useState(["Game min","Game max"]);
  const [voting, setVoting] = useState(["Boost min","Boost min"]);
  const [usersFetched, setUsersFetched] = useState(false);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const { RewardSettingDetelis } = useSelector(({ RewardSetting }) => RewardSetting);  

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getRewardSetting(filterOptions, debouncedSearchTerm, () => {
        setFilterApplied(!!filterOptions.length || !!debouncedSearchTerm);
        setUsersFetched(true);
      }),
    );
  }, [dispatch, filterOptions, debouncedSearchTerm]);  
  
console.log(RewardSettingDetelis,"RewardSettingDetelis")

  useEffect(() => {
    let CmpValue;
    let VoteValue=[]
RewardSettingDetelis && [RewardSettingDetelis].map((item,index) => {
  CmpValue = Object.keys(item);      
})
    
CmpValue && CmpValue.map((item, index) => {            
   VoteValue.push(RewardSettingDetelis[`${item}`])
  })  
  setCmpNumber(CmpValue)

    console.log(RewardSettingDetelis,"VoteValue")
    
  setRewardInfo(VoteValue)
  
  }, [RewardSettingDetelis]);


  const onSubmitClick = (e) => {      
    const allRewardInfo = [...rewardInfo] 
    let allRewardInfoError=[...rewardInfoError]
    allRewardInfo.map((item,index) => {
      return (
        <>
        {item?.cardTierPickingChanceInPercent?.map((item, cardIndex) => {
        if (item == "" ) {
          allRewardInfoError[index]=AllrequiredMessage
          setRewardInfoError(allRewardInfoError)
        }
        })}
        {item?.extraVotePickFromRange?.map((item, gameIndex) => {
        if (item == "") {
          allRewardInfoError[index]=AllrequiredMessage
          setRewardInfoError(allRewardInfoError)
        }
        })}
        {item?.diamondsPickFromRange?.map((item, boostIndex) => {
        if (item == "") {
          allRewardInfoError[index]=AllrequiredMessage
          setRewardInfoError(allRewardInfoError)
        }
        })} 
        {onCmpRewardSave()}  
        </>)      
    })    
  };

  const onCmpRewardSave = () => {
    const allRewardInfo = [...rewardInfo] 
    const allCmpNumber = [...CmpNumber]
    const finalRewardInfo = {}
    
    allRewardInfo.map((item,index) => {
      finalRewardInfo[`${allCmpNumber[index]}`]=item
    })

    {finalRewardInfo.length !=0 && onCmpRewardSubmit(finalRewardInfo)}

  };
  const onCmpRewardSubmit = (finalRewardInfo) => {
    
      dispatch(
        updateRewardSetting(finalRewardInfo),
      );    
  };

  const AddRemoveInfo = (type, index) => {
    let allRewardInfo=[...rewardInfo]
    let allCmpNumber=[...CmpNumber]


    if (type == "add") {
     setRewardInfo([...rewardInfo,{
        cardTierPickingChanceInPercent: ["0", "0", "0", "0", "0"],
        extraVotePickFromRange: ["0", "0"],
        diamondsPickFromRange: ["0", "0"],
     }])
      setCmpNumber([...CmpNumber,Number(CmpNumber[CmpNumber.length-1]) + 100])
  }
    if (type == "remove") {
      const forReward = allRewardInfo.filter((item,itemindex) => itemindex!==index );
      const forCmpNum = allCmpNumber.filter((item,itemindex) => itemindex!==index );
     setRewardInfo(forReward)
      setCmpNumber(forCmpNum)
  }
}

  const handelInputText = (e, index,childIndex,type) => {
    const allRewardInfo = [...rewardInfo]        
    allRewardInfo[index][`${type}`][childIndex]=e.target.value.replace(/[^0-9]/g, "")
    setRewardInfo(allRewardInfo)
  }

console.log(rewardInfo,"rewardInfoCheck")
// console.log(rewardInfoError,"rewardInfoErrorCheck")
  return (
    <div className={classes.root}>
          <Paper className={classes.paper}>                 
         <form className='' style={{ display: "flex" ,justifyContent: "center",}}>
          <Box className='' style={{ marginTop:"10px"}}>           
            {
              rewardInfo?.map((item, index) => {                   
                return (
                  <>
                    <Box>
                      <p htmlFor="" style={{margin:"10px"}}>Cmp For { CmpNumber[index] } :</p>   
                      <Box style={{
                        display: "flex", justifyContent: "space-around", flexWrap: "wrap",
                      border:`${rewardInfoError[index] != undefined && rewardInfoError[index]!="" ?"1px solid red" : ""}`
                      }} >                      
                    {
                      item?.cardTierPickingChanceInPercent?.map((cardTierItem, cardIndex) => {                        
                  return <>
                    
                    <TextField
                        style={{ width: "10%" }} 
                        // fullWidth
                      type="text"
                      label={Cardtype[cardIndex]}            
                      value={cardTierItem}
                      onChange={(event) =>{
                        // setRewardInfo([...rewardInfo,])
                        handelInputText(event,index,cardIndex,"cardTierPickingChanceInPercent")
                        setRewardInfoError([])
                        }}
                      // defaultValue={0}
                      margin="normal"
                      variant="outlined"
                        className={classes.textFieldRoot}
                        // helperText={rewardInfoError[index]?.cardTierPickingChanceInPercent[cardIndex]}
                        // error={rewardInfoError[index]?.cardTierPickingChanceInPercent[cardIndex] !== ''}
                      />
                  </>
                })
                    }
                    {
                      item?.extraVotePickFromRange?.map((GameItem, GameIndex) => {
                  return <>
                    
                    <TextField
                        style={{ width: "10%" }} 
                        // fullWidth
                      type="text"
                      label={GamePoint[GameIndex]}  
                      value={GameItem}
                      onChange={(event) =>{
                        handelInputText(event, index, GameIndex, "extraVotePickFromRange") 
                        setRewardInfoError([])
                        }}
                      // defaultValue={0}
                      margin="normal"
                      variant="outlined"
                        className={classes.textFieldRoot}
                        // helperText={rewardInfoError[index]?.extraVotePickFromRange}
                        // error={rewardInfoError[index]?.extraVotePickFromRange !== ''}
                      />
                  </>
                })
                    }
                    {
                      item?.diamondsPickFromRange?.map((BoostItem, BoostIndex) => {
                  return <>
                    
                    <TextField
                        style={{ width: "10%" }} 
                        // fullWidth
                      type="text"
                      label={voting[BoostIndex]}  
                      value={BoostItem}
                      onChange={(event) =>{
                        handelInputText(event,index,BoostIndex,"diamondsPickFromRange")                        
                        setRewardInfoError([])
                        }}
                      // defaultValue={0}
                      margin="normal"
                      variant="outlined"
                        className={classes.textFieldRoot}
                        // helperText={rewardInfoError[index]?.diamondsPickFromRange}
                        // error={rewardInfoError[index]?.diamondsPickFromRange !== ''}
                      />
                  </>
                })
                    }
                    </Box>
                    </Box>

                    {rewardInfoError[index] != "" ? <span style={{color:"red",margin:"10px"}}>{rewardInfoError[index]}</span>:""}
                    {rewardInfo.length-1 ==index && <Box>
                      <Button onClick={() => {
                        AddRemoveInfo("add",index)
                      }}>Add</Button>
                      {rewardInfo.length-1 > 0 && <Button onClick={() => {AddRemoveInfo("remove",index)}}>Remove</Button>}
                    </Box>}
                    </>
                )                                             
              })
            }
           
          <Box marginY={"10px"}  display="flex" alignItems="center" justifyContent="space-around" mb={5}>
              <Button
                type="reset" 
              //   onClick={onSubmit}
              variant="contained" color="neutral">
              <IntlMessages id="appModule.reset" />
            </Button>            
            <Button
              onClick={onSubmitClick}
              variant="contained" color="primary">
              <IntlMessages id="appModule.submit" />
            </Button>            
            
          </Box>
        </Box>
      </form>
      </Paper>      
    </div>
  );
};

export default RewardSettingModule;
