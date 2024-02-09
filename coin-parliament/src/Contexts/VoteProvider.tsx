import { VoteResultProps } from "common/models/Vote";
import React, { createContext, useState } from "react";

export type VoteDataType = {
    [key: string]: VoteResultProps
};

export type VoteContextType = {
    activeVotes: VoteDataType,
    lessTimeVote: VoteResultProps | undefined | any,
    voteNot:string|undefined |number | boolean,
    openResultModal: boolean,
    voteImpact: {
        timeFrame: number,
        impact: null | number
    }
}
const defaultValue = {
    activeVotes: {},
    voteNot:undefined,
    lessTimeVote: undefined,
    openResultModal: false,
    voteImpact: {
        timeFrame: 0,
        impact: null
    }
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