import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthContext from "./contexts/AuthContext";
import { getProfile } from "./api";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import {
  Login,
  Register,
  Chat,
  Explore,
  Friends,
  MyProfileEdit,
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
    return <div>Loading...</div>;
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
          <Route
            path="chat"
            element={
              <RequiredAuth>
                <Chat />
              </RequiredAuth>
            }
          />
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
            <Route path="me">
              <Route
                path="edit"
                element={
                  <RequiredAuth>
                    <MyProfileEdit />
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
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
