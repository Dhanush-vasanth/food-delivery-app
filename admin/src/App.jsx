import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import './index.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { toast } from 'react-toastify'


const App = () => {

  const url = "https://food-delivery-app-e4z1.onrender.com";
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || "");
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  useEffect(() => {
    if (adminToken) {
      axios.defaults.headers.common.token = adminToken;
      localStorage.setItem("adminToken", adminToken);
      return;
    }

    delete axios.defaults.headers.common.token;
    localStorage.removeItem("adminToken");
  }, [adminToken]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${url}/api/user/admin/login`, credentials);

      if (response.data.success) {
        setAdminToken(response.data.token);
        setCredentials({ email: "", password: "" });
        toast.success("Admin login successful");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Unable to log in");
    }
  };

  const handleLogout = () => {
    setAdminToken("");
  };

  const loginScreen = (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "linear-gradient(135deg, #0f172a, #1e293b)", padding: "24px" }}>
      <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "420px", background: "rgba(15, 23, 42, 0.92)", color: "#fff", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "32px", boxShadow: "0 24px 80px rgba(0,0,0,0.35)" }}>
        <h2 style={{ fontSize: "28px", marginBottom: "8px" }}>Admin Login</h2>
        <p style={{ opacity: 0.72, marginBottom: "20px" }}>Authenticate to manage foods and orders.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <input
            value={credentials.email}
            onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
            type="email"
            placeholder="Admin email"
            required
            style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", background: "#0b1220", color: "#fff" }}
          />
          <input
            value={credentials.password}
            onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
            type="password"
            placeholder="Password"
            required
            style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", background: "#0b1220", color: "#fff" }}
          />
          <button type="submit" style={{ padding: "14px 16px", border: "none", borderRadius: "12px", background: "#f59e0b", color: "#111827", fontWeight: 700, cursor: "pointer" }}>Sign In</button>
        </div>
      </form>
    </div>
  );

  return (
    <div>
      <ToastContainer />
      {!adminToken ? loginScreen : (
        <>
          <Navbar />
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 18px", background: "#fff" }}>
            <button onClick={handleLogout} style={{ border: "1px solid #d1d5db", background: "#f9fafb", borderRadius: "10px", padding: "10px 14px", cursor: "pointer" }}>Logout</button>
          </div>
          <hr />
          <div className="app-content">
            <Sidebar />
            <Routes>
              <Route path= "/add" element={<Add url={url} />}/>
              <Route path= "/list" element={<List url={url} />}/>
              <Route path= "/orders" element={<Orders url={url} />}/>
            </Routes>
          </div>
        </>
      )}
    </div>
  )
}

export default App