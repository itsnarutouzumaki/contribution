import { useState } from "react";
import Profile from "./Profile.jsx";

function App() {
  const [user, setUser] = useState(null);
  
  const handleGithubLogin = async () => {
    const width = 600;
    const height = 700;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const popup = window.open(
      "http://localhost:4000/auth/github",
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
    setUser(userData);
  };

  return (
    <div className="justify-center text-center ">
      
      {!user ? (
        <>
        <h1 className="text-2xl text-red-500 hover:text-amber-300 ">
        GitHub Login Demo
      </h1>
        <button
          className="px-4 py-2 mt-2 bg-amber-500 rounded-2xl hover:bg-green-300 active:bg-green-800"
          onClick={handleGithubLogin}
        >
          Login with GitHub
        </button>
        </>
      ) : <Profile user={user.user}/>}
    </div>
   
    
  );
}

export default App;
