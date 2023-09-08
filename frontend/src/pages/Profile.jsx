import React, { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext'
import { checkUsernameAvailability, checkEmailAvailability } from "../api"; // Update the path
import './Profile.css'
import Loader from "../components/Loader"
import { fetchmyPosts } from '../api';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { motion } from "framer-motion";

function Profile() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setpassword2] = useState("");
    const [progress, setProgress] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
    const [isEmailAvailable, setIsEmailAvailable] = useState(true);
    const [postcount, setpostcount] = useState(0)
    const context = useAuth();
    const { currentUser, updateUser, isLoggedIn, logoutUser } = context;
    const history = useNavigate();

    const fetchmyposts = async () => {
        try {
            const response = await fetchmyPosts();
            setpostcount(response.length)
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchmyposts();
    }, []);

    useEffect(() => {
        const checkUsername = async () => {
            try {
                if (username) {
                    const response = await checkUsernameAvailability(username);
                    setIsUsernameAvailable(response.available);
                }
            } catch (error) {
                // console.error("Error checking username availability:", error);
                toast.error("Error checking username availability")
            }
        };

        checkUsername();
    }, [username]);

    useEffect(() => {
        const checkEmail = async () => {
            try {
                if (email) {
                    const response = await checkEmailAvailability(email);
                    setIsEmailAvailable(response.available);
                }
            } catch (error) {
                // console.error("Error checking email availability:", error);
                toast.error("Error checking email availability")
            }
        };

        checkEmail();
    }, [email]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== password2) {
            // console.error("Passwords do not match");
            toast.error("Passwords do not match")
            return;
        }
        const userData = {
            name: username,
            email,
            password,
        };
        if(!email && !username && !password && !password2){
            return toast.error("Enter a Field to Update")
        }
        try {
            setProgress(true);
            const response = await updateUser(currentUser._id, userData);
            // console.log("User Updated successfully:", response);
            toast.success("Updated successfully")
            setUsername("")
            setEmail("")
            setPassword("")
            setpassword2("")
        } catch (error) {
            console.error("Error registering user:", error);
        } finally {
            setProgress(false);
        }
    };

    const handleLogout = async () => {
        await logoutUser();
        toast.success(`Logout Successful`)
        history('/')
    };

    function formatDate(isoDate) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(isoDate).toLocaleDateString("en-US", options);
      }
    
    if (isLoggedIn && !currentUser) {
        return <Loader message={"Fetching User Profile"} />
    }

    return (
         <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
            {progress && (<Loader message={"Updating User Details"} />)}
            <div className='profile-page'>
                <h2>Profile</h2>
                <div className="profiles">
                    <div className="profile-left card">
                        <form className="mx-1 mx-md-4 card-body" onSubmit={handleSubmit}>
                            <div className="d-flex flex-row align-items-center mb-3">
                                <div className="form-outline flex-fill mb-0">
                                    <label
                                        className="form-label"
                                        htmlFor="form3Example1c"
                                    >
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="form3Example1c"
                                        className={`form-control ${isUsernameAvailable ? "" : "is-invalid"
                                            }`}
                                        value={username}
                                        placeholder={currentUser.name}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    {!isUsernameAvailable && (
                                        <div className="invalid-feedback">
                                            Username is not available
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="d-flex flex-row align-items-center mb-3">
                                <div className="form-outline flex-fill mb-0">
                                    <label
                                        className="form-label"
                                        htmlFor="form3Example3c"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="form3Example3c"
                                        className={`form-control ${isEmailAvailable ? "" : "is-invalid"
                                            }`}
                                        value={email}
                                        placeholder={currentUser.email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    {!isEmailAvailable && (
                                        <div className="invalid-feedback">
                                            Email is not available
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="d-flex flex-row align-items-center mb-3">
                                <div className="form-outline flex-fill mb-0">
                                    <label
                                        className="form-label"
                                        htmlFor="form3Example4c"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="form3Example4c"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                        }}
                                        minLength={8}
                                    />
                                </div>
                            </div>
                            <div className="d-flex flex-row align-items-center mb-3">
                                <div className="form-outline flex-fill mb-0">
                                    <label
                                        className="form-label"
                                        htmlFor="form3Example4cd"
                                    >
                                        Confirm Password
                                    </label>
                                    <input
                                        type="text"
                                        id="form3Example4cd"
                                        className="form-control"
                                        value={password2}
                                        onChange={(e) => {
                                            setpassword2(e.target.value);
                                        }}
                                        minLength={8}
                                    />
                                </div>
                            </div>
                            <div className="d-flex justify-content-center mx-4 mb-lg-4">
                                <button
                                    type="submit"
                                    className="btn" style={{ backgroundColor: "black", padding: "6px 15px", borderRadius: "12px", color: "white",border:"none" }}>
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="profile-right ">
                        <div className="card" style={{ borderRadius: "15px" }}>
                            <div className="card-body text-center">
                                <div className="mt-3 mb-4">
                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                                        className="rounded-circle img-fluid" style={{ width: "100px", backgroundColor: "#eee" }} />
                                </div>
                                <h4 className="mb-2" style={{ textTransform: "capitalize" }}>{currentUser && currentUser.name}</h4>
                                <p className="text-muted mb-3">{currentUser.email}<span className="mx-2">|</span> <span>{formatDate(currentUser.joinedAt)}</span> </p>
                                <button type="button" className="btn btn-success btn-rounded" style={{ backgroundColor: "black", padding: "6px 15px", borderRadius: "12px",border:"none" }} onClick={handleLogout}
                                >Logout</button>
                                <div className="d-flex justify-content-between text-center mt-4 mb-2 mx-3">
                                    <div>
                                        <p className="mb-2 h5">{currentUser.followers.length}</p>
                                        <p className="text-muted mb-0">Followers</p>
                                    </div>
                                    <div className="px-3">
                                        <p className="mb-2 h5">{currentUser.following.length}</p>
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
        </motion.div>
    )
}

export default Profile
