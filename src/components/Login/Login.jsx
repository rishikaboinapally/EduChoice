import {
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
// import meeting2 from "../../assets/meeting2.png";

import googlePlay from "../../assets/google-play.png";
import hide from "../../assets/hide.png";
// import meeting from "../../assets/meeting.png";
import microsoft from "../../assets/microsoft.png";
import show from "../../assets/show.png";
import { auth, googleAuthProvider } from "../../firebase/auth";
import "./Login.css";
import { FaSyncAlt, FaEnvelope, FaKey, FaShieldVirus } from "react-icons/fa";
import validate from "../../common/validation";
import Footer from "../Footer/Footer";
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [error, setError] = useState({});
  const [passwordType, setPasswordType] = useState("password");
  const [captchaVal, setCaptchaVal] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  }); 

  // Function for handling inputs
  const handleLoginInfo = useCallback((e)=>{
    const {name, value} = e.target;
    setLoginInfo((prev)=>{
      return {...prev, [name]: value}
    })
    let errObj = validate[name](value);
    if(name === "password"){
      errObj = validate.loginPassword(value);
    }
    setError((prev)=>{
      return {...prev, ...errObj}
    })
  })

  const passwordToggle = useCallback(() => {
    if (passwordType === "password") {
      setPasswordType("text");
    } else setPasswordType("password");
  });

  const navigate = useNavigate();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        toast.success("Authenticating your credentials… 🚀",{
          className: "toast-message",
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    });
  }, []);

  const generateCaptcha = useCallback(()=>
    {
      let captcha = "";
      const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 6; i++) {
      var randomIndex = Math.floor(Math.random() * charset.length);
      captcha += charset.charAt(randomIndex);
    }
    setCaptchaText(captcha)
    })

    useEffect(()=>{
      generateCaptcha();
    }, [])

  // if signin with EmailId/password success then navigate to /dashboard
  const handleSignIn = useCallback((e) => {
     e.preventDefault();
     let submitable = true;
     if(captchaVal !== captchaText){
      toast.error("Wrong Captcha",{
        className: "toast-message",
      })
      setCaptchaVal("");
      generateCaptcha();
      return;
    }

    Object.values(error).forEach((err)=>{
      if(err !== false){
        submitable = false;
        return;
      }
    })
    if(submitable){
      signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
        .then(() => {
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        })
        .catch((err) => {
          if (err.code === "auth/wrong-password") {
            toast.error("Incorrect Password!",{
              className: "toast-message",
            });
          } else if (err.code === "auth/user-not-found") {
            toast.error("This email is not registered",{
              className: "toast-message",
            });
          } else {
            console.error("Sign-in error", err);
            toast.error("An error occurred. Please try again!",{
              className: "toast-message",
            });
          }
        });
      }else{
        toast.error("Please fill all Fields with Valid Data.",{
          className: "toast-message",
        })
      }
  });
  // Popup Google signin
  const SignInGoogle = useCallback(() => {
    signInWithPopup(auth, googleAuthProvider)
      .then(() => {
        toast.success("Login successful !",{
          className: "toast-message",
        })
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      })
      .catch((err) => toast.error(err.message,{
        className: "toast-message",
      }));
  });

  return (
    <main>
    <div className="login-container">
      
      {/* <div className="parent"> */}
        {/* Home icon */}
        {/* This is the right side of the login page   */}
        <ToastContainer/>
        <div className="right">
          <h1 className="counsellor">EduChoice</h1>
          <div className="sign-in">Log in to your account</div>

          {/* Login form */}
          <form className="form" onSubmit={handleSignIn}>
          <div>
          <label htmlFor="email">Email</label>
          <div className="iconContainer">
          <input
              id="email"
              type="text"
              name="email"
              onChange={handleLoginInfo}
              value={loginInfo.email}
              placeholder="Email"
              required
              className={`${error.emailError && "inputField"}`}
            />
            <FaEnvelope className="icons"/>
          </div>
           
            {error.email && error.emailError && <p className="errorShow">{error.emailError}</p>}

          </div>
             <div>
             <label htmlFor="password">Password</label>
            <div className="password-input">
            <div className="iconContainer">
            <input
                id="password"
                name="password"
                type={passwordType}
                onChange={handleLoginInfo}
                value={loginInfo.password}
                required
                placeholder="Password"
                className={`${error.passwordError && "inputField"}`}
              />
              <FaKey className="icons"/>
              <div onClick={passwordToggle} className="toggle-button">
                <img
                  height={20}
                  width={20}
                  src={passwordType === "password" ? hide : show}
                  alt="password-toggle"
                />
              </div>
              {error.password && error.passwordError && <p className="errorShow">{error.passwordError}</p>}
            </div>       
            </div>
             </div>
            <div id="captcha-container">
              <label htmlFor="captcha">Captcha</label>
              <div
                className="flex flex-row gap-3 justify-center items-center"
                id="captchaBox"
              >
                <div id="captcha">{captchaText}</div>
                <FaSyncAlt
                id="captchaIcon"
                  onClick={generateCaptcha}
                />
                <div className="iconContainer">
                <input
                  type="text"
                  name="captch"
                  value={captchaVal}
                  placeholder="Enter Captcha Here"
                  onChange={(e) => setCaptchaVal(e.target.value)}
                  className="w-[100%] bg-slate-100 py-2 px-4 focus:outline-indigo-500"
                  required
                />
                <FaShieldVirus className="icons"/>
                </div>
               
              </div>
            </div>
            <div className="remember-me">
              <input type="checkbox" id="remember-me" />
              <label htmlFor="remember-me"> Remember me</label>
            </div>
              <button className="login_btn" type="submit">
                Login
              </button>
          </form>
            <div className="btn">
              <Link to="/forgotpassword" className="forgot-password">
                Forgot Your password?
              </Link>
            </div>
            <div className="dont-have-account">
              <Link to="/signup" className="forgot-password">
                Don't have an account?
              </Link>
            </div>
            <div className="get-app">
              {/* <div className="get-app-title">Get the app.</div> */}
              {/* <div className="apps">
                <Link to="/">
                  <img className="microsoft-logo" src={microsoft} alt="" />
                </Link>
                <Link to="/">
                  <img className="google-play-logo" src={googlePlay} alt="" />
                </Link>
              </div> */}
            </div>
        </div>
           {/* This is the left side of the login page   */}
          {/* <div className="left">
           <img src={meeting2} alt="meeting" />
          </div> */}
      {/* </div> */}
    </div>
    <Footer />
    </main>
  );
};
