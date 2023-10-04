import Spinner from 'Components/Spinner';
import UserContext from 'Contexts/User';
import { auth } from 'firebase';
import { getAuth } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {

    const [checkAuth, setCheckAuth] = useState<boolean | string>('none');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                setCheckAuth(true);
            } else {
                setCheckAuth(false);
            }
            setLoading(false);
        });

    }, []);
    return !loading ? (checkAuth ? <Outlet /> : <Navigate to={'/login'} />) : <></>;
}

export default ProtectedRoutes;