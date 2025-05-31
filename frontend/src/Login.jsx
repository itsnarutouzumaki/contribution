import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleGithubLogin = async () => {
    const width = 600;
    const height = 700;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const popup = window.open(
      "https://contribution-1.onrender.com/auth/github",
      "GitHub Login",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      alert("Popup blocked. Please allow popups for this site.");
      return;
    }

    const userData = await new Promise((resolve) => {
      const receiveMessage = (event) => {
        if (event.origin !== "http://localhost:4000") return;
        window.removeEventListener("message", receiveMessage);
        resolve(event.data);
      };
      window.addEventListener("message", receiveMessage);
    });
    console.log(userData);
    navigate("/dashboard", { state: { user:userData.user} });
  };

  return (
    <>
      <h1 className="text-2xl font-black text-[#004FE8]">GitHub Login</h1>
      <button
        className="px-4 py-2 mt-2 bg-[#003FB9] rounded-2xl hover:shadow-2xl hover:shadow-blue-800 hover:border-2"
        onClick={handleGithubLogin}
      >
        Login with GitHub
      </button>
    </>
  );
}

export default Login;
