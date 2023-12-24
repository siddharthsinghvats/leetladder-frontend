import { React, useState, useEffect } from "react";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { FaLaptopCode } from "react-icons/fa6";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaRegCheckSquare } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { GiBrain } from "react-icons/gi";

import CountUp from "react-countup";

const BACKEND = process.env.REACT_APP_BACKEND;

function Login() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [red, setRed] = useState(1);
  const [quesCount, setQuesCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [allUsers, setAllUsers] = useState();
  const [passwordMessage, setPasswordMessage] = useState("");
  const [usernameMessage, setUsernameMessage] = useState({});
  const [userExists, setUserExists] = useState(false);
  // Password strength checker function
  const checkPasswordStrength = (password) => {
    if (password.length < 6) {
      setRed(1);
      return "Password must be at least 6 characters long.";
    }

    let hasLetter = /[a-zA-Z]/.test(password);
    let hasNumber = /\d/.test(password);
    let hasSpecialCharacter = /[^a-zA-Z\d]/.test(password);

    if (hasLetter && hasNumber && hasSpecialCharacter) {
      setRed(0);
      return "OK - Strong Password";
    }
    setRed(1);
    let missingCriteria = [];

    if (!hasLetter) {
      missingCriteria.push("letters");
    }

    if (!hasNumber) {
      missingCriteria.push("numbers");
    }

    if (!hasSpecialCharacter) {
      missingCriteria.push("special characters");
    }

    return `Password should include ${missingCriteria.join(", ")}.`;
  };
  function checkUsername(username) {
    const result = {
      isValid: true,
      message: "Username is valid.",
    };

    if (username.length < 5 || username.length > 15) {
      result.isValid = false;
      result.message = "Username must be between 5 to 15 characters long.";
      return result;
    }

    if (!/^[A-Za-z]/.test(username)) {
      result.isValid = false;
      result.message = "Username must start with a letter.";
      return result;
    }

    if (!/^[A-Za-z0-9_]+$/.test(username)) {
      result.isValid = false;
      result.message =
        "Username can only contain letters, numbers, and underscores.";
      return result;
    }

    return result;
  }

  const handlePassChange = (e) => {
    setPassword(e.target.value);
    const strength = checkPasswordStrength(e.target.value);
    setPasswordMessage(strength);
  };
  const handleUsernameChange = async (e) => {
    setUsername(e.target.value.trim());
    setUsernameMessage(checkUsername(e.target.value.trim()));
    if (allUsers?.includes(e.target.value.trim())) {
      setUserExists(true);
    } else setUserExists(false);
  };
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await fetch(BACKEND + "/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      console.log(response);
      if (response.status == 409) {
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

  useEffect(() => {
    fetch(BACKEND + "/questions/all_question_count")
      .then((response) => response.json())
      .then((count) => {
        setQuesCount(count.count);
      });
    fetch(BACKEND + "/auth/count/total_user")
      .then((response) => response.json())
      .then((count) => {
        setUserCount(count.userCount);
      });
      fetch(BACKEND + "/auth/all/all_users")
      .then((response) => response.json())
      .then((res) => {
        setAllUsers(res.users);
      });
  }, [quesCount]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {error && <Modal content={error} />}
          <div className="home-auth">
            <div className="home-left">
              <img src="/assets/home.png" alt="" />
              <p className="home-text">
                <h2>
                  <FaLaptopCode style={{ color: "white" }} /> Quality leetcode
                  questions
                </h2>
                <h2>
                  <FaArrowTrendUp style={{ color: "white" }} /> A topic wise
                  list to rate up faster
                </h2>
                <h2>
                  <FaRegCheckSquare style={{ color: "white" }} /> Progress
                  tracker, with check/uncheck feature
                </h2>
                <h2>
                  <SiLeetcode style={{ color: "white" }} /> Suitable for 1800+
                  rated folks
                </h2>
                <h2>
                  <GiBrain style={{ color: "white" }} /> Only medium - hard
                  questions included
                </h2>
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
                    placeholder="Username (Case Sensitive)"
                    onChange={(e) => handleUsernameChange(e)}
                  />
                  <span
                    style={{
                      display: username.length != 0 && !usernameMessage.isValid ? "inline" : "none",
                      fontSize: "1.2rem",
                      color: !usernameMessage.isValid ? "#f74d4d" : "#69f74d",
                    }}
                  >
                    {usernameMessage.message}
                  </span>
                  {usernameMessage.isValid&&<span
                    style={{
                      display: username.length != 0 ? "inline" : "none",
                      fontSize: "1.2rem",
                      color: userExists ? "#f74d4d" : "#69f74d",
                    }}
                  >
                    {userExists
                      ? "Username already exists"
                      : "Username available"}
                  </span>
                }
                  <input
                    type="password"
                    value={password}
                    placeholder="password"
                    onChange={(e) => handlePassChange(e)}
                  />
                  <span
                    style={{
                      color: red === 1 ? "#f74d4d" : "#69f74d",
                      fontSize: "1.2rem",
                    }}
                  >
                    {passwordMessage}
                  </span>
                  <button
                    className="btn"
                    disabled={red === 1 || userExists}
                    onClick={(e) => handleSubmit(e)}
                  >
                    {" "}
                    Sign Up
                  </button>
                </div>
                <div className="bottom-content">
                  Already a user ?{" "}
                  <span onClick={() => navigate("/login")}>Sign In</span>
                </div>
                <div className="home-stat">
                  <h2>
                    {" "}
                    <CountUp
                      style={{ fontSize: "larger", color: "#79fc91" }}
                      end={quesCount}
                    />{" "}
                    total questions{" "}
                  </h2>
                  <h2>
                    <CountUp
                      style={{ fontSize: "larger", color: "#79fc91" }}
                      end={userCount}
                    />{" "}
                    users registered{" "}
                  </h2>
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
