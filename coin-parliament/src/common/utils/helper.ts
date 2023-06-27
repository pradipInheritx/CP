export type calculateDiffBetweenCoinsType = { firstCoin: string, secondCoin: string, difference: string };
export const calculateDiffBetweenCoins = (valueVotingTime: number[], valueExpirationTime: number[], direction: number) => {

    const firstCoin = (((valueExpirationTime[0] - valueVotingTime[0]) * 100) / valueVotingTime[0]);
    const secondCoin = (((valueExpirationTime[1] - valueVotingTime[1]) * 100) / valueVotingTime[1]);
    const difference = (direction === 0 ? (firstCoin) - (secondCoin) : (secondCoin) - (firstCoin)).toFixed(3);
    return {
        firstCoin: firstCoin.toFixed(3) || '0',
        secondCoin: secondCoin.toFixed(3) || '0',
        difference: difference || '0'
    }
}