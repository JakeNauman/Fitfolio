import React, { Component } from 'react';
import './Home.css';
import { AuthContext } from './AuthProvider';
import { jwtDecode } from 'jwt-decode';
import Feed from './Feed';
export class Home extends Component {
    static displayName = Home.name;

    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = { loading: true, userName: '', };
    }
    componentDidMount() {
        this.fetchUserDetails();
    }
    async fetchUserDetails() {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
                const response = await fetch(`https://localhost:7263/Users/byusername?username=${encodeURIComponent(username)}`);
                
                if (response.ok) {
                    const user = await response.json();
                    this.setState({ userName: user.username }); // Adjust based on your response structure
                } else {
                    console.error('Failed to fetch user details');
                }
            } catch (error) {
                console.error('Error decoding token or fetching user:', error);
            }
        }
    }

    handleLogout = () => {
        const { logout } = this.context;
        logout();
    };



    render() {
        const { isAuthenticated } = this.context;
        const { userName } = this.state;

        

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="menu-container col-md-3" >
                        <div className=" text-black p-4 rounded shadow" style={{ backgroundColor: '#7FA1C3' }}>
                            <h2 className="mb-4">Menu</h2>
                            <ul className="list-unstyled">
                                <li className="mb-3">
                                    <button className="btn btn-custom text-black text-decoration-none" onClick={() => window.location.href = "#"}>Home</button>
                                </li>
                                <li className="mb-3">
                                    <button className="btn btn-custom text-black text-decoration-none" onClick={() => window.location.href = `./profile/${userName}`}>Profile</button>
                                </li>
                                <li className="mb-3">
                                    <button className="btn btn-custom text-black text-decoration-none" onClick={() => window.location.href = "#"}>Settings</button>
                                </li>
                                <li className="mb-3">
                                    <button className="btn btn-custom text-black text-decoration-none" onClick={this.handleLogout}>Log Out</button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-md-9 main-content">
                        <div className="feedview p-5 rounded shadow flex-grow-1">
                            {isAuthenticated ? (
                                <h1>Welcome, {userName || 'User'}!</h1>
                            ) : (
                                <h1>Please log in.</h1>
                            )}
                            <p>Explore what your followers are up to:</p>
                            
                            <Feed />
                        </div>
                    </div>
                </div>
            </div>

        );
    }

}

