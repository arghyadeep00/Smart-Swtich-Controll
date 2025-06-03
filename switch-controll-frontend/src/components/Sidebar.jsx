import React, { useEffect, useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { CiDatabase } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
const Sidebar = () => {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const name = localStorage.getItem("userName");
    setUserName(name.split(" ")[0]);
  }, []);
  return (
    <div className="min-w-[16vw] h-[100vh] bg-[#17181C]">
      <h1 className="px-6 mt-7 font-medium text-xl">{`Hello, ${userName}`}</h1>
      <ul className="p-10 flex flex-col gap-10">
        <NavLink to="/" end>
          {({ isActive }) => (
            <li
              className={`cursor-pointer ${
                isActive ? "text-black bg-[#a78bfa] px-2 py-1 rounded-md" : ""
              }`}
            >
              <div className="flex items-center gap-4 text-xl ">
                <IoHomeOutline /> Home
              </div>
            </li>
          )}
        </NavLink>
        <NavLink to="/data">
          {({ isActive }) => (
            <li
              className={`cursor-pointer ${
                isActive ? "text-black bg-[#a78bfa] p-2 rounded-md" : ""
              }`}
            >
              <div className="flex items-center gap-4 text-xl">
                <CiDatabase />
                consumption
              </div>
            </li>
          )}
        </NavLink>
        <NavLink to="/profile">
          {({ isActive }) => (
            <li
              className={`cursor-pointer ${
                isActive ? "text-black bg-[#a78bfa] p-2 rounded-md" : ""
              }`}
            >
              <div className="flex items-center gap-4 text-xl">
                <CgProfile /> Profile
              </div>
            </li>
          )}
        </NavLink>
        <NavLink to="/settings">
          {({ isActive }) => (
            <li
              className={`cursor-pointer ${
                isActive ? "text-black bg-[#a78bfa] p-2 rounded-md" : ""
              }`}
            >
              <div className="flex items-center gap-4 text-xl">
                <IoSettingsOutline /> Setting
              </div>
            </li>
          )}
        </NavLink>
      </ul>
    </div>
  );
};

export default Sidebar;
