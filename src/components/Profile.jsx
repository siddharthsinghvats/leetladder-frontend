import Loading from "./Loading";
import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";
import { FaDiscord } from "react-icons/fa";
import { useNavigate } from "react-router";
const user = JSON.parse(localStorage.getItem("user"));
const BACKEND = process.env.REACT_APP_BACKEND;

const Profile = () => {
const navigate = useNavigate();
  const data = [["Element", "Count", { role: "style" }]];
  const piedata = [["Element", "Count", { role: "style" }]];
  const color = {
    "binary trees": "#b40692",
    trie: "#8de57d",
    hashmaps: "#bcc6eb",
    "bitwise operations": "#9e99cd",
    "bitmasking dp": "#b419c1",
    "dynamic programming": "#957474",
    counting: "#934d4e",
    recursion: "#fe0c3b",
    stack: "#8b0c98",
    rerooting: "#ecfd52",
    sorting: "#a384a3",
    "disjoint set union": "#a70bc6",
    "shortest paths": "#86f690",
    "binary search": "#c83280",
    "digit dp": "#ac66d9",
    "suffix and prefix array": "#dc4c5a",
    "trees and graphs": "#b7dec3",
    "sliding window": "#d403c3",
    "linked lists": "#9db125",
    "line sweep": "#ce3028",
    string: "#ade61d",
  };
  const options = {
    width: "100%",
    height: "100vh",
    backgroundColor: "#222222", // Background color
    chartArea: { backgroundColor: "#222222" }, // Chart area background color
    hAxis: {
      textStyle: { color: "#FFFFFF" },
      titleTextStyle: { color: "#FFFFFF" },
    },
    vAxis: {
      format: 0,
      textStyle: { color: "#FFFFFF" },
      titleTextStyle: { color: "#FFFFFF" },
    },
    legend: { textStyle: { color: "#FFFFFF" } },
    titleTextStyle: { color: "#FFFFFF" },
    // ... other options as needed
  };

  const [questionsByType, setQuestionsByType] = useState({});
  const [doneQuestionsByType, setDoneQuestionsByType] = useState({});
  const [currentUser, setCurrentUser] = useState();
  const [allQuestionCount, setAllQuestionCount] = useState(0);
  const [doneQuestionCount, setDoneQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!currentUser) {
      fetch(BACKEND + "/auth/" + user?.username)
        .then((response) => response.json())
        .then((user) => {
          setCurrentUser(user.user);
        });
    }
    let cnt = 0;
    fetch(BACKEND + "/questions")
      .then((response) => response.json())
      .then((questions) => {
        const groupedAllQuestions = questions.reduce((acc, question) => {
          if (!acc[question.type]) {
            acc[question.type] = [];
          }
          acc[question.type].push(question);
          cnt++;
          return acc;
        }, {});
        setAllQuestionCount(cnt);
        cnt = 0;
        if (currentUser) {
          const groupedDoneQuestions = questions.reduce((acc, question) => {
            if (currentUser.doneQuestions.includes(question._id)) {
              if (!acc[question.type]) {
                acc[question.type] = [];
              }
              acc[question.type].push(question);
              cnt++;
            }
            return acc;
          }, {});
          setDoneQuestionCount(cnt);
          setDoneQuestionsByType(groupedDoneQuestions);
        }
        setQuestionsByType(groupedAllQuestions);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [currentUser]);
  doneQuestionsByType &&
    Object.keys(doneQuestionsByType).map((type) => {
      data.push([type, doneQuestionsByType[type].length, color[type]]);
    });
  piedata.push(["solved", doneQuestionCount, "#aaa"]);
  piedata.push(["unsolved", allQuestionCount - doneQuestionCount, "#fff"]);

  return (
    <div className="profile">
      {loading ? (
        <Loading />
      ) : (
        doneQuestionCount !== 0 && (
          <>
            <div className="go-to-main" onClick={() => navigate("/")}>
              Home
            </div>

            <h1>{currentUser?.username}</h1>
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="100%"
              data={data}
              options={options}
            />
            <span className="chart-cnt">
              {doneQuestionCount}/{allQuestionCount}
            </span>
            <Chart
              chartType="PieChart"
              width="100%"
              height="100%"
              data={piedata}
              options={options}
            />
            <div className="footer">
              <span>
                {" "}
                Made by{" "}
                <a href="https://leetcode.com/neembu_mirch/">Neembu_Mirch </a>
              </span>
              <span>
                <FaDiscord /> alchemist#5784
              </span>
            </div>
          </>
        )
      )}
    </div>
  );
};
export default Profile;
