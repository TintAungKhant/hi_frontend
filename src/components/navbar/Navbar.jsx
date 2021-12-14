import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { postLogout } from "../../api";
import AuthContext from "../../contexts/AuthContext";
import HiLogo from "../../assets/logo.png";
import "./navbar.css";

const Nav = ({ path, title, icon_class, required_auth }) => {
  return (
    <li>
      <AuthContext.Consumer>
        {({ authInfo }) => {
          if (required_auth) {
            if (authInfo.auth) {
              return (
                <NavLink to={path}>
                  <i className={icon_class}></i>
                  <span>{title}</span>
                </NavLink>
              );
            } else {
              return <></>;
            }
          }
          return (
            <NavLink to={path}>
              <i className={icon_class}></i>
              <span>{title}</span>
            </NavLink>
          );
        }}
      </AuthContext.Consumer>
    </li>
  );
};

function Navbar() {
  const { setAuthInfo } = useContext(AuthContext);
  let navigate = useNavigate();

  const logout = () => {
    postLogout().then(() => {
      setAuthInfo({
        auth: false,
        user: {},
      });
      navigate("/login", { replace: true });
    });
  }

  return (
    <section className="navbar">
      <div className="navbar__logo">
        <img src={HiLogo} alt="Logo" />
      </div>
      <ul className="navbar__navs">
        <Nav
          path="explore"
          title="Explore"
          icon_class="fas fa-compass"
          required_auth={true}
        />
        <Nav
          path="friends"
          title="Friends"
          icon_class="fas fa-users"
          required_auth={true}
        />
        <Nav
          path="chat"
          title="Chat"
          icon_class="fas fa-comments"
          required_auth={true}
        />
        <Nav
          path="profile/me/edit"
          title="Profile"
          icon_class="fas fa-user"
          required_auth={true}
        />
        <AuthContext.Consumer>
          {({ authInfo }) => {
            if (authInfo.auth) {
              return (
                <li>
                  <button onClick={logout}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </button>
                </li>
              );
            } else {
              return (
                <>
                  <Nav
                    path="register"
                    title="Register"
                    icon_class="fas fa-user-plus"
                    required_auth={false}
                  />
                  <Nav
                    path="login"
                    title="Login"
                    icon_class="fas fa-sign-in-alt"
                    required_auth={false}
                  />
                </>
              );
            }
          }}
        </AuthContext.Consumer>
      </ul>
    </section>
  );
}

export default Navbar;
