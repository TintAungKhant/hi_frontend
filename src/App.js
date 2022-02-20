import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import AuthContext from "./contexts/AuthContext";
import { getProfile } from "./api";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import AppStarts from "./pages/app_starts/AppStarts";
import {
  Login,
  Register,
  Chat,
  Explore,
  Friends,
  MeView,
  MeEdit,
  Profile,
} from "./pages";

const RequiredAuth = ({ children }) => {
  return (
    <React.Suspense fallback={<></>}>
      <AuthContext.Consumer>
        {({ authInfo }) => {
          if (authInfo.auth) {
            return children;
          }
          return <Navigate to="/login" />;
        }}
      </AuthContext.Consumer>
    </React.Suspense>
  );
};

const MustNoAuth = ({ children }) => {
  return (
    <React.Suspense fallback={<></>}>
      <AuthContext.Consumer>
        {({ authInfo }) => {
          if (authInfo.auth) {
            return <Navigate to="/explore" />;
          }
          return children;
        }}
      </AuthContext.Consumer>
    </React.Suspense>
  );
};

function App() {
  const [authInfo, setAuthInfo] = useState({
    auth: false,
    user: {},
  });

  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    await getProfile()
      .then((res) => {
        setAuthInfo({
          auth: true,
          user: res.data.data.profile,
        });
      })
      .catch(() => {
        localStorage.removeItem("BEARER_TOKEN");
        setAuthInfo({
          auth: false,
          user: {},
        });
      });
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return <AppStarts />;
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authInfo, setAuthInfo }}>
        <Navbar />
        <Routes>
          <Route
            path="login"
            element={
              <MustNoAuth>
                <Login />
              </MustNoAuth>
            }
          />
          <Route
            path="register"
            element={
              <MustNoAuth>
                <Register />
              </MustNoAuth>
            }
          />
          <Route path="chat">
            <Route
              path=""
              element={
                <RequiredAuth>
                  <Chat />
                </RequiredAuth>
              }
            />
            <Route
              path="user/:user_id"
              element={
                <RequiredAuth>
                  <Chat />
                </RequiredAuth>
              }
            />
          </Route>
          <Route
            path="explore"
            element={
              <RequiredAuth>
                <Explore />
              </RequiredAuth>
            }
          />
          <Route
            path="friends"
            element={
              <RequiredAuth>
                <Friends />
              </RequiredAuth>
            }
          />
          <Route path="profile">
            <Route
              path=":user_id"
              element={
                <RequiredAuth>
                  <Profile />
                </RequiredAuth>
              }
            />
            <Route path="me">
              <Route
                path=""
                element={
                  <RequiredAuth>
                    <MeView />
                  </RequiredAuth>
                }
              />
              <Route
                path="edit"
                element={
                  <RequiredAuth>
                    <MeEdit />
                  </RequiredAuth>
                }
              />
            </Route>
            <Route
              path=":id"
              element={
                <RequiredAuth>
                  <Profile />
                </RequiredAuth>
              }
            />
          </Route>
          <Route path="/*" element={<Navigate to="/explore" />}></Route>
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
