import Spinner from 'Components/Spinner';
import UserContext from 'Contexts/User';
import { auth } from 'firebase';
import { getAuth } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {

    const [checkAuth, setCheckAuth] = useState<boolean | string>('none');
    const [loading, setLoading] = useState(true);
    const { setUser, userInfo } = useContext(UserContext);

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                console.log(user, 'auth pk');

                setCheckAuth(true);
                setUser(user);
            } else {
                setCheckAuth(false);
                setUser();
            }
            setLoading(false);
        });

    }, [JSON.stringify(auth.currentUser)]);
    return !loading ? (checkAuth ? <Outlet /> : <Navigate to={'/login'} />) : <></>;
}

export default ProtectedRoutes;