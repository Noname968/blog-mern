import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Forgotpass() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const {forgotPassword} = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!email){
            return toast.error("Enter Email Address")
        }
        try {
            const response = await forgotPassword(email);
            if (response) {
                setMessage(`A password reset link has been sent to ${email}. Please check your email.`);
                toast.success("Link Sent Successfully");
            }
            setShowMessage(true);
        } catch (error) {
            console.error('Error during password reset:', error);
            toast.error("An error occurred while sending the reset link.");
        }
    };
    

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <div className="card" style={{ width: '20rem' }}>
                    <div className="card-body">
                        <h5 className="card-title mb-3">Forgot Password</h5>
                        {showMessage ? (
                            <div className="alert alert-success">{message}</div>
                        ) : (
                            <>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="btn mb-2" style={{ backgroundColor: "black", color: "white" }}>
                                        Reset Password
                                    </button>
                                </form>
                                <p className="small fw mt-0 pt-1 mb-3">
                                    Remember your Password{" "}
                                    <Link to="/Login" className="link-danger">
                                        Login
                                    </Link>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default Forgotpass;
