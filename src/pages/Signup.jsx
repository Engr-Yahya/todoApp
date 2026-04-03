import { FiUser, FiMail, FiLock } from "react-icons/fi";
import "../App.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import useStore from "./UseStore";

export default function Signup() {
  const {setUserData} = useStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isLoggedIn: false,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit() {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill all the fields");
      return;
    }
    setUserData(formData);

    // const existing = JSON.parse(localStorage.getItem("formData") || "[]");
    // const updated = [...existing, formData];
    // localStorage.setItem("formData", JSON.stringify(updated));
    setFormData({ name: "", email: "", password: "" });
  }

  return (
    <div className="signup-container">
      <div className="background-glow"></div>

      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Join us and start your journey today</p>
        </div>

        <form className="signup-form">
          <div className="input-group">
            <FiUser className="icon" />
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

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

          <button type="button" className="signup-btn" onClick={handleSubmit}>
            Create Account
          </button>

          <p className="footer-text">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
