import { VoteResultProps } from "common/models/Vote";
import React, { createContext, useState } from "react";

export type VoteDataType = {
    [key: string]: VoteResultProps
};
// Create two context:
// PairVoteContext: to query the context state
// PairVoteDispatchContext: to mutate the context state
const PairVoteContext = createContext<VoteDataType>({});
const PairVoteDispatchContext = createContext<React.Dispatch<React.SetStateAction<VoteDataType>>>(() => { });

// A "provider" is used to encapsulate only the
// components that needs the state in this context
const PairVoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [PairVoteDetails, setPairVoteDetails] = useState<VoteDataType>({});

    return (
        <PairVoteContext.Provider value={PairVoteDetails}>
            <PairVoteDispatchContext.Provider value={setPairVoteDetails}>
                {children}
            </PairVoteDispatchContext.Provider>
        </PairVoteContext.Provider>
    );
}

export { PairVoteProvider, PairVoteContext, PairVoteDispatchContext };