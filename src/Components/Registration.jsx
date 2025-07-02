// import { useEffect, useState, useRef } from "react"
// import axios from "axios"
// import Swal from "sweetalert2"
// import { useNavigate, Link } from "react-router-dom"
// import "../css/SignupPage.css"
// import Navbar from "./Navbar"
// import { getUserRole, isAuthenticated } from "../auth/JwtUtils"
// import ReCAPTCHA from "react-google-recaptcha"
// import {
//   FaUser,
//   FaEnvelope,
//   FaLock,
//   FaPhone,
//   FaEdit,
//   FaEye,
//   FaEyeSlash,
//   FaGamepad,
//   FaShieldAlt,
//   FaCheckCircle,
//   FaClock,
//   FaExclamationCircle,
//   FaInfoCircle,
//   FaTimes,
// } from "react-icons/fa"

// const SITE_KEY = "6LfTQ04rAAAAAJgRTJbOD4IvLc8SE9_1UTpSuYAc"
// const API_BASE_URL = "https://localhost:7186/api"

// // Validation patterns
// const PATTERNS = {
//   username: /^[a-zA-Z0-9_]{4,20}$/,
//   email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//   phone: /^[0-9]{10}$/,
//   password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
// }

// // Error messages
// const ERROR_MESSAGES = {
//   username: {
//     required: "Username is required",
//     pattern: "Username must be 4-20 characters and can only contain letters, numbers, and underscores",
//     taken: "This username is already taken",
//   },
//   email: {
//     required: "Email is required",
//     pattern: "Please enter a valid email address",
//     taken: "This email is already registered",
//   },
//   password: {
//     required: "Password is required",
//     pattern: "Password must meet all the requirements below",
//   },
//   phone: {
//     required: "Phone number is required",
//     pattern: "Please enter a valid 10-digit phone number",
//   },
// }

// const Registration = () => {
//   // Form state
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     phone: "",
//     bio: "",
//   })

//   // Validation state
//   const [errors, setErrors] = useState({})
//   const [touched, setTouched] = useState({})
//   const [isFormValid, setIsFormValid] = useState(false)
//   const [isCheckingUsername, setIsCheckingUsername] = useState(false)
//   const [isCheckingEmail, setIsCheckingEmail] = useState(false)
//   const [debounceTimers, setDebounceTimers] = useState({})

//   // UI state
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [otpLoading, setOtpLoading] = useState(false)
//   const [passwordStrength, setPasswordStrength] = useState("")
//   const [strengthPercentage, setStrengthPercentage] = useState(0)
//   const [strengthColor, setStrengthColor] = useState("#ef4444")

//   // OTP state
//   const [otp, setOtp] = useState("")
//   const [isOtpSent, setIsOtpSent] = useState(false)
//   const [isOtpVerified, setIsOtpVerified] = useState(false)
//   const [otpResendTimer, setOtpResendTimer] = useState(0)
//   const [otpAttempts, setOtpAttempts] = useState(0)

//   const navigate = useNavigate()
//   const recaptchaRef = useRef()
//   const usernameRef = useRef(null)
//   const emailRef = useRef(null)
//   const passwordRef = useRef(null)
//   const phoneRef = useRef(null)

//   // Debounce function for API calls
//   const debounce = (func, delay, field) => {
//     return (...args) => {
//       if (debounceTimers[field]) {
//         clearTimeout(debounceTimers[field])
//       }
      
//       const newTimer = setTimeout(() => {
//         func(...args)
//       }, delay)
      
//       setDebounceTimers(prev => ({
//         ...prev,
//         [field]: newTimer
//       }))
//     }
//   }

//   // Check if username is available
//   const checkUsernameAvailability = async (username) => {
//     if (!username || !PATTERNS.username.test(username)) return
    
//     setIsCheckingUsername(true)
//     try {
//       const response = await axios.get(`${API_BASE_URL}/Tblusers/check-username/${username}`)
//       if (response.data.isAvailable === false) {
//         setErrors(prev => ({ ...prev, username: ERROR_MESSAGES.username.taken }))
//       } else {
//         setErrors(prev => {
//           const newErrors = { ...prev }
//           if (newErrors.username === ERROR_MESSAGES.username.taken) {
//             delete newErrors.username
//           }
//           return newErrors
//         })
//       }
//     } catch (error) {
//       console.error("Error checking username:", error)
//     } finally {
//       setIsCheckingUsername(false)
//     }
//   }

//   // Check if email is available
//   const checkEmailAvailability = async (email) => {
//     if (!email || !PATTERNS.email.test(email)) return
    
//     setIsCheckingEmail(true)
//     try {
//       const response = await axios.get(`${API_BASE_URL}/Tblusers/check-email/${email}`)
//       if (response.data.isAvailable === false) {
//         setErrors(prev => ({ ...prev, email: ERROR_MESSAGES.email.taken }))
//       } else {
//         setErrors(prev => {
//           const newErrors = { ...prev }
//           if (newErrors.email === ERROR_MESSAGES.email.taken) {
//             delete newErrors.email
//           }
//           return newErrors
//         })
//       }
//     } catch (error) {
//       console.error("Error checking email:", error)
//     } finally {
//       setIsCheckingEmail(false)
//     }
//   }

//   // Debounced versions of availability checks
//   const debouncedCheckUsername = debounce(checkUsernameAvailability, 500, 'username')
//   const debouncedCheckEmail = debounce(checkEmailAvailability, 500, 'email')

//   // Validate a single field
//   const validateField = (name, value) => {
//     if (!value) {
//       return ERROR_MESSAGES[name]?.required || null
//     }

//     if (PATTERNS[name] && !PATTERNS[name].test(value)) {
//       return ERROR_MESSAGES[name]?.pattern || null
//     }

//     return null
//   }

//   // Validate all fields
//   const validateForm = () => {
//     const newErrors = {}
//     let isValid = true

//     Object.keys(formData).forEach(field => {
//       if (field === 'bio') return // Bio is optional
      
//       const error = validateField(field, formData[field])
//       if (error) {
//         newErrors[field] = error
//         isValid = false
//       }
//     })

//     // Additional validation for email verification
//     if (!isOtpVerified && formData.email) {
//       isValid = false
//     }

//     setErrors(newErrors)
//     setIsFormValid(isValid)
//     return isValid
//   }

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
    
//     // Mark field as touched
//     if (!touched[name]) {
//       setTouched(prev => ({ ...prev, [name]: true }))
//     }
    
//     // Validate field
//     const error = validateField(name, value)
//     setErrors(prev => ({
//       ...prev,
//       [name]: error
//     }))

