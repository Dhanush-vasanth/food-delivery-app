import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../assets/frontend_assets/assets'
import { StoreContext } from '../context/StoreContext.jsx'
import axios from 'axios'

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext)

  const [currentState, setCurrentState] = useState("signup")
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const onchangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData(data => ({ ...data, [name]: value }))
  }

  const onLogin = async (event) => {
    event.preventDefault()
    let newUrl = url

    if (currentState === "login") {
      newUrl += "/api/user/login"
    } else {
      newUrl += "/api/user/register"
    }

    const response = await axios.post(newUrl, data)

    if (response.data.success) {
      setToken(response.data.token)
      localStorage.setItem("token", response.data.token)
      setShowLogin(false)
    } else {
      alert(response.data.message)
    }
  }

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState === "signup" ? "Sign Up" : "Login"}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>

        <div className="login-popup-inputs">
          {currentState === "login" ? (
            <></>
          ) : (
            <input
              name='name'
              onChange={onchangeHandler}
              value={data.name}
              type="text"
              placeholder='Your Name'
              required
            />
          )}

          <input
            name='email'
            onChange={onchangeHandler}
            value={data.email}
            type="email"
            placeholder='Your Email'
            required
          />

          <input
            name='password'
            onChange={onchangeHandler}
            value={data.password}
            type="password"
            placeholder='Your Password'
            required
          />
        </div>

        <button type='submit'>
          {currentState === "signup" ? "Create account" : "Login"}
        </button>

        <div className="login-popup-conditions">
          <input type="checkbox" required />
          <p>By continuing, I agree to the Terms of Service and Privacy Policy.</p>
        </div>

        {currentState === "login"
          ? <p>Create a new account? <span onClick={() => setCurrentState("signup")}>Click here</span></p>
          : <p>Already have an account? <span onClick={() => setCurrentState("login")}>Login here</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup