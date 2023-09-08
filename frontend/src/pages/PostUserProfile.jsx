import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { useParams } from 'react-router-dom';
import { fetchuserpostsbyId } from '../api'
import {Link} from 'react-router-dom'
import toast from 'react-hot-toast';

export default function PostUserProfile() {
    const { currentUser, fetchAndSetUserDetails, followUser, unfollowUser } = useAuth()
    const [user, setuser] = useState(null)
    const [postcount, setpostcount] = useState(0)
    const { userId } = useParams()


    const fetchauthorposts = async () => {
        try {
            const response = await fetchuserpostsbyId(userId);
            setpostcount(response.length)
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchauthorposts();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDetails = await fetchAndSetUserDetails(userId);
                setuser(userDetails);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchUser();
    }, [fetchAndSetUserDetails, currentUser]);

    const handleFollow = () => {
        followUser(user._id);
        toast.success("Following Author")
    };

    const handleUnfollow = () => {
        unfollowUser(user._id);
        toast.success("Unfollowed Author")
    };

    function formatDate(isoDate) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(isoDate).toLocaleDateString("en-US", options);
    }

    if (!user) {
        return <Loader message={"Fetching Author Profile"} />
    }

    return (
        <div>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-12 col-xl-4">
                        <div className="card" style={{ borderRadius: "15px" }}>
                            <div className="card-body text-center">
                                <div className="mt-3 mb-3">
                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                                        className="rounded-circle img-fluid" style={{ width: "100px" }} />
                                </div>
                                <h4 className="mb-2" style={{ textTransform: "capitalize" }}>{user.name}</h4>
                                <p className="text-muted mb-3">{user.email} <span className="mx-1">|</span> <span>{formatDate(user.joinedAt)}</span></p>
                                {!currentUser ? (
                                    <Link to={'/login'} style={{ textDecoration: "none" }}><button className="followbtn">Login to Follow</button></Link>
                                ) : (
                                    <>
                                        {user && user._id !== currentUser._id ? (
                                            <>
                                                {currentUser.following.includes(user._id) ? (
                                                    <button type="button" className="btn btn-success btn-rounded" style={{ backgroundColor: "black", padding: "6px 15px", borderRadius: "12px", border: "none" }} onClick={handleUnfollow}
                                                    >UnFollow</button>
                                                ) : (
                                                    <button type="button" className="btn btn-success btn-rounded" style={{ backgroundColor: "black", padding: "6px 15px", borderRadius: "12px", border: "none" }} onClick={handleFollow}
                                                    >Follow</button>
                                                )}
                                            </>
                                        ) : (
                                            <button type="button" className="btn btn-success btn-rounded" style={{ backgroundColor: "black", padding: "6px 15px", borderRadius: "12px", border: "none" }}
                                            >Your Profile</button>                         
                                       )}
                                    </>
                                )}
                                <div className="d-flex justify-content-between text-center mt-4 mb-2">
                                    <div>
                                        <p className="mb-2 h5">{user.followers.length}</p>
                                        <p className="text-muted mb-0">Followers</p>
                                    </div>
                                    <div className="px-3">
                                        <p className="mb-2 h5">{user.following.length}</p>
                                        <p className="text-muted mb-0">Following</p>
                                    </div>
                                    <div>
                                        <p className="mb-2 h5">{postcount}</p>
                                        <p className="text-muted mb-0">Total Posts</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
