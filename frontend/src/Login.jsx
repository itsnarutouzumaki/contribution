import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
      toast.error("Popup blocked. Please allow popups for this site.", {
        duration: 2000,
        position: "top-center",
      });
      return;
    }

    try {
      const userData = await new Promise((resolve, reject) => {
        const allowedOrigins = [
          "http://localhost:4000",
          "https://contribution-1.onrender.com",
        ];

        const receiveMessage = (event) => {
          if (!allowedOrigins.includes(event.origin)) return;
          window.removeEventListener("message", receiveMessage);
          if (event.data && event.data.error) {
            reject(event.data.error);
          } else {
            resolve(event.data);
          }
        };

        window.addEventListener("message", receiveMessage);

        // Optional: timeout in case user closes popup or no response
        setTimeout(() => {
          window.removeEventListener("message", receiveMessage);
          reject("Login timed out. Please try again.");
        }, 60000);
      });

      console.log(userData);
      navigate("/dashboard", { state: { user: userData.user } });
      toast.success("You logged in successfully", {
        duration: 2000,
        position: "top-center",
      });
    } catch (error) {
      toast.error(error || "Login failed. Please try again.", {
        duration: 2000,
        position: "top-center",
      });
    }
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
