import React from "react";

/**
 * Renders a user ranking bar with dynamic styling based on user status and score delta.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.User - User data object.
 * @param {string} props.User.assignee - GitHub username of the user.
 * @param {number} props.User.marks - Current score or marks of the user.
 * @param {number} [props.User.last60] - User's score from the last 60 days (optional).
 * @param {boolean} props.status - Indicates if the current user is the logged-in user.
 * @param {number} props.rank - The user's rank in the leaderboard.
 *
 * @returns {JSX.Element} A styled anchor element displaying the user's rank, name, score, and score delta.
 *
 * @example
 * <RankBar
 *   User={{ assignee: "octocat", marks: 120, last60: 100 }}
 *   status={true}
 *   rank={1}
 * />
 */
function RankBar({ User, status, rank }) {
  const delta = User.last60 !== undefined ? User.marks * 2 - User.last60 : null;
  const deltaColor =
    delta > 0
      ? "text-green-900 ml-1 font-black"
      : "text-red-900 ml-1 font-black";

  return (
    <a
      className={`w-[98%] hover:w-full border-2 my-1 py-1 bg-blue-200 text-black hover:bg-blue-700 hover:text-white hover:shadow-2xl hover:shadow-red-950 duration-250 hover:font-black ${
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
export default RankBar;
