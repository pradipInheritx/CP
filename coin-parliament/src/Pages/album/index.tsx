/** @format */

import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import bkgnd4 from "assets/images/bkgnd4.png";
import MyCarousel from "Components/Carousel/Carousel";

import NftOneCard from "../NftOneCard";
import firebase from "firebase/compat/app";

import "../styles.css";
import SwiperBar from "../SwiperBar";
import UserContext from "Contexts/User";
import { Col, Form, Row } from "react-bootstrap";
import { texts } from "Components/LoginComponent/texts";
import AppContext from "Contexts/AppContext";
import { debounce, trim } from "lodash";
import { divideArray, divideArray1 } from "common/utils/helper";
import SetsScreen from "Pages/SetsScreen";
import { db, firestore } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import NftLodding from "Pages/NftLodding";

// import { Firestore } from "firebase/firestore";

const GalleryType = styled.div`
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  // justify-content:space-around;
  justify-content:${window.screen.width > 767 ? "space-between" : "center"};
  color: black;
  margin-top: 10px;
  & div {
    // border: 1px solid #5f4ce3;
    width:${window.screen.width < 767 ? "80%" : "340px"};
    height:${window.screen.width < 767 ? "91px" : "100px"};
    // height:71px;
    margin: 10px 0px;    
    cursor:pointer;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px;
    // padding: 20px 20px;
    text-align:center;
    $ p {
    }
  }
`;

const SummerCard = styled.div`

  display: flex;
  justify-content: center;
  // border:1px solid red;
  flex-wrap: wrap;
  background-color: #f8f9fa;

  
`;

const Video = styled.video`
  width: 100%;
  // max-width: 300px;
  height: auto;
  margin: 0 auto;
  // border-radius: 20px;
`;

