import { VoteResultProps } from "common/models/Vote";
import React, { createContext, useState } from "react";

export type VoteDataType = {
    [key: string]: VoteResultProps
};

export type VoteEndCoinPriceType = {
    [key: string]: {
        coin1?: string,
        coin2?: string
    }
}
const defaultValue = {}
// Create two context:
// VoteEndCoinPrice: to query the context state
// VoteEndCoinPriceDispatchContext: to mutate the context state
const VoteEndCoinPriceContext = createContext<VoteEndCoinPriceType>(defaultValue);
const VoteEndCoinPriceDispatchContext = createContext<React.Dispatch<React.SetStateAction<VoteEndCoinPriceType>>>(() => { });

// A "provider" is used to encapsulate only the
// components that needs the state in this context
const VoteEndCoinPriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [voteDetails, setVoteDetails] = useState<VoteEndCoinPriceType>(defaultValue);

    return (
        <VoteEndCoinPriceContext.Provider value={voteDetails}>
            <VoteEndCoinPriceDispatchContext.Provider value={setVoteDetails}>
                {children}
            </VoteEndCoinPriceDispatchContext.Provider>
        </VoteEndCoinPriceContext.Provider>
    );
}

export { VoteEndCoinPriceProvider, VoteEndCoinPriceContext, VoteEndCoinPriceDispatchContext };