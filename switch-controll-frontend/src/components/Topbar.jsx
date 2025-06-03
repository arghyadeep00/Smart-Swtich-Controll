import React from "react";
import { GrLogout } from "react-icons/gr";
const Topbar = () => {
  const logout = () => {
    if (confirm("Are you want to logout ?")) {
      localStorage.removeItem("token");

      window.location.reload();
    }
  };
  return (
    <div className="p-4">
      <div className="flex justify-between items-center w-[90%] m-auto">
        <div className="logo mx-20"></div>
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
