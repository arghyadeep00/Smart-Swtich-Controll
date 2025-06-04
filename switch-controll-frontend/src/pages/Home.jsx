import React, { useEffect, useState, useContext } from "react";
import Gauge from "../components/Gauge";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../context/StoreContext";

const Home = () => {
  const { backendUrl, deviceStatus } = useContext(StoreContext);
  const [switches, setSwitches] = useState([]);

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
      <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {[
          { label: "Voltage", value: 230, max: 300 },
          { label: "Watt", value: 1380, max: 3000 },
          { label: "Ampere", value: 6, max: 10 },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-[#23242a] to-[#2d2e36] rounded-xl shadow-xl p-2 flex flex-col items-center border border-[#2e303d] hover:scale-[1.02] transition-transform hover:shadow-green-500/20"
          >
            <h2 className="text-lg font-semibold text-[#a78bfa] tracking-wide">
              {item.label}
            </h2>
            <div className="w-36 h-36">
              <Gauge value={item.value} valueMax={item.max} />
            </div>
          </div>
        ))}
      </div>

      {/* Switches Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
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
