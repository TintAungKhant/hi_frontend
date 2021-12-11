import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route
          path="login"
          element={
            <React.Suspense fallback={<></>}>
              <Login />
            </React.Suspense>
          }
        />
        <Route
          path="register"
          element={
            <React.Suspense fallback={<></>}>
              <Register />
            </React.Suspense>
          }
        />
        <Route
          path="chat"
          element={
            <React.Suspense fallback={<></>}>
              <Chat />
            </React.Suspense>
          }
        />
        <Route
          path="explore"
          element={
            <React.Suspense fallback={<></>}>
              <Explore />
            </React.Suspense>
          }
        />
        <Route
          path="friends"
          element={
            <React.Suspense fallback={<></>}>
              <Friends />
            </React.Suspense>
          }
        />
        <Route path="profile">
          <Route path="me">
            <Route
              path="edit"
              element={
                <React.Suspense fallback={<></>}>
                  <MyProfileEdit />
                </React.Suspense>
              }
            />
          </Route>
          <Route
            path=":id"
            element={
              <React.Suspense fallback={<></>}>
                <Profile />
              </React.Suspense>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
