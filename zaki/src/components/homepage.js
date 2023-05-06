import React,{useEffect} from "react";
import Navbar from "./navbar";
import LoadingSpinner from "./loading";
import Books from "./books";

const Homepage = ({token}) => {
useEffect(() => {

},);

return(<>
<Navbar token={token}/>
<Books/>
</>)
}
export default Homepage;