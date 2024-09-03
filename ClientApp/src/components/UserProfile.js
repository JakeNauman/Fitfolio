import React, { Component } from 'react';
import { withRouter } from './WithRouter';
import { jwtDecode } from 'jwt-decode';
import CreatePost from './CreatePost'
class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],

            loading: true,
            selfUserName: '',
            profileUserName: '',
            selfAccount: false,
            followers: [],
            following: [],
            followersDropdownOpen: false,
            followingDropdownOpen: false,

            isFollowing: false
        };
    }

    componentDidMount() {
        this.fetchUserDetails();
    }

    async populateTimeline() {
        try {
            const response = await fetch(`https://localhost:7263/Post/byusername?username=${encodeURIComponent(this.state.profileUserName)}`);
            const data = await response.json();
            this.setState({ posts: data, loading: false });
        }
            catch(error) {
            console.error('Error fetching posts:', error);
            this.setState({ posts: [], loading: false });
        }

    }
    static formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };


    static renderPosts(posts) {
        if (!posts || posts.length === 0) {
            return <div>No posts available.</div>;
        }

        // Sort posts by creation time in descending order
        const sortedPosts = posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return (
            <div>
                {sortedPosts.map((post, index) => (
                    <div
                        key={index}
                        className="post p-3 mb-3 rounded shadow-sm"
                        style={{
                            maxWidth: '600px',
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


    async fetchUserDetails() {
        try {
            const { username } = this.props.router.params;
            const response = await fetch(`https://localhost:7263/Users/byusername?username=${encodeURIComponent(username)}`);

            if (response.ok) {
                const user = await response.json();

                // Set the profileUserName and followers, then execute the rest in the callback
                this.setState({ profileUserName: user.username, followers: user.followers, following: user.following }, () => {
                    // This callback runs after the state has been updated
                    this.populateTimeline();

                    // Check if it's the user's own account
                    const token = localStorage.getItem('token');
                    if (token) {
                        const decodedToken = jwtDecode(token);
                        const username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
                        this.setState({ selfUserName: username });

                        if (username === user.username) {
                            this.setState({ selfAccount: true });
                        } else {
                            if (this.state.followers.includes(username)) { 
                                this.setState({ isFollowing: true });
                            }
                        }
                    }
                });

            } else {
                console.error('Failed to fetch user details');
            }
        } catch (error) {
            console.error('Error decoding token or fetching user:', error);
        }
    }


    toggleFollowersDropdown = () => {
        this.setState(prevState => ({
            followersDropdownOpen: !prevState.followersDropdownOpen
        }));
    };
    toggleFollowingDropdown = () => {
        this.setState(prevState => ({
            followingDropdownOpen: !prevState.followingDropdownOpen
        }));
    };

    toggleFollow = async () => {
        const { isFollowing, profileUserName, selfUserName } = this.state;

        try {
            const response = await fetch(`https://localhost:7263/Follower?friend1=${encodeURIComponent(selfUserName)}&friend2=${encodeURIComponent(profileUserName)}`, {
                method: isFollowing ? 'DELETE' : 'POST',  // DELETE for unfollow, POST for follow
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                this.setState({ isFollowing
                    : !isFollowing
                });
                this.fetchUserDetails();
            } else {
                alert('Operation failed');
            }
        } catch (error) {
            console.error('Error occurred:', error);
            alert('An error occurred. Please try again.');
        }
    };

    render() {
        const { profileUserName, selfAccount, followers, following, isFollowing, followersDropdownOpen, followingDropdownOpen } = this.state;
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : UserProfile.renderPosts(this.state.posts);
        return (
            <div>
                <h1>{profileUserName}</h1>
                {profileUserName ? (
                    <div className="row">
                        <div className="col-lg-3"> {/* Left column for profile content */}
                            <div className="row mb-3">
                                <div className="col d-flex justify-content-between">
                                    <div className="followersdropdown me-2">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm dropdown-toggle"
                                            onClick={this.toggleFollowersDropdown}
                                        >
                                            Followers: {followers.length}
                                        </button>
                                        {followersDropdownOpen && (
                                            <div className="dropdown-menu show" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                {followers.length === 0 ? (
                                                    <p className="dropdown-item">No followers</p>
                                                ) : (
                                                    followers.map((follower, index) => (
                                                        <a key={index} className="dropdown-item" href={`/profile/${follower}`}>
                                                            {follower}
                                                        </a>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="followingdropdown">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm dropdown-toggle"
                                            onClick={this.toggleFollowingDropdown}
                                        >
                                            Following: {following.length}
                                        </button>
                                        {followingDropdownOpen && (
                                            <div className="dropdown-menu show" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                {following.length === 0 ? (
                                                    <p className="dropdown-item">Not following anyone</p>
                                                ) : (
                                                    following.map((followed, index) => (
                                                        <a key={index} className="dropdown-item" href={`/profile/${followed}`}>
                                                            {followed}
                                                        </a>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {!selfAccount && (
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm mb-3"
                                    onClick={this.toggleFollow}
                                >
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                            )}

                            <p>Username: {profileUserName}</p>
                            {/* If own account */}
                            {selfAccount && <p>This is your account</p>}
                            {selfAccount && <CreatePost />}
                        </div>

                        <div className="col-lg-9"> {/* Middle column for posts */}
                            {contents}
                        </div>
                    </div>
                ) : (
                    <p>Profile does not exist.</p>
                )}
            </div>
        );
    }
}

// Exporting withRouter to gain access to route parameters
export default withRouter(UserProfile);
