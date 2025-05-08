// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import bg2 from "../images/bg2.jpg";
// import "../css/Forms.css";
// import { decodeToken } from '../auth/JwtUtils'
// import { Navbar } from "react-bootstrap";

// const Login = () => {
//     const location = useLocation();
//     const currentPath = location.pathname;

//     const [formData, setFormData] = useState({ email: "", password: "" });
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         try {
//             const response = await axios.post("https://localhost:7186/api/Tblusers/login", formData, {
//                 withCredentials: true
//             });

//             const token = response.data.token;
//             // Save token
//             sessionStorage.setItem("token", token);

//             // Decode and save user info
//             const decoded = decodeToken(token);
//             sessionStorage.setItem("user", JSON.stringify(decoded)); // ✅ Proper object storage

//             const role = decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

//             // showSuccess("Login successful!");
//             console.log("User role:",role)
//             // Redirect user based on role
//             switch (role) {
//                 case "Admin":
//                     // return "/Admin/dashboard";
//                     navigate("/Admin/dashboard");
//                     break;
//                 case "GameZoneOwner":
//                     navigate("/GameZoneOwner/dashboard");
//                     break;
//                 // return "/GameZoneOwner/dashboard";
//                 case "User":
//                     navigate("/user/dashboard");
//                     break;
//                 // return "/user/dashboard";
//                 default:
//                     navigate("/login");
//                     // return "/login";
//             }

//             // if (response.data.success) {
//             //     localStorage.setItem("token", response.data.token);
//             //     localStorage.setItem("roleId", response.data.roleId);
//             //     navigate(response.data.redirectUrl);
//             // } else {
//             //     setError(response.data.message);
//             // }
//         } catch (error) {
//             console.error(error);
//             setError(error.response?.data?.message || "Login failed. Please try again.");
//         }
//     };

//     const handleForgot=()=>{
//             navigate("/forgotpassword");
//     }

//     return (
//         <>
 
//         <div
//             className="d-flex align-items-center justify-content-center vh-100"
//             style={{
//                 backgroundImage: `url(${bg2})`,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//                 position: "relative",
//                 overflow: "hidden"
//             }}
//         >
//             <div
//                 className="position-absolute top-0 start-0 w-100 h-100"
//                 style={{ background: "rgba(0,0,20,0.6)", zIndex: 1 }}
//             />
//             <div
//                 className="p-4 rounded shadow-lg text-white"
//                 style={{
//                     width: "350px",
//                     background: "rgba(20, 20, 60, 0.85)",
//                     backdropFilter: "blur(5px)",
//                     borderRadius: "20px",
//                     zIndex: 2,
//                     marginTop: "50px",
//                     position: "relative"
//                 }}
//             >
//                 <h4 className="text-center mb-4" style={{ color: "#00f2c4" }}>
//                     Game Zone Login
//                 </h4>

//                 <div className="d-flex justify-content-center mb-4">
//                     <Link to="/register">
//                         <button className="btn auth-register-btn me-3 px-4 py-2">
//                             REGISTER
//                         </button>
//                     </Link>
//                     <Link to="/login">
//                         <button className="btn auth-login-btn px-4 py-2">
//                             LOG IN
//                         </button>
//                     </Link>
//                 </div>

//                 {error && <div className="alert alert-danger">{error}</div>}

//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-3 position-relative floating-label-input">
//                         <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             className="form-control bg-dark text-white border-0"
//                             required
//                             id="emailField"
//                             placeholder=" "
//                         />
//                         <label
//                             htmlFor="emailField"
//                             className=""
//                         >
//                             Email or Username
//                         </label>
//                     </div>
//                     <div className="mb-3 position-relative floating-label-input">
//                         <input
//                             type="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             className="form-control bg-dark text-white border-0"
//                             required
//                             id="passwordField"
//                             placeholder=" "
//                         />
//                         <label
//                             htmlFor="passwordField"
//                             className=""
//                         >
//                             Password
//                         </label>
//                         <div className="text-end mt-1">
//                             {/* <small><a href="#" className="text-info">Forgot Password?</a></small> */}
//                             <small><Link to="/forgotpassword" onChange={handleForgot} className="text-info">Forgot Password?</Link></small>
//                         </div>
//                     </div>
//                     <button type="submit" className="btn w-100 mt-2" style={{
//                         background: "linear-gradient(to right, #00f2fe, #4facfe)",
//                         border: "none",
//                         color: "#000",
//                         fontWeight: "bold"
//                     }}>
//                         Login to Account
//                     </button>

//                     {/* <div className="text-center my-3">OR</div>

//                     <button className="btn btn-outline-light w-100" type="button">
//                         Login with Discord
//                     </button> */}

//                     <div className="text-center mt-3">
//                         <Link to="/register" className="text-info">Create an Account</Link>
//                     </div>
//                 </form>
//             </div>
//         </div>
//         </>
//     );
// };

// export default Login;

// ------------------------------------------------------------------------------







import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import bg2 from "../images/bg2.jpg";
import "../css/Forms.css";
import { decodeToken, isAuthenticated, getUserRole } from '../auth/JwtUtils';
import Navbar from "./Navbar";

const Login = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // ✅ Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            const role = getUserRole();
            switch (role) {
                case "Admin":
                    navigate("/Admin/dashboard");
                    break;
                case "GameZoneOwner":
                    navigate("/GameZoneOwner/dashboard");
                    break;
                case "User":    
                    navigate("/");
                    break;
                default:
                    navigate("/");
            }
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await axios.post("https://localhost:7186/api/Tblusers/login", formData, {
                withCredentials: true
            });

            const token = response.data.token;
            sessionStorage.setItem("token", token);

            const decoded = decodeToken(token);
            sessionStorage.setItem("user", JSON.stringify(decoded));

            console.log("Decoded Token:", decoded);

            const username = decodeToken(token)
            sessionStorage.setItem("username", JSON.stringify(username))
            console.log("Decoded username:", username);

            const role = decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            switch (role) {
                case "Admin":
                    navigate("/Admin/dashboard");
                    break;
                case "GameZoneOwner":
                    navigate("/GameZoneOwner/dashboard");
                    break;
                case "User":
                    navigate("/");
                    break;
                default:
                    navigate("/login");
            }
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <>
        <Navbar/>
        <div
            className="d-flex align-items-center justify-content-center vh-100"
            style={{
                backgroundImage: `url(${bg2})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                overflow: "hidden"
            }}
        >
            <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ background: "rgba(0,0,20,0.6)", zIndex: 1 }}
            />
            <div
                className="p-4 rounded shadow-lg text-white"
                style={{
                    width: "350px",
                    background: "rgba(20, 20, 60, 0.85)",
                    backdropFilter: "blur(5px)",
                    borderRadius: "20px",
                    zIndex: 2,
                    marginTop: "50px",
                    position: "relative"
                }}
            >
                <h4 className="text-center mb-4" style={{ color: "#00f2c4" }}>
                    Game Zone Login
                </h4>

                <div className="d-flex justify-content-center mb-4">
                    <Link to="/register">
                        <button className="btn auth-register-btn me-3 px-4 py-2">REGISTER</button>
                    </Link>
                    <Link to="/login">
                        <button className="btn auth-login-btn px-4 py-2">LOG IN</button>
                    </Link>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3 position-relative floating-label-input">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control bg-dark text-white border-0"
                            required
                            id="emailField"
                            placeholder=" "
                        />
                        <label htmlFor="emailField">Email or Username</label>
                    </div>

                    <div className="mb-3 position-relative floating-label-input">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-control bg-dark text-white border-0"
                            required
                            id="passwordField"
                            placeholder=" "
                        />
                        <label htmlFor="passwordField">Password</label>
                        <div className="text-end mt-1">
                            <small>
                                <Link to="/forgotpassword" className="text-info">Forgot Password?</Link>
                            </small>
                        </div>
                    </div>

                    <button type="submit" className="btn w-100 mt-2" style={{
                        background: "linear-gradient(to right, #00f2fe, #4facfe)",
                        border: "none",
                        color: "#000",
                        fontWeight: "bold"
                    }}>
                        Login to Account
                    </button>

                    <div className="text-center mt-3">
                        <Link to="/register" className="text-info">Create an Account</Link>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
};

export default Login;
