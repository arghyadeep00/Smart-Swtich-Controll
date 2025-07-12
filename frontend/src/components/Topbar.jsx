import React, { useContext, useEffect } from "react";
import { GrLogout } from "react-icons/gr";
import io from "socket.io-client";
import { StoreContext } from "../context/StoreContext";

const Topbar = () => {
  const { backendUrl, deviceStatus, setDeviceStatus } =
    useContext(StoreContext);

  useEffect(() => {
    const savedStatus = localStorage.getItem("deviceStatus");
    if (savedStatus) setDeviceStatus(savedStatus);

    const socket = io(backendUrl);

    socket.on("deviceStatus", (status) => {
     
      setDeviceStatus(status);
      localStorage.setItem("deviceStatus", status);
    });

    return () => {
      socket.disconnect();
    };
  }, [backendUrl, setDeviceStatus]);

  const logout = () => {
    if (confirm("Are you want to logout ?")) {
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center w-[90%] m-auto">
        <div className="status mx-20">
          <span
            className={`px-4 py-1 rounded-full font-semibold ${
              deviceStatus === "connected"
                ? "bg-green-100 text-green-700 border border-green-400"
                : "bg-red-100 text-red-700 border border-red-400"
            }`}
          >
            Device is{" "}
            {deviceStatus === "connected" ? "connected" : "disconnected"}
          </span>
        </div>
        <div
          className="flex justify-center items-center gap-3 font-bold cursor-pointer"
          onClick={logout}
        >
          <GrLogout />
          Logout
        </div>
      </div>
    </div>
  );
};

export default Topbar;
