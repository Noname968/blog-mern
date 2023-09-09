import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import PacmanLoader from "react-spinners/PacmanLoader";
import login from "../assets/login.png";
import "../App.css";
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [progress, setProgress] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const context = useAuth();
  const { loginUser } = context;
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      const loginData = {
        email,
        password,
        rememberMe,
      };
      try {
        setProgress(true);
          const response = await loginUser(loginData);
          // console.log('User logged in', response);
          toast.success('Login Successful.')
          setProgress(false);
          setTimeout(() => {
            navigate('/');
          }, 1000);
      } catch (error) {
        console.error('Error during login:', error);
        toast.error(error.response.data.errorMessage)
        setProgress(false);
      }
    } else {
      // console.log('Please fill in all fields.');
      return toast.error("Email and Password required")
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {progress && (
        <>
          <div className="blurred-background">
            <div className="overlay"></div>
            <div className="spanner">
              <div className="loader">
                <PacmanLoader color="#ffe737" />
              </div>
              <p>Login in progress, please be patient.</p>
            </div>
          </div>
        </>
      )}
      <section className="vh-100" style={{maxHeight:"92vh"}}>
        <div className="container-fluid h-75">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-4 col-xl-4">
              <img src={login} className="img-fluid" alt="Phone image" />
            </div>
            <div className="col-md-10 col-lg-6 col-xl-3 offset-xl-1">
              <form onSubmit={handleLogin}>
                <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                  <p className="text-center h1 fw-bold mb-4 mx-md-0 mt-4">
                    Sign In
                  </p>
                </div>
                <div className="form-outline mb-3">
                  <label className="form-label" htmlFor="form3Example3">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="form3Example3"
                    className="form-control "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-outline mb-2">
                  <label className="form-label" htmlFor="form3Example4">
                    Password
                  </label>
                  <input
                    type="password"
                    id="form3Example4"
                    className="form-control "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-between mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      id="flexCheckDefault"
                    />
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                      Remember Me
                    </label>
                  </div>
                  <Link to="/forgotpass" className="loginforgot">
                    Forgot password?
                  </Link>
                </div>
                <div className="text-center text-lg-start mt-2 pt-2">
                  <p className="small fw mt-0 pt-1 mb-3">
                    Don't have an account?{" "}
                    <Link to="/register" className="link-danger">
                      Register
                    </Link>
                  </p>
                  <button type="submit" className="loginbtn">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default Login;