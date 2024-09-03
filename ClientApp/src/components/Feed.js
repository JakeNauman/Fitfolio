import React, { Component } from 'react';
import { jwtDecode } from 'jwt-decode';

class UserFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            loading: true,
            error: null,
        };
    }

    async componentDidMount() {
        this.fetchPosts();
    }

    fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

            const response = await fetch(`https://localhost:7263/Post/userfeed?username=${username}`, {
                method: 'GET',
                headers: {
                    'Accept': '*/*',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();
            this.setState({ posts: data, loading: false });
        } catch (err) {
            this.setState({ error: err, loading: false });
        }
    };
    formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    render() {
        const { posts, loading, error } = this.state;

        if (loading) {
            return <div className="spinner-border text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>;
        }

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        return (
            <div>
                {posts.map((post, index) => (
                    <div
                        key={index}
                        className="post p-3 mb-3 rounded shadow-sm"
                        style={{
                            maxWidth: '600px',
                            alignItems: 'center',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            backgroundColor: post.type === 1 ? 'lightcyan' : post.type === 2 ? 'mintcream' : 'bg-light',
                        }}
                    >
                        <h5>
                            <a
                                href={`/profile/${post.userName}`}
                                style={{ textDecoration: 'none', color: 'mediumslateblue' }}
                            >
                                {post.userName}
                            </a>
                        </h5>
                        <p
                            style={{
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                            }}
                        >
                            {post.content}
                        </p>
                        <footer
                            style={{
                                textAlign: 'right',
                                fontSize: 'small',
                                color: 'gray',
                            }}
                        >
                            {this.formatDate(post.createdAt)}
                        </footer>
                    </div>
                ))}
            </div>
        );
    }
}

export default UserFeed;
