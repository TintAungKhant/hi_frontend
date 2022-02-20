import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { postLogout } from "../../api";
import AuthContext from "../../contexts/AuthContext";
import HiLogo from "../../assets/logo.png";

const Nav = ({ path, title, icon_class, required_auth, onClick }) => {
  return (
    <AuthContext.Consumer>
      {({ authInfo }) => {
        if (required_auth) {
          if (authInfo.auth) {
            return (
              <NavLink to={path} onClick={() => {onClick && onClick()}}>
                <i className={icon_class}></i>
                <span className="ml-1">{title}</span>
              </NavLink>
            );
          } else {
            return <></>;
          }
        }
        return (
          <NavLink to={path} onClick={() => {onClick && onClick()}}>
            <i className={icon_class}></i>
            <span className="ml-1">{title}</span>
          </NavLink>
        );
      }}
    </AuthContext.Consumer>
  );
};

function Navbar() {
  const { setAuthInfo } = useContext(AuthContext);

  const [showMobileNav, setShowMobileNav] = useState(false);

  let navigate = useNavigate();

  const logout = () => {
    postLogout().then(() => {
      setAuthInfo({
        auth: false,
        user: {},
      });
      localStorage.removeItem("BEARER_TOKEN");
      navigate("/login", { replace: true });
    });
  };

  return (
    <div className="shadow-lg p-2 fixed top-0 w-full z-40 bg-gray-900">
      <div className="container w-full mx-auto font-sans">
        <div className="flex justify-between items-center nav-bar">
          <div className="w-9">
            <img src={HiLogo} alt="HiChat-Logo" />
          </div>
          <div className="hidden md:flex">
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
              path="profile/me"
              title="Profile"
              icon_class="fas fa-user"
              required_auth={true}
            />
            <AuthContext.Consumer>
              {({ authInfo }) => {
                if (authInfo.auth) {
                  return (
                    <button onClick={logout}>
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Logout</span>
                    </button>
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
          </div>
          <div className="block md:hidden">
            <button
              className="btn btn-indigo"
              onClick={() => setShowMobileNav(true)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
      {showMobileNav && (
        <div className="block md:hidden container w-full mx-auto font-sans nav-bar-mb">
          <div className="flex justify-between items-center">
            <div className="fixed w-screen h-screen top-0 left-0 bg-zinc-900/90 z-50 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="flex flex-col gap-3 my-10 items-center">
                  <Nav
                    path="explore"
                    title="Explore"
                    icon_class="fas fa-compass"
                    required_auth={true}
                    onClick={() => {setShowMobileNav(false)}}
                  />
                  <Nav
                    path="friends"
                    title="Friends"
                    icon_class="fas fa-users"
                    required_auth={true}
                    onClick={() => {setShowMobileNav(false)}}
                  />
                  <Nav
                    path="chat"
                    title="Chat"
                    icon_class="fas fa-comments"
                    required_auth={true}
                    onClick={() => {setShowMobileNav(false)}}
                  />
                  <Nav
                    path="profile/me"
                    title="Profile"
                    icon_class="fas fa-user"
                    required_auth={true}
                    onClick={() => {setShowMobileNav(false)}}
                  />
                  <AuthContext.Consumer>
                    {({ authInfo }) => {
                      if (authInfo.auth) {
                        return (
                          <button onClick={logout}>
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                          </button>
                        );
                      } else {
                        return (
                          <>
                            <Nav
                              path="register"
                              title="Register"
                              icon_class="fas fa-user-plus"
                              required_auth={false}
                              onClick={() => {setShowMobileNav(false)}}
                            />
                            <Nav
                              path="login"
                              title="Login"
                              icon_class="fas fa-sign-in-alt"
                              required_auth={false}
                              onClick={() => {setShowMobileNav(false)}}
                            />
                          </>
                        );
                      }
                    }}
                  </AuthContext.Consumer>
                </div>
                <div>
                  <a
                    href="#"
                    className="nav-link-mb"
                    onClick={() => setShowMobileNav(false)}
                  >
                    <i className="fas fa-times text-3xl"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
