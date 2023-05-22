import React,{useRef,useState,useEffect} from 'react';
import "../tailwind.css";
import { supabase } from "../supabaseClient";  
import { useNavigate } from "react-router-dom";
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';
import { SupabaseClient } from '@supabase/supabase-js';




//functionality using backend api and local storage
// const handlesubmit = (e) => {
//   let users = [];
//   e.preventDefault();
//   const getUsers = async (request, response) => {
//     try {
//         const response = await fetch("http://localhost:3005/api/users");
//         const jsonData = await response.json();
//         localStorage.setItem("users", JSON.stringify(jsonData));
//         users = localStorage.getItem("users");
//        // console.log("data fetched",JSON.parse(users)); 
//     } catch (err) {
//       console.error(err.message);
//     }
//   };
//   getUsers();
//   let currentUser = checkUsers( e.target.email.value, e.target.password.value);
//   if (currentUser) {
//     localStorage.setItem("user", JSON.stringify(currentUser));
//     window.location.href = "http://localhost:3000/login";
//   } else {
//     alert("Wrong email or password");
//   }
// };
// const checkUsers = function ( email, password) {
//   let users = JSON.parse(localStorage.getItem("users"));
//   console.log("users", users);
//   let user = users.find((user) => user.email === email && user.password === password);
//   if (user) {
//     console.log("user found", user);
//     return user;
//   }
//   console.log("user not found");
//   return false;
// };

const App=({setToken})=> {
  let Navigate = useNavigate();
  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });
  //console.log("formdata", formdata);
  function handleChange(event) {
    setformdata({
      ...formdata,
      [event.target.name]: event.target.value,
    });
    
  }
  
  const handlesubmit = async (e) => { 
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
  email: formdata.email,
  password: formdata.password,
})
  if (error) {
    alert(error.message)
  }
  else {
    console.log("data", data);
    setToken(data);
    Navigate("/homepage")
  }
}

  return (
<div class="bg-white">
  <div class="flex min-h-screen">

    <div class="flex flex-row w-full">

      <div class='hidden lg:flex flex-col justify-between bg-[#ffe85c] lg:p-8 xl:p-12 lg:max-w-sm xl:max-w-lg'>
        <div class="flex items-center justify-start space-x-3">
          <span class="bg-black rounded-full w-8 h-8"></span>
          <a href="#" class="font-medium text-xl">Brand</a>
        </div>
        <div class='space-y-5'>
          <h1 class="lg:text-3xl xl:text-5xl xl:leading-snug font-extrabold font-ink">M6L Books</h1>
        </div>

      </div>

      <div class="flex flex-1 flex-col items-center justify-center px-10 relative">
        <div class="flex lg:hidden justify-between items-center w-full py-4">
          <div class="flex items-center justify-start space-x-3">
            <span class="bg-black rounded-full w-6 h-6"></span>
            <a href="#" class="font-medium text-lg">Brand</a>
          </div>
          <div class="flex items-center space-x-2">
          </div>
        </div>
        <div class="flex flex-1 flex-col  justify-center space-y-5 max-w-md">
          <div class="flex flex-col space-y-2 text-center">
            <h2 class="text-3xl md:text-4xl font-bold">Login</h2>
            <p class="text-md md:text-xl">Log in with your AUI ID & password!</p>
          </div>
          <div class="flex flex-col max-w-md space-y-5">
            <form class="flex flex-col space-y-1" action="#" method="post" onSubmit={handlesubmit}>
            <input type="email" name="email" placeholder="L.Fname@AUI.ma"
              class="flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal" onChange={handleChange}/>
            <input type="password" name="password" placeholder="Password"
              class="flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal" onChange={handleChange} />
            <button type="submit" class="flex items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium border-black bg-black text-white">Confirm
              with email</button>
              </form>
            <div class="flex justify-center items-center">
              <span class="w-full border border-black"></span>
              <span class="w-full border border-black"></span>
            </div>
          </div>
        </div>

      </div>
    </div>
    </div>

  </div>
  );
}

export default App;