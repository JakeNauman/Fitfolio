import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

export class PrivateRoute extends Component {
    static contextType = AuthContext;

    render() {
        const { element: Component, ...rest } = this.props;
        const { isAuthenticated, isLoading } = this.context;
        console.log('Is authenticated:', isAuthenticated); // Debug authentication state

        if (isLoading) {
            return <div>Loading...</div>;
        }

        return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
    }
}
