import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // On mount, load user from localStorage if available
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // After successful login
  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // After successful logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return <div className="App">{/* ... */}</div>;
}

export default App;