import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/app";
import Home from "./components/homepage";
import Login from "./components/login";
import Layout from "./components/layout";
import PageNotFound from "./components/pageNotFound";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { supabase } from "./supabaseClient";
import User_view from "./components/user_view";
// import Navbar from "./components/homepage";

const root = ReactDOM.createRoot(document.getElementById("root"));

function AppWrapper() {
  const [token, setToken] = useState(false);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", JSON.stringify(token));
    }
  }, [token, sessionStorage]);



  

  const ProtectedRoute = ({ token, redirectPath = "/" }) => {
    //fix this login tso that if a user has no token he does not have acess to the protected routes
   let flag = false;
    if(token){
      token.session.access_token ? flag = true : flag = false;
    }
    else if(sessionStorage.getItem("token")){
      let token = JSON.parse(sessionStorage.getItem("token"));
      token.session.access_token ? flag = true : flag = false;
      }
    if (flag) {
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
            <Route path="/homepage" element={<Home token={token} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user_view" element={<User_view />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

root.render(<AppWrapper />);





// try to implement this for later o add server side security
// const { createClient } = require('@supabase/supabase-js')
// const supabase = createClient('yurl', 'KEY')

// async function getUser(req, res, next) {
//   try {
//     const token = req.cookies.token // or req.headers.authorization.split(' ')[1]
//     if (!token) return res.status(401).json({ error: 'Unauthorized' })

//     const { user, error } = await supabase.auth.api.getUser(token)
//     if (error) return res.status(401).json({ error: 'Unauthorized' })

//     req.user = user
//     next()
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ error: 'Server error' })
//   }
// }

// // Example usage with Express.js
// app.get('/api/user', getUser, (req, res) => {
//   res.json({ user: req.user })
// })
