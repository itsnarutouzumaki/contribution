import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";

function RepoBar({ repo }) {
  return (
    <a
      className="w-[90%] hover:w-full border-2 my-1 py-1 rounded-lg bg-blue-200 text-black hover:bg-blue-700 hover:text-white hover:shadow-2xl hover:shadow-neutral-950 duration-250 hover:font-black"
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <p>{repo.name}</p>
    </a>
  );
}

function RankBar({ User, status, rank }) {
  const delta = User.last60 !== undefined ? User.marks * 2 - User.last60 : null;
  const deltaColor =
    delta > 0
      ? "text-green-900 ml-1 font-black"
      : "text-red-900 ml-1 font-black";

  return (
    <a
      className={`w-[90%] hover:w-full border-2 my-1 py-1 bg-blue-200 text-black hover:bg-blue-700 hover:text-white hover:shadow-2xl hover:shadow-red-950 duration-250 hover:font-black ${
        status
          ? "border-green-50 bg-green-200 font-black sticky top-12 hover:bg-green-600"
          : "border-amber-50 bg-amber-200"
      } flex justify-between rounded-lg px-4`}
      href={`https://github.com/${User.assignee}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="text-left">
        {rank}. {User.assignee} {status && "(You)"}
      </div>
      <div className="text-right">
        {User.marks}
        {delta !== null && (
          <span className={deltaColor}>
            {" "}
            ({delta >= 0 ? "+" : "-"}
            {delta} )
          </span>
        )}
      </div>
    </a>
  );
}

function Profile({ user }) {
  const [repos, setRepos] = useState([]);
  const [rank, setRank] = useState([]);
  const [last30, setLast30] = useState(false);
  const [issueResponse, setIssueResponse] = useState(null);
  const [response, setResponse] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/get/marks",
        { username: user.login },
        { withCredentials: true }
      );
      setResponse(response);
      setRepos(response.data.repos);
      setIssueResponse(response.data);
      setRank(response.data.sortedScoresAllTime);
      // console.log(response.data);
    } catch (err) {
      setResponse(err);
      console.error("Error fetching data:", err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (issueResponse) {
      setRank(
        last30
          ? issueResponse.sortedScoresLast30
          : issueResponse.sortedScoresAllTime
      );
    }
  }, [last30, issueResponse]);

  return (
    <div className="flex flex-col w-fit h-fit justify-center items-center">
      <h1 className="bg-[#172845] text-white text-4xl p-2 rounded-2xl my-2">
        {user.name}'s Dashboard
      </h1>
      {response == null ? (
        <Loader />
      ) : (
        <div className="flex w-screen h-screen flex-col items-center lg:flex-row lg:justify-evenly">
          <div className="bg-[#f6f6f6] hover:border-4 hover:border-black h-fit lg:h-screen text-center w-[90%] lg:w-[45%] rounded-2xl flex flex-col items-center overflow-auto my-2">
            <div className="text-3xl font-black py-2 sticky top-0 bg-[#004FE8] w-full text-white">
              Organization's Public Repositories
            </div>
            {repos.map((repoitem) => (
              <RepoBar key={repoitem.id} repo={repoitem} />
            ))}
          </div>

          <div className="bg-[#f6f6f6] hover:border-4 hover:border-black h-fit lg:h-screen text-center w-[90%] lg:w-[45%] rounded-2xl flex flex-col items-center overflow-auto my-2">
            <div className="text-3xl font-black py-2 sticky top-0 bg-[#004FE8] w-full text-white">
              {last30 ? "Last 30 Ranking" : "All-Time Ranking"}
            </div>
            {rank.map((rankitem, index) => (
              <RankBar
                key={rankitem.assignee}
                User={rankitem}
                status={user.login === rankitem.assignee}
                rank={index + 1}
              />
            ))}
            <button
              onClick={() => setLast30(!last30)}
              className="my-3 bg-blue-200 text-black hover:bg-blue-700 hover:text-white hover:shadow-2xl hover:shadow-neutral-950 duration-500 px-4 py-2 sticky bottom-0 cursor-pointer font-black w-fit h-fit rounded-lg"
            >
              {last30 ? "Show All-Time" : "Show Last 30 Days"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
