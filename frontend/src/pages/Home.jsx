import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { StoreContext } from "../context/StoreContext";

const Home = () => {
  const { backendUrl, deviceStatus } = useContext(StoreContext);
  const [switches, setSwitches] = useState([]);
  const [voltage, setVoltage] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    try {
      (async () => {
        const response = await axios.get(
          `${backendUrl}/api/switch/get-switches`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const fetchedSwitches = response.data.response.map((sw) => ({
          id: sw.switchId,
          value: sw.isActive,
          name: sw.switchName,
          category: sw.category,
        }));
        setSwitches(fetchedSwitches);
      })();
    } catch (error) {
      localStorage.removeItem("token");
      window.location.reload();
      toast.error("unauthorized user");
    }
  }, [backendUrl]);
  // fetch current voltage

  useEffect(() => {
    const socket = io(backendUrl);
    socket.on("voltageRate", (status) => {
      setVoltage(status);
    });
    return () => {
      socket.disconnect();
    };
  }, [backendUrl]);

  useEffect(() => {
    if (deviceStatus === "disconnected") {
      setSwitches((prev) => prev.map((sw) => ({ ...sw, value: false })));
      // Call backend to turn all switches off
      const token = localStorage.getItem("token");
      (async () => {
        await axios
          .post(
            `${backendUrl}/api/switch/all-off`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .catch(() => {
            toast.error("Failed to update backend switches");
          });
      })();
    }
  }, [deviceStatus, backendUrl]);

  const handleSwitchChange = async (id, newValue) => {
    if (deviceStatus === "disconnected") {
      toast.warning("Device is offline");
      return;
    }

    setSwitches((prev) =>
      prev.map((sw) => (sw.id === id ? { ...sw, value: newValue } : sw))
    );

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${backendUrl}/api/switch/switch-control`,
        {
          id,
          newValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      localStorage.removeItem("token");
      window.location.reload();
      toast.error("unauthorized user");
    }
  };

  return (
    <div className="bg-[#1a1b20] rounded-2xl flex flex-col items-center py-7 px-2">
      <div>{`Voltage: ${voltage}`}</div>
      {/* Switches Section */}
      <div className="grid grid-cols-1 mt-10 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {switches.map((sw) => (
          <div
            key={sw.id}
            className="bg-gradient-to-br from-[#23242a] to-[#2d2e36] rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4 border border-[#2e303d]"
          >
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sw.value}
                onChange={(e) => handleSwitchChange(sw.id, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-gray-400 rounded-full peer-checked:bg-green-500 relative transition-colors duration-200">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 peer-checked:translate-x-4"></div>
              </div>
            </label>
            <span className="text-lg text-white tracking-wide">{sw.name}</span>
            <span className="text-md font-semibold text-white tracking-wide">
              {sw.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