const Album: React.FC<{ userId: string, isFollower?: boolean }> = ({ userId, isFollower = false }) => {
    const navigate = useNavigate();
    const {userInfo } = useContext(UserContext);
    const [collectionType, setCollectionType] = useState<any>()            
    const [backCards, setBackCards] = useState<any>([]);
    const [equalPart, setEqualPart] = useState<any>([]);    
    const [winerCard, setWinerCard] = useState<any>([]);
    const [myCards, setMyCards] = useState<any>(false)    
    const [setsValue, setSetsValue] = useState<any>([])    
    const [cardNameNew, setCardNameNew] = useState<any>([])
    const [sameCards, setSameCards] = useState<any>({})
    const [isLoading, setIsLoading] = useState(false);    
    const [myFilter, setMyFilter] = useState<any>([]);
    const [allCards, setAllCards] = useState<any>([]);
    const [searchValue, setSearchValue] = useState<any>('');
    const [collectionValue, setCollectionValue] = useState<any>('none');
    const [collectionSetValue, setCollectionSetValue] = useState<any>('none');
    const [collectionTypeValue, setCollectionTypeValue] = useState<any>('all');
    const [collectionCardValue, setCollectionCardValue] = useState<any>('none');
    const [displayMyCards, setDisplayMyCards] = useState<boolean>(false);
    const [winnerCardId, setWinnerCardId] = useState<string[]>([]);
    const parameters = new URLSearchParams(window.location.search);
    console.log(parameters, "parameters")
    let tempFilter = allCards;

    useEffect(() => {
        setIsLoading(true)
        // @ts-ignore
        getAllRewardsOfUser(`${userId}`)
        getCollectionType()
        // getCardDetails();
    }, [])

    const getAllRewardsOfUser = async (uid: string) => {
        try {
            const rewardsCollection = collection(firestore, 'reward_transactions');
            const rewardsQuery = query(rewardsCollection, where('user', '==', uid));
            const querySnapshot = await getDocs(rewardsQuery);

            var winCards: {
                firstRewardCard: string,
                firstRewardCardCollection: string,
                firstRewardCardId: number,
                firstRewardCardSerialNo: string,
                firstRewardCardType: string,
                secondRewardExtraVotes: number,
                thirdRewardDiamonds: number
            }[] = []
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data?.winData?.firstRewardCardId) {
                    winCards.push({ ...data.winData, ...data.transactionTime });
                }
            });

            setWinerCard(winCards);
        } catch (error) {
            console.log('getAllRewardsOfUser Error', error);
        }
    };   

    const getCollectionType = async () => {
        try {
            const collectionTypeRef = collection(firestore, 'nftGallery');
            const querySnapshot = await getDocs(collectionTypeRef);

            const data: any = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() });
            });

            setIsLoading(false);
            setCollectionType(data);
            // setCardShow(false);
        } catch (error) {
            console.error('Error fetching collection type:', error);
        }
    };

    const getCardDetails = async (albumName: any) => {
        if (albumName){
            try {
                const getCollectionTypeRef = collection(firestore, 'cardsDetails')
                const getOneCollection = query(getCollectionTypeRef, where('albumName', '==', albumName));
                const querySnapshot = await getDocs(getOneCollection);

                const data: any = [];
                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() });
                });

                // Sorting by albumName and setName
                data.sort((a: any, b: any) => a.albumName.localeCompare(b.albumName) || a.setName.localeCompare(b.setName));

                console.log('I am working', data);
                setAllCards(data);
                setCollectionValue(albumName);
                setSetsValue([]);
                setCollectionSetValue('none');
                setCollectionTypeValue('all');
                setCollectionCardValue('none');
            } catch (error) {
                console.error('Error fetching card details:', error);
            }
        } else {
            setCollectionValue(albumName);
            setSetsValue([]);
            setCollectionSetValue('none');
            setCollectionTypeValue('all');
            setCollectionCardValue('none');
        }        
    };

    const BackSideCard = (value: string | number) => {

        if (backCards.includes(value)) {
            let allBackCard = [...backCards];
            allBackCard.splice(backCards.indexOf(value), 1);
            setBackCards(allBackCard)
        }
        else {
            setBackCards([...backCards, value])
        };
    };

    const CheckCardDisable = (cardId: any) => {
        var disableCard;

        let cardTrue = winerCard?.find((winCard: any, index: number) => {

            if (winCard?.firstRewardCardId != cardId) {

                disableCard = "CardDisebal"
                return false
            }
            if (winCard?.firstRewardCardId == cardId) {

                disableCard = undefined
                return true
            }

        })
        return disableCard
    }

    const getMintedTime = (cardId: any) => {
        var getMIntedTime;
        console.log(winerCard, "winerCardcheck")

        let mintedTime = winerCard?.find((winCard: any, index: number) => {
            if (winCard?.firstRewardCardId == cardId) {
                const date = new Date(winCard?.seconds * 1000);
                getMIntedTime = date.toLocaleString()
                return true
            }
        })
        return getMIntedTime
    }

    const getPriSerialNo = (cardId: any) => {
        var seriaNo;
        let PriSerialNo = winerCard?.find((winCard: any, index: number) => {
            if (winCard?.firstRewardCardId == cardId) {
                seriaNo = winCard?.firstRewardCardSerialNo
                return "hello"
            }
        })
        return seriaNo
    }
   
    useEffect(() => {
        if (localStorage.getItem('filterCollection') && allCards.length > 0) {
            const filterCollection = JSON.parse(localStorage.getItem('filterCollection') || '');
            setCollectionValue(filterCollection?.name || 'none');
            setCollectionCardValue(filterCollection?.card || 'none');
            localStorage.removeItem("filterCollection");
        } else if (parameters.get('collectionName')) {

            setCollectionValue(parameters.get('collectionName') || 'none');
            if (parameters.get('setName')) {
                setCollectionSetValue(parameters.get('setName') || 'none')
            }
            setCollectionCardValue(parameters.get('cardName')?.replace("-", " ") || 'none')
            console.log(parameters.get('setName'), parameters.get('cardName'), "parameters.get")
        }
    }, [allCards]);

    const onCollectionChange = async (collectionName: any) => {
        try {
            const getAlbumId = collectionType && collectionType?.find((item: any) => item.albumName === collectionName);

            if (getAlbumId) {
                setIsLoading(true);

                const getSetsTypeRef = collection(
                    firestore,
                    'nftGallery',
                    getAlbumId.id,
                    'setDetails'
                );

                const querySnapshot = await getDocs(getSetsTypeRef);

                const data: any = [];
                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() });
                });

                setIsLoading(false);
                setSetsValue(data);                
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error fetching sets type:', error);
        }
    };


    useEffect(() => {
        onCollectionChange(collectionValue)
    }, [collectionValue, collectionType])
    


    useEffect(() => {
        setWinnerCardId(() => {
            return winerCard?.map((WinerItem: any) => WinerItem?.firstRewardCardId);
        });
    }, [winerCard])

    //filter
    useEffect(() => {

        // var tempFilter = allCards;

        const debouncedSearch = debounce(async (value) => {
            if (value.trim() !== '') {
                const capitalizedQuery = value.charAt(0).toUpperCase() + value.slice(1);
                const q = query(collection(db, 'cardsDetails'), where('cardName', '>=', capitalizedQuery), where('cardName', '<=', capitalizedQuery + '\uf8ff'));
                const querySnapshot = await getDocs(q);
                const results = querySnapshot.docs.map(doc => doc.data());
                console.log(results, "getresults");
                tempFilter = [...results]
            } else {
                console.log("not found TropicSip", "getresults");
                tempFilter = []
            }
        }, 300);

        if (collectionValue == 'none' && searchValue !== '') {            
            debouncedSearch(searchValue);        
        } else {            
            if (collectionValue !== 'none') {
                tempFilter = tempFilter.filter((value: any) => value.albumName.toLowerCase() === collectionValue.toLowerCase());
                console.log(collectionValue,"collectionValue 1")
            }
            if (collectionSetValue !== 'none') {
                tempFilter = tempFilter.filter((value: any) => value.setId === collectionSetValue);
                console.log(collectionSetValue,"collectionValue 2")
            }
    
            setCardNameNew([...tempFilter].sort((a: any, b: any) => a.cardName.localeCompare(b.cardName)))
    
            if (searchValue !== '') {
                tempFilter = tempFilter.filter((value: any) => value.cardName.toLowerCase().includes(searchValue.toLowerCase()));
                console.log(searchValue,"collectionValue 3")            
            }
            if (collectionTypeValue !== 'all') {
                tempFilter = tempFilter.filter((value: any) => value.cardType.toLowerCase() === collectionTypeValue.toLowerCase());
                console.log(collectionTypeValue,"collectionValue 4")
            }
            if (collectionCardValue !== 'none') {
                tempFilter = tempFilter.filter((value: any) => value.cardName.toLowerCase() === collectionCardValue.toLowerCase());
                console.log(collectionCardValue,"collectionValue 5")            
            }
            if (displayMyCards) {
                let winnerCardId = winerCard?.map((WinerItem: any) => WinerItem?.firstRewardCardId);
                tempFilter = tempFilter.filter((value: any) => winnerCardId.includes(value?.cardId));
                console.log(displayMyCards,"collectionValue 6")
            }
        }

        console.log(tempFilter, "tempFilter")
        setMyFilter(divideArray1(tempFilter, 4));

        return () => debouncedSearch.cancel();
    }, [searchValue, collectionValue, collectionSetValue, collectionTypeValue, collectionCardValue, displayMyCards, allCards, winerCard]);
                       
    //             if (true) {
    //                 const q = query(
    //                     collection(db,'cardsDetails'),
    //                     where('albumName', '==', "Space"),
    //                     where('setId', '==', "PBiMt0IHnKeOxz4IA3lG") // '\uf8ff' is a placeholder for end of the unicode range
    //                 );
    //                 const querySnapshot = await getDocs(q);
    //                 const results = querySnapshot.docs.map(doc => doc.data());
    //                 console.log(results,"getresultsData")
    //             } else {
    //                 console.log("not found","getresultsData")
    //             }        
    // }

    // getDBData();
    

    // useEffect(() => {
    //     // Define the debounced search function               
        
    // }, [searchValue]);

    const handleInputChange = (e:any) => {
        setSearchValue(e.target.value);
    };

    let addAlbumSeparator = '';


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isFollower) {
                    const userRef = collection(firestore, 'users');
                    const userQuery = query(userRef, where('uid', '==', userId));
                    const snapshot = await getDocs(userQuery);

                    const data: any = [];
                    snapshot.forEach((doc) => {
                        data.push({ ...doc.data() });
                    });

                    getsamecard(data[0]);
                } else {
                    getsamecard(userInfo && userInfo);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userInfo]);

    const getsamecard = (data: any) => {
        console.log(data, "sameCards i am every time calling")
        var commonCard = {}
        // @ts-ignore
        const allCards = data?.rewardStatistics?.cards
        allCards?.map((item: any, index: number) => {
            // @ts-ignore
            commonCard = { ...commonCard, [item]: (commonCard[item] ? commonCard[item] + 1 : 1) }
        })
        console.log(data, "commonCard")
        setSameCards(commonCard)
    }

    console.log(sameCards, "sameCards")
    return (
        <div className='' style={{ background: "white", minHeight: "80vh" }
        }>
            <div className='d-flex justify-content-center flex-wrap w-100 py-2 ipad_row_gap'>
                <input
                    type='text'
                    onChange={e => {
                        // setSearchValue(trim(e.target.value));
                        handleInputChange(e)
                    }}
                    placeholder='SEARCH...'
                    className='py-2 mx-2 color-back'
                    style={{ width: "200px" }}

                />
                <div className={`${window.screen.width < 767 ? "py-3 d-flex" : ""}`} >
                    <select
                        className='color-back py-2 mx-1'
                        value={collectionValue}
                        onChange={e => {                            
                            getCardDetails(e.target.value)                            
                        }}
                        style={{
                            width: "155px",
                            textTransform: "uppercase"
                        }}
                    >
                        <option value='none' > {texts.SelectCollection} </option>
                        {
                            collectionType?.map((data: any, index: number) => {
                                return <option selected value={data?.albumName} key={index} style={{ textTransform: "uppercase" }} > {data?.albumName} </option>
                            })
                        }

                    </select>
                    <select
                        className='color-back py-2 mx-1'
                        value={collectionSetValue}
                        onChange={e => {
                            setCollectionSetValue(e.target.value);
                        }}
                        style={{
                            width: "155px",
                            textTransform: "uppercase"
                        }}
                    >
                        <option value='none' > {texts.SelectSets} </option>
                        {
                            setsValue?.map((data: any, index: number) => {
                                return <option selected value={data?.id} key={index} style={{ textTransform: "uppercase" }}> {(data?.setName)?.toUpperCase()
                                }</option>
                            })}
                    </select>
                </div >
                <div className={`${window.screen.width < 767 ? "" : ""}`}>
                    <select
                        name='type'
                        id='type'
                        className='color-back mx-1 py-2'
                        onChange={(e) => {
                            setCollectionTypeValue(e.target.value);
                        }}
                        value={collectionTypeValue}
                        style={{
                            width: "155px",
                            textTransform: "uppercase"
                        }}
                    >
                        {collectionValue != "none" ? <><option value='all' style={{ textTransform: "uppercase" }} > {texts.SelectType} </option>
                            <option value={`${texts.Legendary}`} > {texts.Legendary} </option>
                            <option value={`${texts.Rare}`}> {texts.Rare} </option>
                            <option value={`${texts.Epic}`}> {texts.Epic} </option>
                            <option value={`${texts.UNCommon}`}> {texts.UNCommon} </option>
                            <option value={`${texts.Common}`}> {texts.Common} </option></ > :
                            <option value='all' > {texts.SelectType} </option>}
                    </select>

                    <select
                        className='color-back py-2 mx-1'
                        onChange={e => {
                            setCollectionCardValue(e.target.value);
                        }}
                        value={collectionCardValue}
                        style={{
                            width: "155px",
                            textTransform: "uppercase"
                        }}
                    >
                        <option value='none' > {texts.SelectName} </option>
                        {
                            collectionValue !== 'none' && cardNameNew?.map((data: any, index: number) => {
                                return <option selected value={data?.cardName} key={index} style={{ textTransform: "uppercase" }} > {`${data?.cardName}`
                                }</option>
                            })}
                    </select>
                </div>
                {
                    !isFollower && <div className="d-flex  justify-content-start align-items-center " >

                        <Form.Check
                            style={{ fontSize: "20px", marginRight: "10px" }}
                            type="checkbox"
                            id={`default-checkbox`
                            }                            
                            onClick={(e) => {
                                setDisplayMyCards(prev => !prev);
                                setMyCards(!myCards)
                            }}
                        />
                        <label htmlFor="default-checkbox" > {texts.AvailableCards} </label>
                    </div>}
            </div>
            {isLoading && collectionType !== "" && <NftLodding />}
            {
                collectionValue !== "none" && collectionSetValue == "none" && collectionCardValue == "none" && collectionTypeValue == "all" && !displayMyCards && searchValue == "" && <>
                    <div className="w-100 d-flex">
                        <div className={`${window.screen.width > 767 ? "" : ""} d-flex justify-content-between flex-wrap w-100`} style={{}}>
                            {setsValue.map((item: any, index: number) => {
                                return <SetsScreen
                                    type="album"
                                    onSelectName={setCollectionCardValue}
                                    allCardNew={allCards}
                                    setsValue={item}
                                    winerCard={winerCard}
                                />
                            })}
                        </div>
                    </div>
                </>
            }


            {
                (displayMyCards || collectionSetValue != "none" || collectionCardValue != "none" || collectionTypeValue != "all" || searchValue != "") ?
                    <>
                        {Object.keys(myFilter)?.length > 0 ?
                            <SummerCard className="mt-4" >
                                {
                                    Object.keys(myFilter).map((albumName, index) => {
                                        return (
                                            <React.Fragment key={index} >
                                                <div className='w-100 m-auto row pt-3' style={{ borderTop: ((index !== 0 && addAlbumSeparator !== albumName) ? '3px solid #bebac7' : '') }
                                                }>
                                                    {collectionValue === 'none' && <div className="col-sm-2 d-flex justify-content-center align-items-center" style={{ transform: window.screen.width > 575 ? 'rotate(270deg)' : '', color: '#5f4de4', fontSize: (window.screen.width > 575 ? '4em' : '2em'), overflow: 'visible', wordWrap: 'normal', textTransform: 'uppercase' }} >
                                                        {albumName}
                                                    </div>}
                                                    <div className={collectionValue === 'none' ? "col-sm-10" : 'col-sm-12'}>
                                                        {
                                                            myFilter[albumName]?.map((cardPart: any, ind: number) => {
                                                                return (

                                                                    <SwiperBar slideSize={collectionValue === 'none' ? 4 : 5}>
                                                                        {cardPart?.map((item: any, index: number) => {
                                                                            if (addAlbumSeparator !== item.albumName) {
                                                                                console.log(item.albumName, 'adding');
                                                                                addAlbumSeparator = item.albumName;
                                                                            }
                                                                            if (myCards) {
                                                                                return (
                                                                                    <NftOneCard
                                                                                        key={index}
                                                                                        DivClass={item?.cardType}
                                                                                        HeaderText={item?.cardType}
                                                                                        HeaderClass={`${item?.cardType}_text`
                                                                                        }
                                                                                        Serie={item?.setName || "Set" + index
                                                                                        }
                                                                                        BackCardName={item?.cardName}
                                                                                        Rarity={item?.cardType}
                                                                                        Quantity={`${sameCards[item?.cardName]} / ${item?.totalQuantity}`
                                                                                        }
                                                                                        holderNo={item?.noOfCardHolders}
                                                                                        // cardNo={`${((item?.setName)?.toUpperCase())?.slice(0, 3) + item?.setId}`}
                                                                                        // cardNo={item?.sno[index]}
                                                                                        ShowQuantity={`${sameCards[item?.cardName] || 1}`}
                                                                                        GeneralSerialNo={item?.sno && (item?.sno[0])?.replace(/[0-9]/g, '')}
                                                                                        cardNo={`${((item?.cardName)?.toUpperCase())?.slice(0, 2) + (item?.id)?.slice(0, 2)}`}
                                                                                        // GeneralSerialNo={}                            
                                                                                        CollectionType={item?.albumName || "LEGENDARY"}
                                                                                        MintedTime={getMintedTime(item?.cardId)}
                                                                                        PrivateSerialNo={getPriSerialNo(item?.cardId)}
                                                                                        Disable={winerCard.length ? CheckCardDisable(item?.cardId) : 'CardDisebal'}
                                                                                        userId={userId}
                                                                                        isFollower={isFollower}
                                                                                        // Disable={"CardDisebal"}                            
                                                                                        cardHeader={`${item?.cardName}`}
                                                                                        id={item?.cardId}
                                                                                        BackSideCard={BackSideCard}
                                                                                        fulldata={item}
                                                                                        flipCard={backCards?.includes(item?.cardId)}
                                                                                        ImgUrl={item?.cardImageUrl || ""}
                                                                                        VideoUrl={item?.cardVideoUrl || ""}
                                                                                    />
                                                                                );
                                                                            }
                                                                            else {
                                                                                return (
                                                                                    <NftOneCard
                                                                                        key={index}
                                                                                        DivClass={item?.cardType}
                                                                                        HeaderText={item?.cardType}
                                                                                        HeaderClass={`${item?.cardType}_text`
                                                                                        }
                                                                                        Serie={item?.setName || "Set" + (index + 1)}
                                                                                        BackCardName={item?.cardName}
                                                                                        Rarity={item?.cardType}
                                                                                        // Quantity={item?.totalQuantity}
                                                                                        holderNo={item?.noOfCardHolders}
                                                                                        // cardNo={`${((item?.setName)?.toUpperCase())?.slice(0, 3) + item?.setId}`}
                                                                                        // cardNo={item?.sno[index]}
                                                                                        // Quantity={`${getTotalSameCard(item?.id)} / ${item?.totalQuantity}`}
                                                                                        ShowQuantity={`${sameCards[item?.cardName] || 1}`}
                                                                                        Quantity={`${sameCards[item?.cardName] || 1} / ${item?.totalQuantity}`}
                                                                                        GeneralSerialNo={item?.sno && (item?.sno[0])?.replace(/[0-9]/g, '')}
                                                                                        cardNo={`${((item?.cardName)?.toUpperCase())?.slice(0, 2) + (item?.id)?.slice(0, 2)}`}
                                                                                        // GeneralSerialNo={`${((item.collectionName)?.toUpperCase())?.slice(0, 3) + ((item?.setName)?.toUpperCase())?.slice(0, 3) + item?.setId}`}
                                                                                        MintedTime={getMintedTime(item?.cardId)}
                                                                                        PrivateSerialNo={getPriSerialNo(item?.cardId)}
                                                                                        Disable={winerCard.length ? CheckCardDisable(item?.cardId) : 'CardDisebal'}
                                                                                        userId={userId}
                                                                                        // CollectionType={item?.collectionName}
                                                                                        CollectionType={item?.albumName || "LEGENDARY"}
                                                                                        // Disable={"CardDisebal"}                            
                                                                                        cardHeader={`${item?.cardName}`}
                                                                                        id={item?.cardId}
                                                                                        BackSideCard={BackSideCard}
                                                                                        fulldata={item}
                                                                                        flipCard={backCards?.includes(item?.cardId)}
                                                                                        ImgUrl={item?.cardImageUrl || ""}
                                                                                        VideoUrl={item?.cardVideoUrl || ""}
                                                                                        isFollower={isFollower}
                                                                                    />
                                                                                );
                                                                            }
                                                                        })}
                                                                    </SwiperBar>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>

                                            </React.Fragment>
                                        )
                                    })
                                }
                            </SummerCard> :
                            <div className="d-flex justify-content-center mt-5" >
                                {<p style={{
                                    color: "black"
                                }}> {!isLoading && "Data Not Found"} </p>}
                            </div>}
                    </>

                    :
                    <>
                        {collectionValue == "none" ? <GalleryType className='d-flex galleryRow' style={{ width: `${window.screen.width > 787 ? "800px" : "100%"}` }
                        } >
                            {
                                collectionType?.map((data: any, index: number) => {
                                    return (
                                        <div className="galleryCol" onClick={() => {
                                            // setCollectionValue(data?.albumName);
                                            getCardDetails(data?.albumName)
                                        }
                                        } key={index}
                                            style={{
                                                width: "380px",
                                                overflow: "hidden",
                                                height: "108px",
                                                borderRadius: "10px",
                                            }}
                                        >
                                            {
                                                data?.albumVideoUrl ?
                                                    <img src={data?.albumVideoUrl} width={'100%'} height={'100%'} />
                                                    :
                                                    <p style={{ color: "white" }}> {data?.albumName} </p>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </GalleryType> : null}
                    </>
            }
        </div >
    );
};

export default Album;