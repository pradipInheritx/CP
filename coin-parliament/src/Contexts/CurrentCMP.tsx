
import React, { createContext, useState } from "react";
;
// Create two context:
// CurrentCMP: to query the context state
// CurrentCMPDispatchContext: to mutate the context state
const CurrentCMPContext = createContext<number>(0);
const CurrentCMPDispatchContext = createContext<React.Dispatch<React.SetStateAction<number>>>(() => { });

// A "provider" is used to encapsulate only the
// components that needs the state in this context
const CurrentCMPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [CurrentCMPDetails, setCurrentCMPDetails] = useState<number>(0);

    return (
        <CurrentCMPContext.Provider value={CurrentCMPDetails}>
            <CurrentCMPDispatchContext.Provider value={setCurrentCMPDetails}>
                {children}
            </CurrentCMPDispatchContext.Provider>
        </CurrentCMPContext.Provider>
    );
}

export { CurrentCMPProvider, CurrentCMPContext, CurrentCMPDispatchContext };