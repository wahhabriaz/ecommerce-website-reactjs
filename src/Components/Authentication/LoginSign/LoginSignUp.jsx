import React, { useState } from "react";
import "./LoginSignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation, useRegisterMutation } from "../../../Features/api/apiSlice";

const LoginSignUp = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("tabButton1");

  // form state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });

  const [error, setError] = useState("");

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();

  const handleTab = (tab) => {
    setError("");
    setActiveTab(tab);
  };

  const saveSession = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const redirectByRole = (user) => {
    if (user?.role === "admin") navigate("/admin/products");
    else navigate("/");
  };

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login({
        email: loginForm.email.trim(),
        password: loginForm.password,
      }).unwrap();

      saveSession(res);
      redirectByRole(res.user);
    } catch (err) {
      setError(err?.data?.message || err?.error || "Login failed");
    }
  };

  const onRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await register({
        name: registerForm.name.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
      }).unwrap();

      saveSession(res);
      redirectByRole(res.user);
    } catch (err) {
      setError(err?.data?.message || err?.error || "Register failed");
    }
  };

  return (
    <div className="loginSignUpSection">
      <div className="loginSignUpContainer">
        <div className="loginSignUpTabs">
          <p
            onClick={() => handleTab("tabButton1")}
            className={activeTab === "tabButton1" ? "active" : ""}
          >
            Login
          </p>
          <p
            onClick={() => handleTab("tabButton2")}
            className={activeTab === "tabButton2" ? "active" : ""}
          >
            Register
          </p>
        </div>

        <div className="loginSignUpTabsContent">
          {error && (
            <div style={{ background: "#ffecec", color: "#b00020", padding: 12, borderRadius: 6, marginBottom: 12 }}>
              {error}
            </div>
          )}

          {/* LOGIN TAB */}
          {activeTab === "tabButton1" && (
            <div className="loginSignUpTabsContentLogin">
              <form onSubmit={onLoginSubmit}>
                <input
                  type="email"
                  placeholder="Email address *"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                />
                <input
                  type="password"
                  placeholder="Password *"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                />

                <div className="loginSignUpForgetPass">
                  <label>
                    <input type="checkbox" className="brandRadio" />
                    <p>Remember me</p>
                  </label>
                  <p>
                    <Link to="/resetPassword">Lost password?</Link>
                  </p>
                </div>

                <button type="submit" disabled={loginLoading}>
                  {loginLoading ? "Logging in..." : "Log In"}
                </button>
              </form>

              <div className="loginSignUpTabsContentLoginText">
                <p>
                  No account yet?{" "}
                  <span onClick={() => handleTab("tabButton2")}>Create Account</span>
                </p>
              </div>
            </div>
          )}

          {/* REGISTER TAB */}
          {activeTab === "tabButton2" && (
            <div className="loginSignUpTabsContentRegister">
              <form onSubmit={onRegisterSubmit}>
                <input
                  type="text"
                  placeholder="Username *"
                  required
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm((p) => ({ ...p, name: e.target.value }))}
                />
                <input
                  type="email"
                  placeholder="Email address *"
                  required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm((p) => ({ ...p, email: e.target.value }))}
                />
                <input
                  type="password"
                  placeholder="Password *"
                  required
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))}
                />

                <p>
                  Your personal data will be used to support your experience throughout this website,
                  to manage access to your account, and for other purposes described in our
                  <Link to="/terms" style={{ textDecoration: "none", color: "#c32929" }}>
                    {" "}
                    privacy policy
                  </Link>
                  .
                </p>

                <button type="submit" disabled={registerLoading}>
                  {registerLoading ? "Creating account..." : "Register"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
