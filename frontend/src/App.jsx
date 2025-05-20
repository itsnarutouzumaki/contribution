import { useState } from "react";

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

    console.log(userData.data);
    setUser(userData);
  };

  return (
    <div className="justify-center text-center border-2 rounded-2xl border-amber-50 p-5 hover:p-6 duration-1000 hover:bg-slate-800">
      <h1 className="text-2xl text-red-500 hover:text-amber-300 ">
        GitHub Login Demo
      </h1>
      {!user ? (
        <button
          className="px-4 py-2 mt-2 bg-amber-500 rounded-2xl hover:bg-green-300 active:bg-green-800"
          onClick={handleGithubLogin}
        >
          Login with GitHub
        </button>
      ) : (
        <div className="flex w-fit align-middle justify-center h-fit ">
          <img src={user.avatar_url} alt="avatar" width="100" className="m-3 rounded-b-lg" />
          <div className="min-h-max flex flex-col justify-center align-middle text-center ">
          <h2 className="font-black">{user.name}</h2>
          <p className="italic font-light underline text-slate-200">@{user.login}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
