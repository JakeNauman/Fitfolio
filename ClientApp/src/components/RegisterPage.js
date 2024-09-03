import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { withRouter } from './WithRouter';
import { Link } from 'react-router-dom';

class RegisterPage extends Component {
    static contextType = AuthContext;

    state = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        avatar: 'string'
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword, avatar } = this.state;

        try {
            const response = await fetch('https://localhost:7263/api/Accounts/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, confirmPassword, avatar }),
            });
 
            

            if (response.ok) {
                this.props.router.navigate('/login');
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred. Please try again.');
        }
    };

    render() {
        return (
            <div>
                <h2>Register</h2>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="username"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                    </div>

                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </div>

                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                    </div>

                    <div>
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={this.state.confirmPassword}
                            onChange={this.handleChange}
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        );
    }
}

export default withRouter(RegisterPage);