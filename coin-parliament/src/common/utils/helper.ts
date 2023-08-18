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
export const getCoinColor = (currentValue: number, prevValue: number) => {
    return currentValue < prevValue ? '#fa0202' : currentValue > prevValue ? 'green' : '#050505'
}

export const scrollUp = () => {
    setTimeout(() => {
        window.scrollTo({
            top: 300,
            behavior: "smooth",
        });
    }, 2000);
}