import React from 'react'

function RepoBar({ repo }) {
  return (
    <a
      className="w-[98%] hover:w-full my-1 py-1 flex text-center justify-center items-center align-middle rounded-lg bg-blue-200 text-black hover:bg-blue-700 hover:text-white hover:shadow-2xl hover:shadow-neutral-950 duration-250 hover:font-black"
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <p className="mr-1">{repo.name} 🔗</p>
    </a>
  );
}

export default RepoBar