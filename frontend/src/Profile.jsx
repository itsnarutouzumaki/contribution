import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";
import { useLocation } from "react-router-dom";
import RepoBar from "./RepoBar";
import RankBar from "./RankBar";
import toast from "react-hot-toast";

/**
 * Profile component displays a user's dashboard with their GitHub organization repositories
 * and ranking information based on contribution scores.
 *
 * Features:
 * - Fetches and displays public repositories of the organization.
 * - Shows user ranking either for all-time or the last 30 days.
 * - Allows toggling between all-time and last 30 days ranking.
 * - Displays loading and error notifications using toast messages.
 *
 * State:
 * - repos: Array of repository objects fetched from the backend.
 * - rank: Array of user ranking objects, either all-time or last 30 days.
 * - last30: Boolean flag to toggle between all-time and last 30 days ranking.
 * - issueResponse: Object containing the full response data for ranking.
 * - response: Stores the raw response or error from the API call.
 * - user: The current user object, initialized from router location state.
 *
 * Side Effects:
 * - Fetches data from the backend API on mount.
 * - Updates ranking data when the toggle or API response changes.
 *
 * UI:
 * - Displays a loader while fetching data.
 * - Shows repositories and ranking in separate, scrollable panels.
 * - Highlights the current user's ranking.
 *
 * Dependencies:
 * - React, useState, useEffect
 * - axios for HTTP requests
 * - toast for notifications
 * - useLocation from react-router-dom for routing state
 * - RepoBar and RankBar components for rendering lists
 * - Loader component for loading state
 *
 * @component
 */
function Profile() {
  const [repos, setRepos] = useState([]);
  const [rank, setRank] = useState([]);
  const [last30, setLast30] = useState(false);
  const [issueResponse, setIssueResponse] = useState(null);
  const [response, setResponse] = useState(null);
  const location = useLocation();
  const state = location.state || {};
  const [user, setUser] = useState(state.user);

  const fetchData = async () => {
    toast.loading("Please Wait, Fetching data", {
      id: "fetch-toast",
      position: "top-center",
    });
    try {
      const response = await axios.post(
        "https://contribution-1.onrender.com/get/marks",
        { username: user.login },
        { withCredentials: true }
      );
      setResponse(response);
      setRepos(response.data.repos);
      setIssueResponse(response.data);
      setRank(response.data.sortedScoresAllTime);

      const remaining = response.data.remainingAPICall;
      toast.success(
        `Data fetched successfully! Remaining API calls: ${remaining}`,
        {
          id: "fetch-toast",
          position: "top-center",
        }
      );
    } catch (err) {
      setResponse(err);
      toast.error("Error fetching data: " + err.message, {
        id: "fetch-toast",
        position: "top-center",
      });
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
          <div className="bg-[#f6f6f6] h-fit lg:h-screen text-center w-[90%] lg:w-[45%] rounded-2xl flex flex-col items-center overflow-auto my-2">
            <div className="text-3xl font-black py-2 sticky top-0 bg-[#004FE8] w-full text-white">
              Organization's Public Repositories
            </div>
            {repos.map((repoitem) => (
              <RepoBar key={repoitem.id} repo={repoitem} />
            ))}
          </div>

          <div className="bg-[#f6f6f6] h-fit lg:h-screen text-center w-[90%] lg:w-[45%] rounded-2xl flex flex-col items-center overflow-auto my-2">
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
