import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface PrivateRouteProps {
    element: React.ReactNode;
    path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, ...rest }) => {
    // Check if the user is authenticated (i.e., if the token exists in cookies)
    const authToken = Cookies.get('authToken');

    // If there is no token, redirect to login page
    if (!authToken) {
        return <Navigate to="/login" />;
    }

    // If authenticated, return the protected route element
    return <Route {...rest} element={element} />;
};

export default PrivateRoute;
