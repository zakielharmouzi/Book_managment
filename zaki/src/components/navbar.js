import React,{useState,useEffect} from 'react';
import ReactDOM from 'react-dom';
import { Link ,useNavigate} from 'react-router-dom';
import { supabase } from "../supabaseClient";
import "../tailwind.css";
import LoadingSpinner from "./loading";

const Navbar = ({token}) => {
    let Navigate = useNavigate();
    const [user_role,setuser_role] = useState(null);
    const [user_email,setUser_email] = useState("");
    const [user_name,setUser_name] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (token) {
          
            setUser_email(token.user.email);
            console.log(token.user.email);
        }else{
           try{
            const token = JSON.parse(sessionStorage.getItem("token"));
            if (token) {
                setUser_email(token.user.email);
                console.log(token.user.email);
            }
           }catch(error){
               console.log(error);
           }
        }
    }, [token]);
    const get_data = async() => {
      setIsLoading(true);
        const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name, role')
        .eq('email', user_email)
        console.log(data);
        setIsLoading(false);
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
            get_data().then((data) => {
                if(data.error){
                    console.log(data.error);
                }else{
                    setuser_role(data.data[0].role);
                    setUser_name(data.data[0].first_name);
                    console.log(data.data[0].role);
                }
              });
        }
    }, [user_email]);
    const logout = async () => {
        sessionStorage.removeItem("token");
        await supabase.auth.signOut();
        token(null);
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
    const toggle = () => {
  const menu = document.getElementById('menu');
  menu.classList.toggle('hidden');
}

    return (
       <>
    {isLoading ? (
      <LoadingSpinner/>
    ) : (
      <nav class="flex items-center justify-between flex-wrap bg-emerald-700 p-6">
        <div class="flex items-center flex-shrink-0 text-white mr-6">
          <img class="fill-current h-9 w-9 mr-2" width="54" height="54" viewBox="0 0 54 54" src="https://cdn.icon-icons.com/icons2/317/PNG/64/book-bookmark-icon_34486.png"/>
          <span class="font-semibold text-xl tracking-tight">M6L Books</span>
        </div>
        <div class="block lg:hidden">
          <button type="button" onClick={toggle} class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
            <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
          </button>
        </div>
        <div id="menu" class="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden">
          <div class="text-sm lg:flex-grow">
            <Link class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4" to="/homepage">Books</Link>
            <Link class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 " to="/user_books">
              Reserved books
            </Link>
            <a href="#responsive-header" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
              Posts
            </a>
            <a href="#responsive-header" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
              Blog
            </a>
            {/* <a href="#responsive-header" class="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">{user_name}</a> */}
          </div>
    <div class="">
      {user_role ? (
            <Link class="block mt-4 mr-10 lg:inline-block lg:mt-0 text-white hover:text-white" to="/admin_view">
                Admin
            </Link>
        
          ): (
            <Link href="#responsive-header" class="block mt-4 mr-5  lg:inline-block lg:mt-0 text-white hover:" to="/user_view">user</Link>
              )}
    </div>
    <div>
        <form onSubmit={logout}>
        <button type="submit" href="#" class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Log out</button>
        </form> 
    </div>
  </div>
</nav>
      )} 
</>
    );
    
    }
export default Navbar;
