import { VoteResultProps } from "common/models/Vote";
import React, { createContext, useState } from "react";

export type VoteDataType = {
    [key: string]: VoteResultProps
};

export type VoteContextType = {
    activeVotes: VoteDataType,
    lessTimeVote: VoteResultProps | undefined | any,
    openResultModal: boolean
}
const defaultValue = {
    activeVotes: {},
    lessTimeVote: undefined,
    openResultModal: false
}
// Create two context:
// VoteContext: to query the context state
// VoteDispatchContext: to mutate the context state
const VoteContext = createContext<VoteContextType>(defaultValue);
const VoteDispatchContext = createContext<React.Dispatch<React.SetStateAction<VoteContextType>>>(() => { });

// A "provider" is used to encapsulate only the
// components that needs the state in this context
const VoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [voteDetails, setVoteDetails] = useState<VoteContextType>(defaultValue);

    return (
        <VoteContext.Provider value={voteDetails}>
            <VoteDispatchContext.Provider value={setVoteDetails}>
                {children}
            </VoteDispatchContext.Provider>
        </VoteContext.Provider>
    );
}

export { VoteProvider, VoteContext, VoteDispatchContext };