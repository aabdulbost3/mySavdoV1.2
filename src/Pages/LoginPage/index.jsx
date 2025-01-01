import "./style.css";

import axios from 'axios';
import React, { useRef, useState } from 'react';
import Cookies from "js-cookie"

import { API_URL } from "../../utils/index.js";
import { useNavigate } from 'react-router-dom';
import LoadingAnimations from "../../components/LoadingComponent/index.jsx";
import logoMain from "../../Assets/images/logoMain.png"
import MessageComponent from "../../components/messageComponent/index.jsx";

export default function LoginPage() {
  const name = useRef()
  const password = useRef()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navlink = useNavigate()

  const login = async (e) => {
    setLoading(true);
    e.preventDefault();

    const body = {
      name: name.current.value,
      password: password.current.value
    }

    try {
      const response = await axios.post(`${API_URL}/login`, body);
      const { token, data } = response.data;

      Cookies.set("AuthToken", token);
      Cookies.set("user", JSON.stringify(data));
      Cookies.set("imageLink", data.imageLink);
      Cookies.remove("hasReloaded");
      Cookies.set("loggedMessage", "true");

      setLoading(false);
      navlink("/AdminPage");
    } catch (err) {
      const errorMessage = err.response
        ? `${err.response.data.status} Error. ${err.response.data.message}`
        : err.message;
      setError(errorMessage);
      setLoading(false);
    }

  }
  return (
    <div className="login-root">
      {error ? <MessageComponent duration={5000} color="var(--red)" message={error} onClose={() => setError(null)} /> : null}
      <div className="box-root flex-flex flex-direction--column" style={{ minHeight: '100vh', flexGrow: 1 }}>
        <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
          <div className="box-root padding-top--48 padding-bottom--24 flex-flex flex-justifyContent--center">
            <h1>
              <img src={logoMain} alt="mainLogo" />
              <a href="/home" rel="dofollow">MySavdo</a>
            </h1>
          </div>
          <div className="formbg-outer">
            <div className="formbg">
              <div className="formbg-inner padding-horizontal--48">
                <span className="padding-bottom--15">Sign in to your account</span>
                <form id="stripe-login" onSubmit={login}>
                  <div className="field padding-bottom--24">
                    <label>Name</label>
                    <input disabled={loading ? true : false} ref={name} type="text" name="name" />
                  </div>
                  <div className="field padding-bottom--24">
                    <div className="grid--50-50">
                      <label htmlFor="password">Password</label>
                    </div>
                    <input disabled={loading ? true : false} ref={password} type="password" name="password" />
                  </div>
                  <div className="reset-pass">
                    <a href="tel:+998910116631">Forgot your password? Contact us.</a>
                  </div>
                  <div className="field">
                    <input disabled={loading ? true : false} type="submit" name="submit" />
                  </div>
                </form>
              </div>
            </div>
            <div className="footer-link padding-top--24">
              <div className="listing flex-flex center-center">
                <span>©MySavdo&Rewerd</span>
                <span><a href="tel:+998910116631">Contact</a></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading ? <LoadingAnimations /> : null}
    </div>
  );
}