//     // Check username/email availability
//     if (name === 'username' && value && PATTERNS.username.test(value)) {
//       debouncedCheckUsername(value)
//     }
    
//     if (name === 'email' && value && PATTERNS.email.test(value)) {
//       debouncedCheckEmail(value)
//     }

//     // Check password strength
//     if (name === 'password') {
//       checkPasswordStrength(value)
//     }
//   }

//   // Handle input blur
//   const handleBlur = (e) => {
//     const { name, value } = e.target
    
//     // Mark field as touched
//     setTouched(prev => ({ ...prev, [name]: true }))
    
//     // Validate field
//     const error = validateField(name, value)
//     setErrors(prev => ({
//       ...prev,
//       [name]: error
//     }))
//   }

//   // Check password strength
//   const checkPasswordStrength = (password) => {
//     let strength = "Weak"
//     let percentage = 25
//     let color = "#ef4444"

//     const lengthCheck = password.length >= 8
//     const numberCheck = /[0-9]/.test(password)
//     const symbolCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password)
//     const upperCheck = /[A-Z]/.test(password)
//     const lowerCheck = /[a-z]/.test(password)

//     if (lengthCheck && numberCheck && symbolCheck && upperCheck && lowerCheck) {
//       strength = "Very Strong"
//       percentage = 100
//       color = "#10b981"
//     } else if (lengthCheck && numberCheck && symbolCheck) {
//       strength = "Strong"
//       percentage = 80
//       color = "#22c55e"
//     } else if (lengthCheck && (numberCheck || symbolCheck)) {
//       strength = "Good"
//       percentage = 60
//       color = "#f59e0b"
//     } else if (password.length >= 6) {
//       strength = "Fair"
//       percentage = 40
//       color = "#f97316"
//     }

//     setPasswordStrength(strength)
//     setStrengthPercentage(percentage)
//     setStrengthColor(color)
//   }

//   // Send OTP
//   const sendOtp = async () => {
//     if (!formData.email) {
//       Swal.fire({
//         icon: "error",
//         title: "Email Required",
//         text: "Please enter an email to receive OTP!",
//         background: "rgba(15, 15, 20, 0.95)",
//         color: "#fff",
//         confirmButtonColor: "#f9c349",
//       })
//       return
//     }

//     if (errors.email) {
//       Swal.fire({
//         icon: "error",
//         title: "Invalid Email",
//         text: "Please enter a valid email address!",
//         background: "rgba(15, 15, 20, 0.95)",
//         color: "#fff",
//         confirmButtonColor: "#f9c349",
//       })
//       return
//     }

//     setOtpLoading(true)
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/Tblusers/send-otp`,
//         {
//           email: formData.email,
//         },
//         { withCredentials: true }
//       )

//       if (response.data.success) {
//         setIsOtpSent(true)
//         localStorage.setItem("otpEmail", formData.email)
        
//         // Start resend timer
//         setOtpResendTimer(60)
        
//         Swal.fire({
//           icon: "success",
//           title: "OTP Sent!",
//           text: response.data.message,
//           background: "rgba(15, 15, 20, 0.95)",
//           color: "#fff",
//           confirmButtonColor: "#f9c349",
//         })
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Failed",
//           text: response.data.message,
//           background: "rgba(15, 15, 20, 0.95)",
//           color: "#fff",
//           confirmButtonColor: "#f9c349",
//         })
//       }
//     } catch (error) {
//       console.log(error)
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to send OTP!",
//         background: "rgba(15, 15, 20, 0.95)",
//         color: "#fff",
//         confirmButtonColor: "#f9c349",
//       })
//     } finally {
//       setOtpLoading(false)
//     }
//   }

//   // Verify OTP
//   const verifyOtp = async () => {
//     if (!otp) {
//       Swal.fire({
//         icon: "error",
//         title: "OTP Required",
//         text: "Please enter the OTP!",
//         background: "rgba(15, 15, 20, 0.95)",
//         color: "#fff",
//         confirmButtonColor: "#f9c349",
//       });
//       return;
//     }
  
//     const storedEmail = localStorage.getItem("otpEmail");
//     const trimmedOtp = otp.trim();
//     setOtpLoading(true);
    
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/Tblusers/verify-otp`,
//         {
//           email: storedEmail.trim(),
//           otp: trimmedOtp,
//         },
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "application/json"
//           }
//         }
//       )
  
//       if (response.data.success) {
//         setIsOtpVerified(true);
//         setIsOtpSent(false);
//         Swal.fire({
//           icon: "success",
//           title: "Email Verified!",
//           text: response.data.message,
//           background: "rgba(15, 15, 20, 0.95)",
//           color: "#fff",
//           confirmButtonColor: "#f9c349",
//         });
//         localStorage.removeItem("otpEmail");
//         setFormData(prev => ({ ...prev, email: storedEmail }));
        
//         // Validate form after email verification
//         validateForm();
//       } else {
//         setOtpAttempts(prev => prev + 1);
        
//         Swal.fire({
//           icon: "error",
//           title: "Invalid OTP",
//           text: response.data.message,
//           background: "rgba(15, 15, 20, 0.95)",
//           color: "#fff",
//           confirmButtonColor: "#f9c349",
//         });
        
//         // If too many failed attempts, reset OTP process
//         if (otpAttempts >= 2) {
//           setIsOtpSent(false);
//           setOtp("");
//           setOtpAttempts(0);
//           localStorage.removeItem("otpEmail");
          
//           Swal.fire({
//             icon: "warning",
//             title: "Too Many Attempts",
//             text: "Please request a new OTP",
//             background: "rgba(15, 15, 20, 0.95)",
//             color: "#fff",
//             confirmButtonColor: "#f9c349",
//           });
//         }
//       }
//     } catch (error) {
//       console.error("OTP verification error:", error.response?.data || error.message);
//       setOtpAttempts(prev => prev + 1);
      
//       Swal.fire({
//         icon: "error",
//         title: "Verification Failed",
//         text: error.response?.data?.message || "Invalid or expired OTP!",
//         background: "rgba(15, 15, 20, 0.95)",
//         color: "#fff",
//         confirmButtonColor: "#f9c349",
//       });
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     // Final validation
//     if (!validateForm()) {
//       // Show error for first invalid field
//       const firstErrorField = Object.keys(errors).find(key => errors[key])
//       if (firstErrorField) {
//         const fieldRef = {
//           username: usernameRef,
//           email: emailRef,
//           password: passwordRef,
//           phone: phoneRef
//         }[firstErrorField]
        
//         if (fieldRef && fieldRef.current) {
//           fieldRef.current.focus()
//         }
        
//         Swal.fire({
//           icon: "error",
//           title: "Validation Error",
//           text: errors[firstErrorField],
//           background: "rgba(15, 15, 20, 0.95)",
//           color: "#fff",
//           confirmButtonColor: "#f9c349",
//         })
//         return
//       }
//     }

//     // Check if email is verified
//     if (!isOtpVerified) {
//       Swal.fire({
//         icon: "warning",
//         title: "Email Verification Required",
//         text: "Please verify your email with OTP before registering!",
//         background: "rgba(15, 15, 20, 0.95)",
//         color: "#fff",
//         confirmButtonColor: "#f9c349",
//       })
//       return
//     }

//     // Get reCAPTCHA token
//     let token
//     if (recaptchaRef.current) {
//       try {
//         token = await recaptchaRef.current.executeAsync()
//         recaptchaRef.current.reset()
//         if (!token) {
//           Swal.fire({
//             icon: "error",
//             title: "Security Check Failed",
//             text: "Failed to get captcha token",
//             background: "rgba(15, 15, 20, 0.95)",
//             color: "#fff",
//             confirmButtonColor: "#f9c349",
//           })
//           return
//         }
//       } catch (error) {
//         console.error("reCAPTCHA error:", error)
//         Swal.fire({
//           icon: "error",
//           title: "Security Check Failed",
//           text: "reCAPTCHA verification failed",
//           background: "rgba(15, 15, 20, 0.95)",
//           color: "#fff",
//           confirmButtonColor: "#f9c349",
//         })
//         return
//       }
//     } else {
//       Swal.fire({
//         icon: "error",
//         title: "Security Check",
//         text: "reCAPTCHA not ready",
//         background: "rgba(15, 15, 20, 0.95)",
//         color: "#fff",
//         confirmButtonColor: "#f9c349",
//       })
//       return
//     }

//     setIsLoading(true)
//     try {
//       const response = await axios.post(`${API_BASE_URL}/Tblusers/register`, {
//         userName: formData.username,
//         email: formData.email,
//         password: formData.password,
//         phone: formData.phone,
//         bio: formData.bio,
//         roleId: 3,
//         CaptchaToken: token,
//       })

//       if (response.data.success) {
//         Swal.fire({
//           icon: "success",
//           title: "Registration Successful!",
//           text: response.data.message,
//           background: "rgba(15, 15, 20, 0.95)",
//           color: "#fff",
//           confirmButtonColor: "#f9c349",
//         }).then(() => {
//           navigate("/login")
//         })
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Registration Failed",
//           text: response.data.message,
//           background: "rgba(15, 15, 20, 0.95)",
//           color: "#fff",
//           confirmButtonColor: "#f9c349",
//         })
//       }
//     } catch (error) {
//       console.error(error)
      
//       // Handle specific API errors
//       const errorMessage = error.response?.data?.message || "Registration failed! Please try again."
      
//       Swal.fire({
//         icon: "error",
//         title: "Registration Failed",
//         text: errorMessage,
//         background: "rgba(15, 15, 20, 0.95)",
//         color: "#fff",
//         confirmButtonColor: "#f9c349",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // OTP resend timer
//   useEffect(() => {
//     let interval
//     if (otpResendTimer > 0) {
//       interval = setInterval(() => {
//         setOtpResendTimer(prev => prev - 1)
//       }, 1000)
//     }
    
//     return () => {
//       if (interval) clearInterval(interval)
//     }
//   }, [otpResendTimer])

//   // Redirect if already authenticated
//   useEffect(() => {
//     if (isAuthenticated()) {
//       const role = getUserRole()
//       switch (role) {
//         case "Admin":
//           navigate("/Admin/dashboard")
//           break
//         case "GameZoneOwner":
//           navigate("/GameZoneOwner/dashboard")
//           break
//         case "User":
//           navigate("/user/dashboard")
//           break
//         default:
//           navigate("/")
//       }
//     }
//   }, [navigate])

//   // Validate form when dependencies change
//   useEffect(() => {
//     validateForm()
//   }, [formData, isOtpVerified])

//   // Clear timers on unmount
//   useEffect(() => {
//     return () => {
//       Object.values(debounceTimers).forEach(timer => {
//         clearTimeout(timer)
//       })
//     }
//   }, [debounceTimers])

//   return (
//     <>
//       {/* <Navbar /> */}
//       <div className="register-container">
//         {/* Animated background elements */}
//         <div className="register-bg-elements">
//           <div className="floating-shape shape-1"></div>
//           <div className="floating-shape shape-2"></div>
//           <div className="floating-shape shape-3"></div>
//           <div className="floating-shape shape-4"></div>
//           <div className="floating-shape shape-5"></div>
//         </div>

//         {/* Background overlay */}
//         <div className="register-overlay"></div>

//         {/* Main registration card */}
//         <div className="register-card">
//           {/* Header */}
//           <div className="register-header">
//             <div className="register-icon">
//               <FaGamepad />
//             </div>
//             <h2 className="register-title">Join the Game Zone</h2>
//             <p className="register-subtitle">Create your account and start your gaming adventure</p>
//           </div>

//           {/* Auth Toggle */}
//           <div className="auth-toggle">
//             <Link to="/register" className="auth-toggle-btn active">
//               <span>REGISTER</span>
//             </Link>
//             <Link to="/login" className="auth-toggle-btn">
//               <span>LOGIN</span>
//             </Link>
//           </div>

//           {/* Registration Form */}
//           <form onSubmit={handleSubmit} className="register-form" noValidate>
//             {/* Username */}
//             <div className="form-group">
//               <div className={`input-wrapper ${touched.username && errors.username ? 'error' : ''}`}>
//                 <FaUser className="input-icon" />
//                 <input
//                   type="text"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className="form-input"
//                   required
//                   placeholder="Username"
//                   ref={usernameRef}
//                   aria-invalid={touched.username && errors.username ? "true" : "false"}
//                   aria-describedby="username-error"
//                 />
//                 {isCheckingUsername && <div className="input-loading-indicator"></div>}
//                 {touched.username && !errors.username && !isCheckingUsername && (
//                   <FaCheckCircle className="input-valid-icon" />
//                 )}
//               </div>
//               {touched.username && errors.username && (
//                 <div className="input-error" id="username-error">
//                   <FaExclamationCircle /> {errors.username}
//                 </div>
//               )}
//             </div>

