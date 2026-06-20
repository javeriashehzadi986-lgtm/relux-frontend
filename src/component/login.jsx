import React from 'react'
import { useState } from 'react';
import "./login.css";
import { Link } from "react-router-dom";

const Login = () => {
    const [submitted, setsubmitted] = useState(false);
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");

    const [emailerror, setemailerror] = useState("");
    const [passworderror, setpassworderror] = useState("");

    const onsubmitted = (e) => {
        e.preventDefault();
         let valid = true;

        if (!email.includes("@") || !email.includes(".")) {
            setemailerror("Enter a valid email");
          valid = false;
        } else setemailerror("");

        if (password.length < 6) {
            setpassworderror("Password must be at least 6 characters");
           valid = false;
        } else setpassworderror("");

    };
    return (
        <div className="login-container">
            <div className="left-side">
                <div className="overlay-text">
                    <h1>Welcome Back</h1>
                    <p>Rent your favorite dresses and look stunning</p>
                </div>
            </div>
            <div className="right-side">
                {submitted ? (
                    <h2 className="success">Account Created</h2>
                ) : (
                    <form className="card" onSubmit={onsubmitted}>
                        <h2 className="logo">ATELIER</h2>
                        <h2>Login to Relux Hub</h2>
                        <label>EMAIL ADDRESS</label>
                        <input
                            type="text"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => {
                                setemail(e.target.value);
                                setemailerror("");
                            }}
                        />
                        {emailerror && (
                            <span className="error">{emailerror}</span>
                        )}
                        <label>PASSWORD</label>
                        <input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => {
                                setpassword(e.target.value);
                                setpassworderror("");
                            }}
                        />
                        <div className="forgot">Forgot Password?</div>
                        {passworderror && (
                            <span className="error">{passworderror}</span>
                        )}
                        <button type="submit">Login</button>
                        <p className="or">OR</p>
                        <div className="google-btn">
                            Continue with Google
                        </div>
                        <p className="signup-text">
                            Don&apos;t have an account?
                            <Link to="/signup"> Sign Up</Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Login