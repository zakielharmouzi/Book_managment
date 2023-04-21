import React,{useState,useEffect} from 'react';
import ReactDOM from 'react-dom';
import { Link ,useNavigate} from 'react-router-dom';
import { supabase } from "../supabaseClient";
import "../tailwind.css";

const Home = ({token}) => {
    let Navigate = useNavigate();
    const [user_role,setuser_role] = useState(null);
    const [user_email,setUser_email] = useState("");
    useEffect(() => {
        if (token) {
            setUser_email(token.user.email);
            console.log(token.user.email);
        }
    }, [token]);
    const get_role = async() => {
        const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('email', user_email)
        console.log(data);
        if(error){
            console.log(error);
            return {
              error,
              data};
        }else{
            return {
              error:null,
              data
            };
        }
    }
    useEffect(() => {
        if (user_email) {
            get_role().then((data) => {
                if(data.error){
                    console.log(data.error);
                }else{
                    setuser_role(data.data[0].role);
                    console.log(data.data[0].role);
                }
            });
        }
    }, [user_email]);

    const logout = async () => {
        sessionStorage.removeItem("token");
        Navigate("/");
    };
    useEffect(() => {
        if (user_role) {
            if(user_role === "ADMIN"){
                setuser_role(true);
            }else if(user_role === "END_USER"){
                setuser_role(false);
            }
        }
    }, [user_role]);
    
    return (
        <nav class="flex items-center justify-between flex-wrap bg-teal-500 p-6">
  <div class="flex items-center flex-shrink-0 text-white mr-6">
    <svg class="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/></svg>
    <span class="font-semibold text-xl tracking-tight">Tailwind CSS</span>
  </div>
  <div class="block lg:hidden">
    <button class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
      <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
    </button>
  </div>
  <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
    <div class="text-sm lg:flex-grow">
      <a href="#responsive-header" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
        Docs
      </a>
      <a href="#responsive-header" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
        Examples
      </a>
      <a href="#responsive-header" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
        Blog
      </a>
      {user_role ? (
            <a href="#responsive-header" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
                Admin
            </a>
        
          ): (
            <a href="#responsive-header" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
              haha no maidens hahaha
            </a>
              )}
    </div>
    <div>
        <form onSubmit={logout}>
        <button type="submit" href="#" class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Log out</button>
        </form> 
    </div>
  </div>
</nav>
    );
    }
export default Home;