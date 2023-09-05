import { type } from "os";

export type calculateDiffBetweenCoinsType = { firstCoin: string, secondCoin: string, difference: string };
export const calculateDiffBetweenCoins = (valueVotingTime: number[], valueExpirationTime: number[], direction: number) => {

    const firstCoin = (((valueExpirationTime[0] - valueVotingTime[0]) * 100) / valueVotingTime[0]);
    const secondCoin = (((valueExpirationTime[1] - valueVotingTime[1]) * 100) / valueVotingTime[1]);
    const difference = (direction === 0 ? (firstCoin) - (secondCoin) : (secondCoin) - (firstCoin)).toFixed(5);
    return {
        firstCoin: firstCoin.toFixed(5) || '0',
        secondCoin: secondCoin.toFixed(5) || '0',
        difference: difference || '0'
    }
}

export const getCoinDifferenceColor = (value: number) => {
    return value < 0 ? '#fa0202' : value > 0 ? 'green' : '#050505'
}
export const getPairResultColor = (coin1Percentage: number, coin2Percentage: number, direction: number) => {
    if (direction) {
        return coin2Percentage > coin1Percentage ? 'green' : (coin1Percentage > coin2Percentage ? '#fa0202' : '#050505');
    } else {
        return coin1Percentage > coin2Percentage ? 'green' : (coin2Percentage > coin1Percentage ? '#fa0202' : '#050505');
    }
}


export const getCoinColor = (currentValue: number, prevValue: number) => {
    return currentValue < prevValue ? '#fa0202' : currentValue > prevValue ? 'green' : '#050505'
}
export const getSingleCoinPriceColor = (votingPrice: number, currentPrice: number, direction: number) => {
    //0 bull,1 bear , 1 price will increase 
    console.log(votingPrice, currentPrice, direction, 'colorTest');

    if (direction) {
        return votingPrice > currentPrice ? 'green' : votingPrice < currentPrice ? '#fa0202' : '#050505'
    } else {
        return votingPrice < currentPrice ? 'green' : votingPrice > currentPrice ? '#fa0202' : '#050505'
    }
}

export const scrollUp = () => {
    setTimeout(() => {
        window.scrollTo({
            top: 300,
            behavior: "smooth",
        });
    }, 2000);
}

export type cardDetailType = {
    id: string;
    cardName: string;
    cardId: string;
    quantity: number;
    albumId: string;
    cardStatus: string;
    totalQuantity: number;
    noOfCardHolders: number,
    cardImageUrl: string;
    cardVideoUrl: string;
    albumName: string;
    setId: string;
    cardType: string;
    setName: string;
    sno: string[]
}

export const divideArray = (arr: any, partSize: any) => {

    let divideByAlbum: { [key: string]: cardDetailType[] } = {};
    arr.map((value: any) => {
        divideByAlbum = { ...divideByAlbum, [value?.albumName]: (divideByAlbum[value?.albumName] ? [...divideByAlbum[value?.albumName], value] : [value]) }
    });
    let res1: cardDetailType[][] = [];
    Object.keys(divideByAlbum).map((albumName: string) => {
        let album = divideByAlbum[albumName];
        for (let i = 0; i < album.length; i += partSize) {
            res1 = [...res1, album.slice(i, i + partSize)];
        }
    });
    return res1;

}
export const divideArray1 = (arr: any, partSize: any) => {

    let divideByAlbum: { [key: string]: cardDetailType[] } = {};
    arr.map((value: any) => {
        divideByAlbum = { ...divideByAlbum, [value?.albumName]: (divideByAlbum[value?.albumName] ? [...divideByAlbum[value?.albumName], value] : [value]) }
    });
    let res1: { [key: string]: cardDetailType[][] } = {};
    Object.keys(divideByAlbum).map((albumName: string) => {
        let album = divideByAlbum[albumName];
        let albumWithSlice: cardDetailType[][] = [];
        for (let i = 0; i < album.length; i += partSize) {
            albumWithSlice = [...albumWithSlice, album.slice(i, i + partSize)];
        }
        res1 = { ...res1, [albumName]: albumWithSlice };
    });
    console.log(res1, 'divideByAlbum');
    return res1;

}