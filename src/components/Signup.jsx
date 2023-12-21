import { React,useState } from "react";
import Modal from './Modal'
import {useNavigate} from "react-router-dom";
import Loading from "./Loading";
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
        </>
      )}
    </>
  );
}

export default Login;