//             {/* Email */}
//             <div className="form-group">
//               <div className={`input-wrapper ${touched.email && errors.email ? 'error' : ''}`}>
//                 <FaEnvelope className="input-icon" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className="form-input"
//                   required
//                   disabled={isOtpSent || isOtpVerified}
//                   placeholder="Email Address"
//                   ref={emailRef}
//                   aria-invalid={touched.email && errors.email ? "true" : "false"}
//                   aria-describedby="email-error"
//                 />
//                 {isCheckingEmail && <div className="input-loading-indicator"></div>}
//                 {isOtpVerified && <FaCheckCircle className="verified-icon" />}
//               </div>
//               {touched.email && errors.email && (
//                 <div className="input-error" id="email-error">
//                   <FaExclamationCircle /> {errors.email}
//                 </div>
//               )}

//               {/* Email verification status */}
//               {isOtpVerified && (
//                 <div className="verification-status verified">
//                   <FaCheckCircle />
//                   <span>Email verified successfully!</span>
//                 </div>
//               )}

//               {/* Send OTP Button */}
//               {!isOtpSent && !isOtpVerified && formData.email && !errors.email && (
//                 <button 
//                   type="button" 
//                   className="otp-btn" 
//                   onClick={sendOtp} 
//                   disabled={otpLoading || isCheckingEmail}
//                 >
//                   {otpLoading ? (
//                     <div className="loading-spinner">
//                       <div className="spinner-small"></div>
//                       <span>Sending...</span>
//                     </div>
//                   ) : (
//                     <>
//                       <FaShieldAlt />
//                       <span>Send Verification Code</span>
//                     </>
//                   )}
//                 </button>
//               )}
              
//               {/* Resend OTP Button */}
//               {isOtpSent && otpResendTimer === 0 && (
//                 <button 
//                   type="button" 
//                   className="otp-btn resend-btn" 
//                   onClick={sendOtp} 
//                   disabled={otpLoading}
//                 >
//                   {otpLoading ? (
//                     <div className="loading-spinner">
//                       <div className="spinner-small"></div>
//                       <span>Sending...</span>
//                     </div>
//                   ) : (
//                     <>
//                       <FaShieldAlt />
//                       <span>Resend Code</span>
//                     </>
//                   )}
//                 </button>
//               )}
              
//               {/* OTP Resend Timer */}
//               {isOtpSent && otpResendTimer > 0 && (
//                 <div className="otp-timer">
//                   <FaClock />
//                   <span>Resend available in {otpResendTimer} seconds</span>
//                 </div>
//               )}
//             </div>

//             {/* OTP Verification */}
//             {isOtpSent && !isOtpVerified && (
//               <div className="form-group otp-group">
//                 <div className="input-wrapper">
//                   <FaClock className="input-icon" />
//                   <input
//                     type="text"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     className="form-input"
//                     required
//                     placeholder="Enter 6-digit OTP"
//                     maxLength="6"
//                     pattern="[0-9]{6}"
//                     inputMode="numeric"
//                   />
//                 </div>
//                 <button type="button" className="verify-btn" onClick={verifyOtp} disabled={otpLoading || otp.length !== 6}>
//                   {otpLoading ? (
//                     <div className="loading-spinner">
//                       <div className="spinner-small"></div>
//                       <span>Verifying...</span>
//                     </div>
//                   ) : (
//                     <>
//                       <FaCheckCircle />
//                       <span>Verify Email</span>
//                     </>
//                   )}
//                 </button>
//                 <p className="otp-info">
//                   <FaInfoCircle /> Please check your email and enter the verification code
//                 </p>
//                 {otpAttempts > 0 && (
//                   <p className="otp-attempts">
//                     <FaExclamationCircle /> Failed attempts: {otpAttempts}/3
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* Password */}
//             <div className="form-group">
//               <div className={`input-wrapper ${touched.password && errors.password ? 'error' : ''}`}>
//                 <FaLock className="input-icon" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={(e) => {
//                     handleChange(e)
//                     checkPasswordStrength(e.target.value)
//                   }}
//                   onBlur={handleBlur}
//                   className="form-input"
//                   required
//                   placeholder="Password"
//                   ref={passwordRef}
//                   aria-invalid={touched.password && errors.password ? "true" : "false"}
//                   aria-describedby="password-error"
//                 />
//                 <button 
//                   type="button" 
//                   className="password-toggle" 
//                   onClick={() => setShowPassword(!showPassword)}
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//               {touched.password && errors.password && (
//                 <div className="input-error" id="password-error">
//                   <FaExclamationCircle /> {errors.password}
//                 </div>
//               )}

//               {/* Password Strength */}
//               {formData.password && (
//                 <div className="password-strength">
//                   <div className="strength-header">
//                     <span className="strength-text" style={{ color: strengthColor }}>
//                       Password Strength: {passwordStrength}
//                     </span>
//                   </div>
//                   <div className="strength-bar">
//                     <div
//                       className="strength-fill"
//                       style={{
//                         width: `${strengthPercentage}%`,
//                         backgroundColor: strengthColor,
//                       }}
//                     ></div>
//                   </div>
//                   <div className="strength-requirements">
//                     <div className={formData.password.length >= 8 ? "requirement met" : "requirement"}>
//                       At least 8 characters
//                     </div>
//                     <div className={/[A-Z]/.test(formData.password) ? "requirement met" : "requirement"}>
//                       One uppercase letter
//                     </div>
//                     <div className={/[0-9]/.test(formData.password) ? "requirement met" : "requirement"}>
//                       One number
//                     </div>
//                     <div className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? "requirement met" : "requirement"}>
//                       One special character
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Phone */}
//             <div className="form-group">
//               <div className={`input-wrapper ${touched.phone && errors.phone ? 'error' : ''}`}>
//                 <FaPhone className="input-icon" />
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className="form-input"
//                   required
//                   placeholder="Phone Number"
//                   ref={phoneRef}
//                   pattern="[0-9]{10}"
//                   inputMode="tel"
//                   aria-invalid={touched.phone && errors.phone ? "true" : "false"}
//                   aria-describedby="phone-error"
//                 />
//                 {touched.phone && !errors.phone && (
//                   <FaCheckCircle className="input-valid-icon" />
//                 )}
//               </div>
//               {touched.phone && errors.phone && (
//                 <div className="input-error" id="phone-error">
//                   <FaExclamationCircle /> {errors.phone}
//                 </div>
//               )}
//             </div>

