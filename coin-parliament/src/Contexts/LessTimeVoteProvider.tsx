import { VoteResultProps } from "common/models/Vote";
import React, { createContext, useState } from "react";


// Create two context:
// lessTimeVoteContext: to query the context state
// lessTimeVoteDispatchContext: to mutate the context state
const lessTimeVoteContext = createContext<{ lessTimeVote: VoteResultProps | undefined | any, openResultModal: boolean }>({ lessTimeVote: undefined, openResultModal: false });
const lessTimeVoteDispatchContext = createContext<React.Dispatch<React.SetStateAction<{ lessTimeVote: VoteResultProps | undefined | any, openResultModal: boolean }>>>(() => { });

// A "provider" is used to encapsulate only the
// components that needs the state in this context
const LessTimeVoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lessTimeVote, setLessTimeVote] = useState<{ lessTimeVote: VoteResultProps | undefined | any, openResultModal: boolean }>({ lessTimeVote: undefined, openResultModal: false });

    return (
        <lessTimeVoteContext.Provider value={lessTimeVote}>
            <lessTimeVoteDispatchContext.Provider value={setLessTimeVote}>
                {children}
            </lessTimeVoteDispatchContext.Provider>
        </lessTimeVoteContext.Provider>
    );
}

export { LessTimeVoteProvider, lessTimeVoteContext, lessTimeVoteDispatchContext };