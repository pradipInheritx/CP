import AppContext from 'Contexts/AppContext';
import PageNotFound from 'Pages/PageNotFound';
import React, { FC, PropsWithChildren, useContext } from 'react'
import { Routes as DefaultRoutes, Route } from "react-router-dom";
interface MyComponentProps {
    children: (false | React.ReactElement)[]; 
  }
  
  const Routes: FC<MyComponentProps> = ({ children }) => {
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