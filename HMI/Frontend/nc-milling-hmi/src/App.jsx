import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import AuthPage from './components/Authpage';
import CNCDashboard from './components/CNCDashboard';

const socket = io("http://localhost:8080", {
  autoConnect: false,
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("token");
      socket.auth = { token: token };
      socket.connect();
    } else {
      socket.disconnect();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <CNCDashboard onLogout={handleLogout} socket={socket} />
      ) : (
        <AuthPage onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;