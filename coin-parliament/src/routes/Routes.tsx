import PageNotFound from 'Pages/PageNotFound';
import React, { PropsWithChildren } from 'react'
import { Routes as DefaultRoutes, Route } from "react-router-dom";
const Routes: React.FC = ({ children }: PropsWithChildren<{}>) => {
    return (
        <>
            <DefaultRoutes>
                {children}
                <Route path='*' element={<PageNotFound />} />
            </DefaultRoutes>
        </>
    )
}

export default Routes