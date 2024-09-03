import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, Input, ListGroup, ListGroupItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthProvider';  // Adjust the path accordingly
import './NavMenu.css';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.state = {
            collapsed: true,
            searchResults: [],
            searchQuery: ''
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    async handleSearch(event) {
        const query = event.target.value;
        this.setState({ searchQuery: query });

        if (query.trim().length === 0) {
            this.setState({ searchResults: [] });
            return;
        }

        try {
            const response = await fetch(`https://localhost:7263/Users/search?query=${encodeURIComponent(query)}`);
            if (response.ok) {
                const results = await response.json();
                this.setState({ searchResults: results });
            } else {
                console.error('Failed to fetch search results');
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    }

    render() {
        const { searchResults, searchQuery } = this.state;

        return (
            <AuthContext.Consumer>
                {({ isAuthenticated, user, login, logout, isLoading }) => (
                    <header>
                        <Navbar style={{ backgroundColor: '#7FA1C3' }} className="navbar-expand-sm navbar-toggleable-sm box-shadow mb-0 sticky-top" container light>
                            <NavbarBrand tag={Link} to="/">FitFolio</NavbarBrand>
                            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                            <Collapse className="d-sm-inline-flex justify-content-between" isOpen={!this.state.collapsed} navbar>
                                <ul className="navbar-nav flex-grow-1 justify-content-end">
                                    <NavItem className="ml-3">
                                        <Input
                                            type="text"
                                            placeholder="Search users..."
                                            value={searchQuery}
                                            onChange={this.handleSearch}
                                            className="form-control"
                                        />
                                        {searchQuery && (
                                            <ListGroup className="mt-2 search-results">
                                                {searchResults.map(user => (
                                                    <ListGroupItem key={user.id}>
                                                        <a className="dropdown-item" href={`/profile/${user.name}`}>
                                                            {user.name}
                                                        </a>
                                                    </ListGroupItem>
                                                ))}
                                            </ListGroup>
                                        )}
                                    </NavItem>

                                    {isLoading ? (
                                        <li className="nav-item">
                                            <span className="nav-link disabled">Loading...</span>
                                        </li>
                                    ) : isAuthenticated ? (
                                        <>
                                            <NavItem>
                                                <NavLink tag={Link} to={`/profile/${user.name}`}>Welcome, {user.name}</NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink href="#" onClick={logout}>Logout</NavLink>
                                            </NavItem>
                                        </>
                                    ) : (
                                        <NavItem>
                                            <NavLink href="#" onClick={() => login('your-token-here')}>Login</NavLink>
                                        </NavItem>
                                    )}
                                </ul>
                            </Collapse>
                        </Navbar>
                    </header>
                )}
            </AuthContext.Consumer>
        );
    }
}
