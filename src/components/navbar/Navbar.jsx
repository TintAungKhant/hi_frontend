import React from "react";
import HiLogo from "../../assets/logo.png";
import "./navbar.css";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <section className="navbar">
      <div className="navbar__logo">
        <img src={HiLogo} alt="Logo" />
      </div>
      <ul className="navbar__navs">
        <li>
          <NavLink to={"explore"}>
            <i className="fas fa-compass"></i>
            <span>Explore</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={"friends"}>
            <i className="fas fa-users"></i>
            <span>Friends</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={"chat"}>
            <i className="fas fa-comments"></i>
            <span>Chat</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={"profile/me/edit"}>
            <i className="fas fa-user"></i>
            <span>Profile</span>
          </NavLink>
        </li>
        <li>
          <a href="javascript:void(0)">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </a>
        </li>
      </ul>
    </section>
  );
}

export default Navbar;
