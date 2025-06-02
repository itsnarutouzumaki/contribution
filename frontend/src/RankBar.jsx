import React from 'react'

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
export default RankBar