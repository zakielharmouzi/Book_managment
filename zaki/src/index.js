import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/app";
import Home from "./components/home";
import Login from "./components/login";
import Layout from "./components/layout";
import PageNotFound from "./components/pageNotFound";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { supabase } from "./supabaseClient";

const root = ReactDOM.createRoot(document.getElementById("root"));

function AppWrapper() {
  const [token, setToken] = useState(false);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", JSON.stringify(token));
    }
  }, [token, sessionStorage]);

  // this updates the session and stores the token in local storage if the user refreshes the page
  const updatesession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      
    }
  };

  useEffect(() => {
    updatesession();
  }, []);

  const ProtectedRoute = ({ token, redirectPath = "/" }) => {
    if (sessionStorage.getItem("token") || token) {
      return <Outlet />;
    }else{
    return <Navigate to={redirectPath} />;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<App setToken={setToken} />} />
          <Route element={<ProtectedRoute token={token} />}>
            <Route path="/home" element={<Home token={token} />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

root.render(<AppWrapper />);
