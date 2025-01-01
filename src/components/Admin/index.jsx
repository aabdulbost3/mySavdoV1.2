import "./style.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { WorkPanel } from "./AdminWorkPanel/index.jsx";
import Sidebar from "./Sidebar/index.jsx";
import MessageComponent from "../messageComponent/index.jsx";

export default function AdminPanel() {
  const navigate = useNavigate();
  const rightBar = useRef();
  const [isChecked, setIsChecked] = useState(Cookies.get("sidebarState") === "true");
  const [showMessage, setShowMessage] = useState(Cookies.get("loggedMessage") === "true");

  useEffect(() => {
    const authToken = Cookies.get("AuthToken");
    const hasReloaded = Cookies.get("hasReloaded");

    if (!authToken) {
      navigate("/not-found");
    } else if (!hasReloaded) {
      Cookies.set("hasReloaded", "true");
      window.location.reload();
    }

    const timer = setTimeout(() => {
      Cookies.set("loggedMessage", "false");
      setShowMessage(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    if (rightBar.current) {
      rightBar.current.style.marginLeft = isChecked ? "125px" : "300px";
    }
  }, [isChecked]);

  return (
    <div className="AllAdminPage">
      {showMessage && (
        <MessageComponent
          duration={5000}
          color="var(--green)"
          message="You have successfully registered."
        />
      )}
      <Sidebar isChecked={isChecked} setIsChecked={setIsChecked} />
      <div className="AdminPageRightBar" ref={rightBar}>
        <WorkPanel />
      </div>
    </div>
  );
}