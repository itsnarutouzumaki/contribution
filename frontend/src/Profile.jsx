import React, { useState, useEffect } from "react";
import axios from "axios";

function RepoBar({ repo }) {
  return (
    <a
      className="w-9/10 border-2 my-1 py-1 border-amber-50 rounded-lg bg-amber-200"
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <p className="text-black">{repo.name}</p>
    </a>
  );
}

function RankBar({ User, status }) {
  return (
    <a
      className={`w-9/10 border-2 my-1 py-1 ${
        status ? "border-green-50 bg-green-200 font-black sticky top-12 bottom-10" : "border-amber-50 bg-amber-200"
      } flex justify-between rounded-lg px-4`}
      href={`https://github.com/${User.assignee}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <p className="text-black">{User.assignee}{status && "(You)"}</p>
      <p className="text-black">{User.marks}</p>
    </a>
  );
}

function Profile({ user }) {
  const [repos, setRepos] = useState([]);
  const [rank, setRank] = useState([]);
  const [last30, setLast30] = useState(false);
  const [issueResponse, setIssueResponse] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/get/marks",
        { username: user.login },
        { withCredentials: true }
      );
      setRepos(response.data.repos);
      setIssueResponse(response.data);
      setRank(response.data.sortedScores);
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching data:", err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (issueResponse) {
      if (last30) {
        setRank(issueResponse.sortedScoresLast30);
      } else {
        setRank(issueResponse.sortedScores);
      }
    }
  }, [last30, issueResponse]);

  return (
    <div className="flex flex-col w-fit h-fit justify-center items-center">
      <h1 className="bg-white text-black text-4xl p-2 rounded-2xl my-2">
        {user.name}'s Dashboard
      </h1>
      <div className="flex w-screen h-screen flex-col items-center lg:flex-row lg:justify-evenly">
        <div className="border-2 border-amber-900 h-fit lg:h-screen text-center w-8/10 lg:w-5/11 rounded-2xl flex flex-col items-center overflow-auto my-2">
          <div className="text-3xl font-black py-2 rounded-t-2xl sticky top-0 bg-black w-full text-white">
            Organization's Public Repositories
          </div>
          {repos.map((repoitem) => (
            <RepoBar key={repoitem.id} repo={repoitem} />
          ))}
        </div>
        <div className="border-2 border-amber-900 h-fit lg:h-screen text-center w-8/10 lg:w-5/11 rounded-2xl flex flex-col items-center overflow-auto my-2">
          <div className="text-3xl font-black py-2 rounded-t-2xl sticky top-0 bg-black w-full text-white">
            {last30 ? "Last 30 Days Ranking" : "All-Time Ranking"}
          </div>
          {rank.map((rankitem) => (
            <RankBar
              key={rankitem.assignee}
              User={rankitem}
              status={user.login === rankitem.assignee}
            />
          ))}
          <button
        onClick={() => setLast30(!last30)}
        className="my-3 bg-red-400 px-4 py-2 sticky bottom-0 cursor-pointer font-black w-fit h-fit rounded-lg"
      >
        {last30 ? "Show All-Time" : "Show Last 30 Days"}
      </button>
        </div>
      </div>
      
    </div>
  );
}

export default Profile;