//             {/* Bio */}
//             <div className="form-group">
//               <div className="input-wrapper">
//                 <FaEdit className="input-icon textarea-icon" />
//                 <textarea
//                   name="bio"
//                   value={formData.bio}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className="form-input form-textarea"
//                   placeholder="Tell us about yourself (optional)"
//                   rows="3"
//                   maxLength="200"
//                 ></textarea>
//               </div>
//               {formData.bio && (
//                 <div className="char-counter">
//                   <span>{formData.bio.length}/200</span>
//                 </div>
//               )}
//             </div>

//             {/* reCAPTCHA */}
//             <ReCAPTCHA 
//               sitekey={SITE_KEY} 
//               size="invisible" 
//               ref={recaptchaRef} 
//               badge="center" 
//             />

//             {/* Form Status */}
//             <div className="form-status">
//               {isOtpVerified ? (
//                 <div className="status-item complete">
//                   <FaCheckCircle /> Email verified
//                 </div>
//               ) : (
//                 <div className="status-item pending">
//                   <FaExclamationCircle /> Email verification required
//                 </div>
//               )}
              
//               {Object.keys(errors).length > 0 && (
//                 <div className="status-item error">
//                   <FaExclamationCircle /> Please fix the errors above
//                 </div>
//               )}
//             </div>

//             {/* Register Button */}
//             <button 
//               type="submit" 
//               className={`register-btn ${isFormValid && isOtpVerified ? 'enabled' : 'disabled'}`} 
//               disabled={!isFormValid || !isOtpVerified || isLoading}
//             >
//               {isLoading ? (
//                 <div className="loading-spinner">
//                   <div className="spinner"></div>
//                   <span>Creating Account...</span>
//                 </div>
//               ) : (
//                 <span>Create Account</span>
//               )}
//             </button>

//             <div className="login-link">
//               <span>Already have an account? </span>
//               <Link to="/login">Sign In</Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   )
// }

// export default Registration




"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { useNavigate, Link } from "react-router-dom"
import "../css/SignupPage.css"
import { getUserRole, isAuthenticated } from "../auth/JwtUtils"
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaGamepad,
  FaShieldAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaInfoCircle,
  FaRedo, // Changed from FaRefresh to FaRedo
} from "react-icons/fa"

const API_BASE_URL = "https://localhost:7186/api"

// Validation patterns
const PATTERNS = {
  username: /^[a-zA-Z0-9_]{4,20}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[0-9]{10}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
}

// Error messages
const ERROR_MESSAGES = {
  username: {
    required: "Username is required",
    pattern: "Username must be 4-20 characters and can only contain letters, numbers, and underscores",
    taken: "This username is already taken",
  },
  email: {
    required: "Email is required",
    pattern: "Please enter a valid email address",
    taken: "This email is already registered",
  },
  password: {
    required: "Password is required",
    pattern: "Password must meet all the requirements below",
  },
  phone: {
    required: "Phone number is required",
    pattern: "Please enter a valid 10-digit phone number",
  },
  captcha: {
    required: "Please enter the CAPTCHA code",
    invalid: "Invalid CAPTCHA code",
  },
}

