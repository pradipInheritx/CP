export type paxTransactionObj = {
    userId: string,
    currentPaxValue : number,
    eligibleForMint : boolean,
    isUserUpgraded : boolean,
    mintForUserAddress :string,
    status : string,
    timestamp : string,
    isVirtual? : boolean
}