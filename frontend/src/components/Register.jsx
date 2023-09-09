import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkUsernameAvailability, checkEmailAvailability } from "../api"; // Update the path
import { useAuth } from "../context/AuthContext"; // Import the AuthContext hook
import PacmanLoader from "react-spinners/PacmanLoader";
import "../App.css";
import { motion } from "framer-motion";
import register from '../assets/register.png'
import toast from 'react-hot-toast';


function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setpassword2] = useState("");
  const [progress, setProgress] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const context = useAuth();
  const { registerUser } = context;
  const navigate = useNavigate()

  useEffect(() => {
    const checkUsername = async () => {
      try {
        if (username) {
          const response = await checkUsernameAvailability(username);
          setIsUsernameAvailable(response.available);
        }
      } catch (error) {
        console.error("Error checking username availability:", error);
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
        console.error("Error checking email availability:", error);
        toast.error("Error checking email availability")
      }
    };

    checkEmail();
  }, [email]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    if (username && email && isUsernameAvailable && isEmailAvailable) {
      const userData = {
        name: username,
        email,
        password,
        passwordverify: password2,
      };

      try {
        setProgress(true);
        const response = await registerUser(userData);
        console.log("User registered successfully:", response);
        toast.success("Registration Successful")
        setTimeout(() => {
          navigate('/');
        }, 500);
      } catch (error) {
        console.error("Error registering user:", error);
        toast.error(error.response.data.errorMessage)
      } finally {
        setProgress(false);
      }
    } else {
      // console.log("Please fill all fields and ensure username/email are available.");
      return toast.error("Please fill all fields and ensure username/email are available.")
    }
  };

  return (
    <motion.div       
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}>
      {progress && (
        <>
          <div className="blurred-background">
            <div className="overlay"></div>
            <div className="spanner">
              <div className="loader">
                <PacmanLoader color="#ffe737" />
              </div>
              <p>Creating User, please be patient.</p>
            </div>
          </div>
        </>
      )}
      <section className="" style={{ margin: "0",maxHeight:"90vh" }}>
        <div className="container h-75">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div
              className=" col-lg-12 col-xl-11"
              style={{ borderRadius: "23px" }}
            >
              <div className="card-body p-md-7">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-6 d-flex align-items-center order-1 order-lg-2">
                    <img
                      src={register}
                      className="img-fluid"
                      alt="Sample"
                    />
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                      Sign up
                    </p>
                    <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
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
                            className={`form-control ${
                              isUsernameAvailable ? "" : "is-invalid"
                            }`}
                            value={username}
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
                            className={`form-control ${
                              isEmailAvailable ? "" : "is-invalid"
                            }`}
                            value={email}
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
                            Confirm password
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
                      <div className="d-flex flex-row align-items-center mb-3">
                        <p className="grey-text text-darken-1 mx-3">
                          Already have an account?{" "}
                          <Link to="/login" className="link-danger">
                            Log in
                          </Link>
                        </p>
                      </div>
                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg" style={{backgroundColor:"black",borderRadius:"20px",padding:"8px 20px",border:"none"}}
                        >
                          Register
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default Register;
