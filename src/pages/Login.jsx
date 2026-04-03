import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { FiMail, FiLock } from "react-icons/fi";
import { useState } from "react";
import useStore from "./UseStore";

export default function Login() {
  const navigate = useNavigate();
  const {userData} = useStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }
  function handleSubmit() {
    // const fetchUser = JSON.parse(localStorage.getItem("formData") || "[]");
    const user = userData.find(
      (user) =>
        user.email === formData.email && user.password === formData.password,
    );
    if (user) {
      const updatedUsers = userData.map((u)=> u.email === formData.email ? {...u, isLoggedIn: true} : u);
      // localStorage.setItem("formData", JSON.stringify(updated));
      useStore.setState({ userData: updatedUsers });
      navigate("/home");
    }else{
      alert("Invalid credentials");
    }
  }
  return (
    <div className="auth-container">
      <div className="background-glow"></div>

      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to continue your journey</p>
        </div>
        <form className="auth-form">
          <div className="input-group">
            <FiMail className="icon" />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <FiLock className="icon" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="auth-options">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <span className="forgot">Forgot Password?</span>
          </div>

          <button type="button" className="auth-btn" onClick={handleSubmit}>
            Login
          </button>

          <p className="footer-text">
            Don’t have an account?{" "}
            <Link className="link" to="/">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
