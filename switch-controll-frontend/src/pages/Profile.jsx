import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const Profile = () => {
  const { backendUrl } = useContext(StoreContext);
  const [userData, setUserData] = useState({});
  const [mqtDetails, setMqtDetails] = useState({
    host: "",
    port: "",
    protocol: "",
    username: "",
    mqtpassword: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    (async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const profile = response.data.userProfile;
        setUserData(profile);
        setMqtDetails({
          host: profile.host || "",
          port: profile.port || "",
          protocol: profile.protocol || "",
          username: profile.username || "",
          mqtpassword: profile.mqtpassword || "",
        });
      } catch (error) {
        toast.error("Failed to load user profile");
      }
    })();
  }, [backendUrl]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setMqtDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${backendUrl}/api/user/update-mqtt`,
        mqtDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setIsEdit(false);
    } catch (error) {
      toast.error("Failed to update MQTT details");
    }
  };

  return (
    <div className="space-y-5">
      {/* User Info Card */}
      <div className="bg-gradient-to-br from-[#23242a] to-[#1a1b20] rounded-2xl p-8 flex items-center gap-8 shadow-xl border border-[#2e303d]">
        <img
          src="/avtar.jpg"
          alt="Avatar"
          className="w-28 h-28 rounded-full border-4 border-[#a78bfa] shadow-lg object-cover"
        />
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-white">
            Hi,{" "}
            <span className="text-[#a78bfa]">{userData.name || "User"}</span>
          </h2>
          <h3 className="text-[#bdbdbd]">{userData.email}</h3>
          {userData.phone && (
            <h3 className="text-[#bdbdbd]">Phone: {userData.phone}</h3>
          )}
        </div>
      </div>

      {/* MQTT Details */}
      <div className="bg-gradient-to-br from-[#23242a] to-[#1a1b20] rounded-2xl p-8 shadow-xl border border-[#2e303d]">
        <div className="flex justify-between">
          <h2 className="text-xl text-[#a78bfa] font-semibold mb-4">
            HiveMQ Server Details
          </h2>
          <FaRegEdit
            className="cursor-pointer text-xl"
            onClick={() => setIsEdit((prev) => !prev)}
          />
        </div>
        <form onSubmit={handleOnSubmit}>
          <ul className="flex flex-col gap-2 text-[#bdbdbd] text-base">
            <li>
              <span className="font-semibold text-white">Host:</span>{" "}
              <input
                type="text"
                name="host"
                disabled={!isEdit}
                className={`ml-4 bg-transparent text-white focus:outline-none ${
                  isEdit
                    ? "border-b border-[#a78bfa] cursor-text"
                    : "border-none"
                }`}
                value={mqtDetails.host}
                onChange={handleOnChange}
              />
            </li>
            <li>
              <span className="font-semibold text-white">Port:</span>
              <input
                type="text"
                name="port"
                disabled={!isEdit}
                className={`ml-4 bg-transparent text-white focus:outline-none ${
                  isEdit
                    ? "border-b border-[#a78bfa] cursor-text"
                    : "border-none"
                }`}
                value={mqtDetails.port}
                onChange={handleOnChange}
              />
            </li>
            <li>
              <span className="font-semibold text-white">Protocol:</span>{" "}
              <input
                type="text"
                name="protocol"
                disabled={!isEdit}
                className={`ml-4 bg-transparent text-white focus:outline-none ${
                  isEdit
                    ? "border-b border-[#a78bfa] cursor-text"
                    : "border-none"
                }`}
                value={mqtDetails.protocol}
                onChange={handleOnChange}
              />
            </li>
            <li>
              <span className="font-semibold text-white">Username:</span>{" "}
              <input
                type="text"
                name="userName"
                disabled={!isEdit}
                className={`ml-4 bg-transparent text-white focus:outline-none ${
                  isEdit
                    ? "border-b border-[#a78bfa] cursor-text"
                    : "border-none"
                }`}
                value={mqtDetails.username}
                onChange={handleOnChange}
              />
            </li>
            <li>
              <span className="font-semibold text-white">Password:</span>{" "}
              <input
                type="text"
                name="mqtPassword"
                disabled={!isEdit}
                className={`ml-4 bg-transparent text-white focus:outline-none ${
                  isEdit
                    ? "border-b border-[#a78bfa] cursor-text"
                    : "border-none"
                }`}
                value={mqtDetails.mqtpassword}
                onChange={handleOnChange}
              />
            </li>
          </ul>
          {isEdit && (
            <button
              type="submit"
              className="border cursor-pointer border-none px-4 bg-[#a78bfa] text-black py-1 rounded-md mt-4 hover:bg-[#a78bfae5]"
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
