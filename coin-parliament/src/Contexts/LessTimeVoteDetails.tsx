
import { VoteResultProps } from "common/models/Vote";
import React, { createContext, useState } from "react";

// Create two context:
// VoteContext: to query the context state
// VoteDispatchContext: to mutate the context state
const LessTimeVoteDetailContext = createContext<VoteResultProps | undefined>(undefined);
const LessTimeVoteDetailDispatchContext = createContext<React.Dispatch<React.SetStateAction<VoteResultProps | undefined>>>(() => { });

// A "provider" is used to encapsulate only the
// components that needs the state in this context
const LessTimeVoteDetailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [voteDetails, setVoteDetails] = useState<VoteResultProps | undefined>(undefined);

    return (
        <LessTimeVoteDetailContext.Provider value={voteDetails}>
            <LessTimeVoteDetailDispatchContext.Provider value={setVoteDetails}>
                {children}
            </LessTimeVoteDetailDispatchContext.Provider>
        </LessTimeVoteDetailContext.Provider>
    );
}

export { LessTimeVoteDetailProvider, LessTimeVoteDetailContext, LessTimeVoteDetailDispatchContext };