import { VoteResultProps } from "common/models/Vote";
import React, { createContext, useState } from "react";

export type VoteDataType = {
    [key: string]: VoteResultProps
};
// Create two context:
// VoteContext: to query the context state
// VoteDispatchContext: to mutate the context state
const VoteContext = createContext<VoteDataType>({});
const VoteDispatchContext = createContext<React.Dispatch<React.SetStateAction<VoteDataType>>>(() => { });

// A "provider" is used to encapsulate only the
// components that needs the state in this context
const VoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [voteDetails, setVoteDetails] = useState<VoteDataType>({});

    return (
        <VoteContext.Provider value={voteDetails}>
            <VoteDispatchContext.Provider value={setVoteDetails}>
                {children}
            </VoteDispatchContext.Provider>
        </VoteContext.Provider>
    );
}

export { VoteProvider, VoteContext, VoteDispatchContext };