import UserContext from 'Contexts/User';
import { auth } from 'firebase';
import React, { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {

    const [checkAuth, setCheckAuth] = useState<boolean | string>('none');
    const [loading, setLoading] = useState(true);
    const { setUser, setUserInfo } = useContext(UserContext);

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

    return (!loading && localStorage.getItem('mfa_passed') !== 'true') ? (checkAuth ? <Outlet /> : <Navigate to={'/login'} />) : <></>;

}

export default ProtectedRoutes;