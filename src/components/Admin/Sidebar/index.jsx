import "./style.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";

import mainLogo from "../../../Assets/images/logoMain.png";

export default function Sidebar({ isChecked, setIsChecked }) {
  const user = JSON.parse(Cookies.get("user") || '{"name":"Guest", "role":"user", "image":""}');
  const navlink = useNavigate();

  useEffect(() => {
    const sidebarState = Cookies.get("sidebarState");
    if (sidebarState !== undefined) {
      setIsChecked(JSON.parse(sidebarState));
    }
  }, [setIsChecked]);

  const handleToggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    Cookies.set("sidebarState", JSON.stringify(newState));
  };

  const handleLogout = () => {
    // Object.keys(Cookies.get()).forEach(cookieName => {
    //   Cookies.remove(cookieName);
    // });
    Cookies.remove("AuthToken");
    Cookies.remove("user");
    Cookies.remove("imageLink");
    Cookies.remove("hasReloaded");
    Cookies.remove("loggedMessage");
    navlink("/");
  };

  return (
    <div id="nav-bar">
      <input
        id="nav-toggle"
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
      />
      <div id="nav-header">
        <a id="nav-title" href="https://my-savdo.uz" target="_blank" rel="noopener noreferrer">
          <img src={mainLogo} alt="mainLogo" /> MySavdo
        </a>
        <label htmlFor="nav-toggle">
          <span id="nav-toggle-burger"></span>
        </label>
        <hr />
      </div>
      <div id="nav-content">
        <div className="nav-button" onClick={() => navlink('/AdminPage')}>
          <i className="fas fa-house"></i>
          <span>Home</span>
        </div>
        <div className="nav-button" onClick={() => navlink('/AdminPage/data')}>
          <i className="fas fa-database"></i>
          <span>Data</span>
        </div>
        <div className="nav-button" onClick={() => navlink('/AdminPage/archive')}>
          <i className="fas fa-inbox"></i>
          <span>Archive</span>
        </div>
        <hr />
        <div className="nav-button" onClick={() => navlink('/AdminPage/statistics')}>
          <i className="fas fa-chart-line"></i>
          <span>Statistics</span>
        </div>
        <div className="nav-button" onClick={() => navlink('/AdminPage/checks')}>
          <i className="fas fa-receipt"></i>
          <span>Checks</span>
        </div>
        {user.role === "admin" && (
          <div className="nav-button" onClick={() => navlink('/AdminPage/admins')}>
            <i className="fas fa-user-tie"></i>
            <span>Admins</span>
          </div>
        )}
        <div className="nav-button" onClick={() => navlink('/AdminPage/settings')}>
          <i className="fas fa-sliders"></i>
          <span>Settings</span>
        </div>
        <div id="nav-content-highlight"></div>
      </div>
      <input id="nav-footer-toggle" type="checkbox" />
      <div id="nav-footer">
        <div id="nav-footer-heading">
          <div id="nav-footer-avatar">
            <img src={user.image} alt="User Avatar" />
          </div>
          <div id="nav-footer-titlebox">
            <a id="nav-footer-title" target="_blank" rel="noopener noreferrer">
              {user.name}
            </a>
            <span id="nav-footer-subtitle">{user.role}</span>
          </div>
          <label id="nav-footer-toggle">
            <i
              onClick={handleLogout}
              className="fas fa-right-from-bracket"
            ></i>
          </label>
        </div>
      </div>
    </div>
  );
}
