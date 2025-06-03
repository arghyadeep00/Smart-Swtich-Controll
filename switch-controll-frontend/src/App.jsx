import { Route, Routes } from "react-router-dom";
import Topbar from "./components/Topbar";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Controls";
import Data from "./pages/Data";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Controls from "./pages/Controls";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useState } from "react";
function App() {
  const [tokenVal, setTokenVal] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setTokenVal(true);
    } else {
      setTokenVal(false);
    }
  }, []);
  return (
    <>
      <ToastContainer />
      {tokenVal ? (
        <div className="flex">
          <Sidebar />
          <div className="w-full">
            <Topbar />
            <div className="p-3">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/control" element={<Controls />} />
                <Route path="/data" element={<Data />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;
