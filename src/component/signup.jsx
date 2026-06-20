import { useState } from "react";
import { Link } from "react-router-dom";
import "./signup.css";

const Signup = () => {
  const [submitted, setsubmitted] = useState(false);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const [nameerror, setnameerror] = useState("");
  const [emailerror, setemailerror] = useState("");
  const [passworderror, setpassworderror] = useState("");
  const [confirmError, setconfirmError] = useState("");

  const onsubmitted = (e) => {
    e.preventDefault();
    let valid = true;

    if (name.trim() === "") {
      setnameerror("Full name is required");
      valid = false;

    } else setnameerror("");

    if (!email.includes("@") || !email.includes(".")) {
      setemailerror("Enter a valid email");
      valid = false;
    } else setemailerror("");

    if (password.length < 6) {
      setpassworderror("Password must be at least 6 characters");
      valid = false;

    } else setpassworderror("");

    if (confirmPassword !== password) {
      setconfirmError("Passwords do not match");
      valid = false;
    } else setconfirmError("");
    if (valid) {
      setsubmitted(true);
    }
  };

  return (
    <div className="main-container">

      <h2 className="logo">Relux Hub</h2>

      {submitted ? (
        <h2 className="success">Account Created </h2>
      ) : (
        <form className="card" onSubmit={onsubmitted}>
          <h2>Create Your Account</h2>
          <p>Join Relux Hub to rent or resell stylish outfits</p>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => {
              setname(e.target.value);
              setnameerror("");
            }}
          />
          {nameerror && <span className="error">{nameerror}</span>}
          <label>Email Address</label>
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => {
              setemail(e.target.value);
              setemailerror("");
            }}
          />
          {emailerror && <span className="error">{emailerror}</span>}

          <label>Password</label>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => {
              setpassword(e.target.value);
              setpassworderror("");
            }}
          />
          {passworderror && <span className="error">{passworderror}</span>}

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="password"
            value={confirmPassword}
            onChange={(e) => {
              setconfirmPassword(e.target.value);
              setconfirmError("");
            }}
          />
          {confirmError && <span className="error">{confirmError}</span>}
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
          <button type="submit">Sign Up</button>

        </form>
      )}
    </div>
  );
};

export default Signup;