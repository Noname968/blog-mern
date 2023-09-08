import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function ResetPassword() {
    const { token, _id } = useParams();
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState('');
    const { resetPassword } = useAuth();
    const navigate = useNavigate()

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password === '' || passwordVerify === '') {
            return toast.error("Both Fields are required");
        }

        if (password !== passwordVerify) {
            return toast.error("Passwords do not match");
        }

        try {
            const response = await resetPassword(token, _id, password);
            if (response) {
                toast.success("Password Update Successful");
            }
            navigate("/")
        } catch (error) {
            console.error(error);
            toast.error("Error Updating Password");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Reset Password</h2>
                            <form onSubmit={handleResetPassword}>
                                <div className="form-group mb-3">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input
                                        type="text"
                                        id="newPassword"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        type="text"
                                        id="confirmPassword"
                                        className="form-control"
                                        value={passwordVerify}
                                        onChange={(e) => setPasswordVerify(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-rounded" style={{ backgroundColor: "black", color: "white" }}>
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