const Registration = () => {
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
    captcha: "",
  })

  // Validation state
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isFormValid, setIsFormValid] = useState(false)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [debounceTimers, setDebounceTimers] = useState({})

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState("")
  const [strengthPercentage, setStrengthPercentage] = useState(0)
  const [strengthColor, setStrengthColor] = useState("#ef4444")

  // OTP state
  const [otp, setOtp] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [otpResendTimer, setOtpResendTimer] = useState(0)
  const [otpAttempts, setOtpAttempts] = useState(0)

  // CAPTCHA state
  const [captchaKey, setCaptchaKey] = useState(Date.now())
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false)
  const [captchaLoading, setCaptchaLoading] = useState(false)

  const navigate = useNavigate()
  const usernameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const phoneRef = useRef(null)
  const captchaRef = useRef(null)

  // Debounce function for API calls
  const debounce = (func, delay, field) => {
    return (...args) => {
      if (debounceTimers[field]) {
        clearTimeout(debounceTimers[field])
      }

      const newTimer = setTimeout(() => {
        func(...args)
      }, delay)

      setDebounceTimers((prev) => ({
        ...prev,
        [field]: newTimer,
      }))
    }
  }

  // Check if username is available
  const checkUsernameAvailability = async (username) => {
    if (!username || !PATTERNS.username.test(username)) return

    setIsCheckingUsername(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/Tblusers/check-username/${username}`)
      if (response.data.isAvailable === false) {
        setErrors((prev) => ({ ...prev, username: ERROR_MESSAGES.username.taken }))
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev }
          if (newErrors.username === ERROR_MESSAGES.username.taken) {
            delete newErrors.username
          }
          return newErrors
        })
      }
    } catch (error) {
      console.error("Error checking username:", error)
    } finally {
      setIsCheckingUsername(false)
    }
  }

  // Check if email is available
  const checkEmailAvailability = async (email) => {
    if (!email || !PATTERNS.email.test(email)) return

    setIsCheckingEmail(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/Tblusers/check-email/${email}`)
      if (response.data.isAvailable === false) {
        setErrors((prev) => ({ ...prev, email: ERROR_MESSAGES.email.taken }))
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev }
          if (newErrors.email === ERROR_MESSAGES.email.taken) {
            delete newErrors.email
          }
          return newErrors
        })
      }
    } catch (error) {
      console.error("Error checking email:", error)
    } finally {
      setIsCheckingEmail(false)
    }
  }

  // Debounced versions of availability checks
  const debouncedCheckUsername = debounce(checkUsernameAvailability, 500, "username")
  const debouncedCheckEmail = debounce(checkEmailAvailability, 500, "email")

  // Validate a single field
  const validateField = (name, value) => {
    if (!value) {
      return ERROR_MESSAGES[name]?.required || null
    }

    if (PATTERNS[name] && !PATTERNS[name].test(value)) {
      return ERROR_MESSAGES[name]?.pattern || null
    }

    return null
  }

  // Validate all fields
  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    Object.keys(formData).forEach((field) => {
      if (field === "bio") return // Bio is optional
      if (field === "captcha") return // CAPTCHA is handled separately

      const error = validateField(field, formData[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    // Additional validation for email verification and CAPTCHA
    if (!isOtpVerified && formData.email) {
      isValid = false
    }

    if (!isCaptchaVerified) {
      isValid = false
    }

    setErrors(newErrors)
    setIsFormValid(isValid)
    return isValid
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Mark field as touched
    if (!touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: true }))
    }

    // Validate field
    const error = validateField(name, value)
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))

    // Check username/email availability
    if (name === "username" && value && PATTERNS.username.test(value)) {
      debouncedCheckUsername(value)
    }

    if (name === "email" && value && PATTERNS.email.test(value)) {
      debouncedCheckEmail(value)
    }

    // Check password strength
    if (name === "password") {
      checkPasswordStrength(value)
    }

    // Reset CAPTCHA verification if CAPTCHA input changes
    if (name === "captcha") {
      setIsCaptchaVerified(false)
    }
  }

  // Handle input blur
  const handleBlur = (e) => {
    const { name, value } = e.target

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }))

    // Validate field
    const error = validateField(name, value)
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  // Check password strength
  const checkPasswordStrength = (password) => {
    let strength = "Weak"
    let percentage = 25
    let color = "#ef4444"

    const lengthCheck = password.length >= 8
    const numberCheck = /[0-9]/.test(password)
    const symbolCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const upperCheck = /[A-Z]/.test(password)
    const lowerCheck = /[a-z]/.test(password)

    if (lengthCheck && numberCheck && symbolCheck && upperCheck && lowerCheck) {
      strength = "Very Strong"
      percentage = 100
      color = "#10b981"
    } else if (lengthCheck && numberCheck && symbolCheck) {
      strength = "Strong"
      percentage = 80
      color = "#22c55e"
    } else if (lengthCheck && (numberCheck || symbolCheck)) {
      strength = "Good"
      percentage = 60
      color = "#f59e0b"
    } else if (password.length >= 6) {
      strength = "Fair"
      percentage = 40
      color = "#f97316"
    }

    setPasswordStrength(strength)
    setStrengthPercentage(percentage)
    setStrengthColor(color)
  }

  // Refresh CAPTCHA
  const refreshCaptcha = () => {
    setCaptchaKey(Date.now())
    setFormData((prev) => ({ ...prev, captcha: "" }))
    setIsCaptchaVerified(false)
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors.captcha
      return newErrors
    })
  }

  // Verify CAPTCHA
  const verifyCaptcha = async () => {
    if (!formData.captcha) {
      setErrors((prev) => ({ ...prev, captcha: ERROR_MESSAGES.captcha.required }))
      return
    }

    setCaptchaLoading(true)
    try {
      const response = await axios.post(
        `${API_BASE_URL}/Tblusers/verify-captcha`,
        {
          Captcha: formData.captcha, // Changed from 'captcha' to 'CaptchaToken'
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (response.data.success) {
        setIsCaptchaVerified(true)
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.captcha
          return newErrors
        })
        Swal.fire({
          icon: "success",
          title: "CAPTCHA Verified!",
          text: response.data.message,
          background: "rgba(15, 15, 20, 0.95)",
          color: "#fff",
          confirmButtonColor: "#f9c349",
          timer: 2000,
          showConfirmButton: false,
        })
      } else {
        setErrors((prev) => ({ ...prev, captcha: response.data.message }))
        refreshCaptcha()
      }
    } catch (error) {
      console.error("CAPTCHA verification error:", error)
      setErrors((prev) => ({ ...prev, captcha: "CAPTCHA verification failed. Please try again." }))
      refreshCaptcha()
    } finally {
      setCaptchaLoading(false)
    }
  }

  // Send OTP
  const sendOtp = async () => {
    if (!formData.email) {
      Swal.fire({
        icon: "error",
        title: "Email Required",
        text: "Please enter an email to receive OTP!",
        background: "rgba(15, 15, 20, 0.95)",
        color: "#fff",
        confirmButtonColor: "#f9c349",
      })
      return
    }

    if (errors.email) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address!",
        background: "rgba(15, 15, 20, 0.95)",
        color: "#fff",
        confirmButtonColor: "#f9c349",
      })
      return
    }

    setOtpLoading(true)
    try {
      const response = await axios.post(
        `${API_BASE_URL}/Tblusers/send-otp`,
        {
          email: formData.email,
        },
        { withCredentials: true },
      )

      if (response.data.success) {
        setIsOtpSent(true)
        localStorage.setItem("otpEmail", formData.email)

        // Start resend timer
        setOtpResendTimer(60)

        Swal.fire({
          icon: "success",
          title: "OTP Sent!",
          text: response.data.message,
          background: "rgba(15, 15, 20, 0.95)",
          color: "#fff",
          confirmButtonColor: "#f9c349",
        })
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: response.data.message,
          background: "rgba(15, 15, 20, 0.95)",
          color: "#fff",
          confirmButtonColor: "#f9c349",
        })
      }
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send OTP!",
        background: "rgba(15, 15, 20, 0.95)",
        color: "#fff",
        confirmButtonColor: "#f9c349",
      })
    } finally {
      setOtpLoading(false)
    }
  }

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      Swal.fire({
        icon: "error",
        title: "OTP Required",
        text: "Please enter the OTP!",
        background: "rgba(15, 15, 20, 0.95)",
        color: "#fff",
        confirmButtonColor: "#f9c349",
      })
      return
    }

    const storedEmail = localStorage.getItem("otpEmail")
    const trimmedOtp = otp.trim()
    setOtpLoading(true)

    try {
      const response = await axios.post(
        `${API_BASE_URL}/Tblusers/verify-otp`,
        {
          email: storedEmail.trim(),
          otp: trimmedOtp,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (response.data.success) {
        setIsOtpVerified(true)
        setIsOtpSent(false)
        Swal.fire({
          icon: "success",
          title: "Email Verified!",
          text: response.data.message,
          background: "rgba(15, 15, 20, 0.95)",
          color: "#fff",
          confirmButtonColor: "#f9c349",
        })
        localStorage.removeItem("otpEmail")
        setFormData((prev) => ({ ...prev, email: storedEmail }))

        // Validate form after email verification
        validateForm()
      } else {
        setOtpAttempts((prev) => prev + 1)

        Swal.fire({
          icon: "error",
          title: "Invalid OTP",
          text: response.data.message,
          background: "rgba(15, 15, 20, 0.95)",
          color: "#fff",
          confirmButtonColor: "#f9c349",
        })

        // If too many failed attempts, reset OTP process
        if (otpAttempts >= 2) {
          setIsOtpSent(false)
          setOtp("")
          setOtpAttempts(0)
          localStorage.removeItem("otpEmail")

          Swal.fire({
            icon: "warning",
            title: "Too Many Attempts",
            text: "Please request a new OTP",
            background: "rgba(15, 15, 20, 0.95)",
            color: "#fff",
            confirmButtonColor: "#f9c349",
          })
        }
      }
    } catch (error) {
      console.error("OTP verification error:", error.response?.data || error.message)
      setOtpAttempts((prev) => prev + 1)

      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: error.response?.data?.message || "Invalid or expired OTP!",
        background: "rgba(15, 15, 20, 0.95)",
        color: "#fff",
        confirmButtonColor: "#f9c349",
      })
    } finally {
      setOtpLoading(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Final validation
    if (!validateForm()) {
      // Show error for first invalid field
      const firstErrorField = Object.keys(errors).find((key) => errors[key])
      if (firstErrorField) {
        const fieldRef = {
          username: usernameRef,
          email: emailRef,
          password: passwordRef,
          phone: phoneRef,
          captcha: captchaRef,
        }[firstErrorField]

        if (fieldRef && fieldRef.current) {
          fieldRef.current.focus()
        }

        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: errors[firstErrorField],
          background: "rgba(15, 15, 20, 0.95)",
          color: "#fff",
          confirmButtonColor: "#f9c349",
        })
        return
      }
    }

    // Check if email is verified
    if (!isOtpVerified) {
      Swal.fire({
        icon: "warning",
        title: "Email Verification Required",
        text: "Please verify your email with OTP before registering!",
        background: "rgba(15, 15, 20, 0.95)",
        color: "#fff",
        confirmButtonColor: "#f9c349",
      })
      return
    }

    // Check if CAPTCHA is verified
    if (!isCaptchaVerified) {
      Swal.fire({
        icon: "warning",
        title: "CAPTCHA Verification Required",
        text: "Please verify the CAPTCHA before registering!",
        background: "rgba(15, 15, 20, 0.95)",
        color: "#fff",
        confirmButtonColor: "#f9c349",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(
        `${API_BASE_URL}/Tblusers/register`,
        {
          userName: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          bio: formData.bio,
          roleId: 3,
          status: "active",
        },
        { withCredentials: true },
      )

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: response.data.message,
          background: "rgba(15, 15, 20, 0.95)",
          color: "#fff",
          confirmButtonColor: "#f9c349",
        }).then(() => {
          navigate("/login")
        })
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: response.data.message,
          background: "rgba(15, 15, 20, 0.95)",
          color: "#fff",
          confirmButtonColor: "#f9c349",
        })
      }
    } catch (error) {
      console.error(error)

      // Handle specific API errors
      const errorMessage = error.response?.data?.message || "Registration failed! Please try again."

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
        background: "rgba(15, 15, 20, 0.95)",
        color: "#fff",
        confirmButtonColor: "#f9c349",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // OTP resend timer
  useEffect(() => {
    let interval
    if (otpResendTimer > 0) {
      interval = setInterval(() => {
        setOtpResendTimer((prev) => prev - 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [otpResendTimer])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      const role = getUserRole()
      switch (role) {
        case "Admin":
          navigate("/Admin/dashboard")
          break
        case "GameZoneOwner":
          navigate("/GameZoneOwner/dashboard")
          break
        case "User":
          navigate("/user/dashboard")
          break
        default:
          navigate("/")
      }
    }
  }, [navigate])

  // Validate form when dependencies change
  useEffect(() => {
    validateForm()
  }, [formData, isOtpVerified, isCaptchaVerified])

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers).forEach((timer) => {
        clearTimeout(timer)
      })
    }
  }, [debounceTimers])

  return (
    <>
      <div className="register-container">
        {/* Animated background elements */}
        <div className="register-bg-elements">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
          <div className="floating-shape shape-5"></div>
        </div>

        {/* Background overlay */}
        <div className="register-overlay"></div>

        {/* Main registration card */}
        <div className="register-card">
          {/* Header */}
          <div className="register-header">
            <div className="register-icon">
              <FaGamepad />
            </div>
            <h2 className="register-title">Join the Game Zone</h2>
            <p className="register-subtitle">Create your account and start your gaming adventure</p>
          </div>

          {/* Auth Toggle */}
          <div className="auth-toggle">
            <Link to="/register" className="auth-toggle-btn active">
              <span>REGISTER</span>
            </Link>
            <Link to="/login" className="auth-toggle-btn">
              <span>LOGIN</span>
            </Link>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="register-form" noValidate>
            {/* Username */}
            <div className="form-group">
              <div className={`input-wrapper ${touched.username && errors.username ? "error" : ""}`}>
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="form-input"
                  required
                  placeholder="Username"
                  ref={usernameRef}
                  aria-invalid={touched.username && errors.username ? "true" : "false"}
                  aria-describedby="username-error"
                />
                {isCheckingUsername && <div className="input-loading-indicator"></div>}
                {touched.username && !errors.username && !isCheckingUsername && (
                  <FaCheckCircle className="input-valid-icon" />
                )}
              </div>
              {touched.username && errors.username && (
                <div className="input-error" id="username-error">
                  <FaExclamationCircle /> {errors.username}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <div className={`input-wrapper ${touched.email && errors.email ? "error" : ""}`}>
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="form-input"
                  required
                  disabled={isOtpSent || isOtpVerified}
                  placeholder="Email Address"
                  ref={emailRef}
                  aria-invalid={touched.email && errors.email ? "true" : "false"}
                  aria-describedby="email-error"
                />
                {isCheckingEmail && <div className="input-loading-indicator"></div>}
                {isOtpVerified && <FaCheckCircle className="verified-icon" />}
              </div>
              {touched.email && errors.email && (
                <div className="input-error" id="email-error">
                  <FaExclamationCircle /> {errors.email}
                </div>
              )}

              {/* Email verification status */}
              {isOtpVerified && (
                <div className="verification-status verified">
                  <FaCheckCircle />
                  <span>Email verified successfully!</span>
                </div>
              )}

              {/* Send OTP Button */}
              {!isOtpSent && !isOtpVerified && formData.email && !errors.email && (
                <button type="button" className="otp-btn" onClick={sendOtp} disabled={otpLoading || isCheckingEmail}>
                  {otpLoading ? (
                    <div className="loading-spinner">
                      <div className="spinner-small"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <>
                      <FaShieldAlt />
                      <span>Send Verification Code</span>
                    </>
                  )}
                </button>
              )}

              {/* Resend OTP Button */}
              {isOtpSent && otpResendTimer === 0 && (
                <button type="button" className="otp-btn resend-btn" onClick={sendOtp} disabled={otpLoading}>
                  {otpLoading ? (
                    <div className="loading-spinner">
                      <div className="spinner-small"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <>
                      <FaShieldAlt />
                      <span>Resend Code</span>
                    </>
                  )}
                </button>
              )}

              {/* OTP Resend Timer */}
              {isOtpSent && otpResendTimer > 0 && (
                <div className="otp-timer">
                  <FaClock />
                  <span>Resend available in {otpResendTimer} seconds</span>
                </div>
              )}
            </div>

            {/* OTP Verification */}
            {isOtpSent && !isOtpVerified && (
              <div className="form-group otp-group">
                <div className="input-wrapper">
                  <FaClock className="input-icon" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="form-input"
                    required
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    pattern="[0-9]{6}"
                    inputMode="numeric"
                  />
                </div>
                <button
                  type="button"
                  className="verify-btn"
                  onClick={verifyOtp}
                  disabled={otpLoading || otp.length !== 6}
                >
                  {otpLoading ? (
                    <div className="loading-spinner">
                      <div className="spinner-small"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <>
                      <FaCheckCircle />
                      <span>Verify Email</span>
                    </>
                  )}
                </button>
                <p className="otp-info">
                  <FaInfoCircle /> Please check your email and enter the verification code
                </p>
                {otpAttempts > 0 && (
                  <p className="otp-attempts">
                    <FaExclamationCircle /> Failed attempts: {otpAttempts}/3
                  </p>
                )}
              </div>
            )}

            {/* Password */}
            <div className="form-group">
              <div className={`input-wrapper ${touched.password && errors.password ? "error" : ""}`}>
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={(e) => {
                    handleChange(e)
                    checkPasswordStrength(e.target.value)
                  }}
                  onBlur={handleBlur}
                  className="form-input"
                  required
                  placeholder="Password"
                  ref={passwordRef}
                  aria-invalid={touched.password && errors.password ? "true" : "false"}
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {touched.password && errors.password && (
                <div className="input-error" id="password-error">
                  <FaExclamationCircle /> {errors.password}
                </div>
              )}

              {/* Password Strength */}
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-header">
                    <span className="strength-text" style={{ color: strengthColor }}>
                      Password Strength: {passwordStrength}
                    </span>
                  </div>
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${strengthPercentage}%`,
                        backgroundColor: strengthColor,
                      }}
                    ></div>
                  </div>
                  <div className="strength-requirements">
                    <div className={formData.password.length >= 8 ? "requirement met" : "requirement"}>
                      At least 8 characters
                    </div>
                    <div className={/[A-Z]/.test(formData.password) ? "requirement met" : "requirement"}>
                      One uppercase letter
                    </div>
                    <div className={/[0-9]/.test(formData.password) ? "requirement met" : "requirement"}>
                      One number
                    </div>
                    <div
                      className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? "requirement met" : "requirement"}
                    >
                      One special character
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="form-group">
              <div className={`input-wrapper ${touched.phone && errors.phone ? "error" : ""}`}>
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="form-input"
                  required
                  placeholder="Phone Number"
                  ref={phoneRef}
                  pattern="[0-9]{10}"
                  inputMode="tel"
                  aria-invalid={touched.phone && errors.phone ? "true" : "false"}
                  aria-describedby="phone-error"
                />
                {touched.phone && !errors.phone && <FaCheckCircle className="input-valid-icon" />}
              </div>
              {touched.phone && errors.phone && (
                <div className="input-error" id="phone-error">
                  <FaExclamationCircle /> {errors.phone}
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="form-group">
              <div className="input-wrapper">
                <FaEdit className="input-icon textarea-icon" />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="form-input form-textarea"
                  placeholder="Tell us about yourself (optional)"
                  rows="3"
                  maxLength="200"
                ></textarea>
              </div>
              {formData.bio && (
                <div className="char-counter">
                  <span>{formData.bio.length}/200</span>
                </div>
              )}
            </div>

            {/* CAPTCHA */}
            <div className="form-group">
              <div className="captcha-group">
                <div className="captcha-image-container">
                  <img
                    src={`${API_BASE_URL}/Tblusers/generate-captcha?${captchaKey}`}
                    alt="CAPTCHA"
                    className="captcha-image"
                  />
                  <button type="button" className="captcha-refresh" onClick={refreshCaptcha} title="Refresh CAPTCHA">
                    <FaRedo />
                  </button>
                </div>
                <div className={`input-wrapper ${touched.captcha && errors.captcha ? "error" : ""}`}>
                  <FaShieldAlt className="input-icon" />
                  <input
                    type="text"
                    name="captcha"
                    value={formData.captcha}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-input"
                    required
                    placeholder="Enter CAPTCHA code"
                    ref={captchaRef}
                    maxLength="6"
                    style={{ textTransform: "uppercase" }}
                    aria-invalid={touched.captcha && errors.captcha ? "true" : "false"}
                    aria-describedby="captcha-error"
                  />
                  {isCaptchaVerified && <FaCheckCircle className="input-valid-icon" />}
                </div>
                {!isCaptchaVerified && formData.captcha && (
                  <button
                    type="button"
                    className="verify-btn captcha-verify-btn"
                    onClick={verifyCaptcha}
                    disabled={captchaLoading || !formData.captcha}
                  >
                    {captchaLoading ? (
                      <div className="loading-spinner">
                        <div className="spinner-small"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <>
                        <FaCheckCircle />
                        <span>Verify CAPTCHA</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              {touched.captcha && errors.captcha && (
                <div className="input-error" id="captcha-error">
                  <FaExclamationCircle /> {errors.captcha}
                </div>
              )}
              {isCaptchaVerified && (
                <div className="verification-status verified">
                  <FaCheckCircle />
                  <span>CAPTCHA verified successfully!</span>
                </div>
              )}
            </div>

            {/* Form Status */}
            <div className="form-status">
              {isOtpVerified ? (
                <div className="status-item complete">
                  <FaCheckCircle /> Email verified
                </div>
              ) : (
                <div className="status-item pending">
                  <FaExclamationCircle /> Email verification required
                </div>
              )}

              {isCaptchaVerified ? (
                <div className="status-item complete">
                  <FaCheckCircle /> CAPTCHA verified
                </div>
              ) : (
                <div className="status-item pending">
                  <FaExclamationCircle /> CAPTCHA verification required
                </div>
              )}

              {Object.keys(errors).length > 0 && (
                <div className="status-item error">
                  <FaExclamationCircle /> Please fix the errors above
                </div>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className={`register-btn ${isFormValid && isOtpVerified && isCaptchaVerified ? "enabled" : "disabled"}`}
              disabled={!isFormValid || !isOtpVerified || !isCaptchaVerified || isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <span>Create Account</span>
              )}
            </button>

            <div className="login-link">
              <span>Already have an account? </span>
              <Link to="/login">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Registration
