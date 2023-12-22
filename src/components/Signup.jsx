import { React,useState } from "react";
import Modal from './Modal'
import {useNavigate} from "react-router-dom";
import Loading from "./Loading";
import { FaLaptopCode } from "react-icons/fa6";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaRegCheckSquare } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { GiBrain } from "react-icons/gi";
const BACKEND = process.env.REACT_APP_BACKEND
function Login() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await fetch(BACKEND+"/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      console.log(response);
      if(response.status==409){
        setLoading(false);
        setError("Username already exists");
        return;
      }
      if (response.ok) {
        setLoading(false);
        setError(null);
        const user = await response.json();
        console.log("Signup successful");
        localStorage.setItem("user", JSON.stringify(user.user));
        window.location.reload();
      } 
    } catch (error) {
        setLoading(false);
        setError("Server Error");

    }
  };

  return (
    <>
      {loading ? (
        <Loading/>
      ) : (
        <>
        {error&&<Modal content={error}/>}
            <div className="home-auth">
            <div className="home-left">
                <img src="/assets/home.png" alt="" />
                <p className="home-text">
                <h2><FaLaptopCode style={{color:"white"}}/> Quality leetcode questions</h2>
                    <h2><FaArrowTrendUp style={{color:"white"}}/> A topic wise list to rate up faster</h2>
                    <h2><FaRegCheckSquare style={{color:"white"}}/> Progress tracker, with check/uncheck feature</h2>
                    <h2><SiLeetcode style={{color:"white"}}/> Suitable for 1800+ rated folks</h2>
                    <h2><GiBrain style={{color:"white"}}/> Only medium - hard questions included</h2>
                </p>
            </div>
            <div className="home-right">
          <div className="home-container">
            <img src={"/assets/logo.png"} alt="logo" />
            <h2 className="title">LeetLadders</h2>
          </div>
          <div className="form">
            <div className="input">
              <input
                type="text"
                value={username}
                placeholder="A unique username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                value={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="btn" onClick={(e)=>handleSubmit(e)}> Sign Up</button>
            </div>
            <div className="bottom-content">
                Already a user ? <span onClick={()=>navigate('/login')}>Sign In</span>
            </div>
          </div>
          </div>
          </div>
        </>
      )}
    </>
  );
}

export default Login;
