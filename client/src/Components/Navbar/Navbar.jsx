
import React, { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "./logo.ico";
import SearchBar from "./SearchBar/SearchBar";
import { RiVideoAddLine } from "react-icons/ri";
import { BiUserCircle } from "react-icons/bi";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { login as loginAction } from "../../actions/auth";
import Auth from "../../Pages/Auth/Auth";
import { getPoints } from "../../actions/Points";
import videocall from "./videocall.jpg";

function Navbar({ toggleDrawer, setEditCreateChanelBtn }) {
  const [AuthBtn, setAuthBtn] = useState(false);
  const CurrentUser = useSelector((state) => state.currentUserReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (CurrentUser?.result?._id) {
      dispatch(getPoints(CurrentUser.result._id));
    }
  }, [dispatch, CurrentUser]);

  const onGoogleSuccess = async (credentialResponse) => {
    try {
      const cred = credentialResponse?.credential;
      if (!cred) {
        alert("Google login failed: missing credential");
        return;
      }
      const decoded = jwtDecode(cred);
      const email = decoded?.email;
      if (!email) {
        alert("Google login did not return an email");
        return;
      }
      await dispatch(loginAction({ email }));
      setAuthBtn(false);
    } catch (e) {
      console.error("[Navbar] Google->Backend login failed:", e);
      alert("Login failed. Please try again.");
    }
  };

  const onGoogleError = () => {
    alert("Google sign-in failed. Please try again.");
  };

  return (
    <>
      <div className="Navbar_Container">
        <div className="Navbar_logo" onClick={() => (window.location.href = "/")}>
          <img src={logo} alt="logo" />
        </div>

        <SearchBar />

        <div className="Navbar_right">
          <RiVideoAddLine className="Navbar_icon" onClick={() => toggleDrawer(true)} />
          <IoMdNotificationsOutline className="Navbar_icon" />

          {CurrentUser ? (
            <div className="Navbar_user" onClick={() => setAuthBtn(true)}>
              <BiUserCircle className="Navbar_icon" />
            </div>
          ) : (
            <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleError} />
          )}
        </div>
      </div>

      {AuthBtn && (
        <Auth
          setEditCreateChanelBtn={setEditCreateChanelBtn}
          setAuthBtn={setAuthBtn}
          User={CurrentUser}
        />
      )}
    </>
  );
}

export default Navbar;
