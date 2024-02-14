import Spinner from 'Components/Spinner';
import UserContext from 'Contexts/User';
import { auth } from 'firebase';
import { getAuth } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {

    const [checkAuth, setCheckAuth] = useState<boolean | string>('none');
    const [loading, setLoading] = useState(true);
    const { setUser, userInfo ,setUserInfo} = useContext(UserContext);

    useEffect(() => {
        const userAuth = auth.onAuthStateChanged(function (user) {
            if (user) {

                setCheckAuth(true);
                setUser(user);
            } else {
                setCheckAuth(false);
                setUserInfo();
                setUser();
            }
            setLoading(false);
        });

        return () => {
            userAuth();
          };

    }, [auth?.currentUser]);

    // console.log(loading , localStorage.getItem('mfa_passed'),auth?.currentUser,checkAuth,userInfo,'hello');
    
    return (!loading && localStorage.getItem('mfa_passed') !== 'true') ? (checkAuth ? <Outlet /> : <Navigate to={'/login'} />) : <></>;
}

export default ProtectedRoutes;