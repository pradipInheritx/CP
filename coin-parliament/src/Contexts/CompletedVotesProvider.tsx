import { VoteResultProps } from "common/models/Vote";
import React, { createContext, useState } from "react";


// Create two context:
// CompletedVotesContext: to query the context state
// CompletedVotesDispatchContext: to mutate the context state
const CompletedVotesContext = createContext<VoteResultProps[]>([]);
const CompletedVotesDispatchContext = createContext<React.Dispatch<React.SetStateAction<VoteResultProps[]>>>(() => { });

// A "provider" is used to encapsulate only the
// components that needs the state in this context
const CompletedVotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [completedVotes, setCompletedVotes] = useState<VoteResultProps[]>([]);

    return (
        <CompletedVotesContext.Provider value={completedVotes}>
            <CompletedVotesDispatchContext.Provider value={setCompletedVotes}>
                {children}
            </CompletedVotesDispatchContext.Provider>
        </CompletedVotesContext.Provider>
    );
}

export { CompletedVotesProvider, CompletedVotesContext, CompletedVotesDispatchContext };