import React, { Component, createContext } from 'react';
import { jwtDecode } from 'jwt-decode';  // Import jwtDecode

const AuthContext = createContext();

class AuthProvider extends Component {
    state = {
        isAuthenticated: false,
        user: null,
        isLoading : true,
    };

    componentDidMount() {
        // Check if token exists in localStorage and set authentication state
        const token = localStorage.getItem('token');
        if (token) {
            this.login(token);
        }
        else {
            this.setState({ isLoading: false });
        }
    }

    login = (token) => {
        const decodedToken = jwtDecode(token);
        this.setState({
            isAuthenticated: true,
            user: {
                name: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
            },
            isLoading: false,
        });
        // Store token in localStorage
        localStorage.setItem('token', token);
    };

    logout = () => {
        // Clear the token from localStorage
        localStorage.removeItem('token');
        this.setState({
            isAuthenticated: false,
            user: null,
        });
    };

    render() {
        return (
            <AuthContext.Provider
                value={{
                    isAuthenticated: this.state.isAuthenticated,
                    user: this.state.user,
                    login: this.login,
                    logout: this.logout,
                    isLoading: this.state.isLoading,
                }}
            >
                {this.props.children}
            </AuthContext.Provider>
        );
    }
}

export { AuthProvider, AuthContext };
