import AppContext from 'Contexts/AppContext';
import PageNotFound from 'Pages/PageNotFound';
import React, { PropsWithChildren, useContext } from 'react'
import { Routes as DefaultRoutes, Route } from "react-router-dom";
const Routes: React.FC = ({ children }: PropsWithChildren<{}>) => {
    const { firstTimeAvatarSlection, selectBioEdit } = useContext(AppContext);
    return (
        <>            
            <DefaultRoutes>                
                {children}
                {(!firstTimeAvatarSlection && selectBioEdit) && (firstTimeAvatarSlection && !selectBioEdit)  &&
                    <Route path='*' element={<PageNotFound />} />
                }
            </DefaultRoutes>
        </>
    )
}

export default Routes