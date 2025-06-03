import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";

const Data = () => {
  const { backendUrl } = useContext(StoreContext);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState({ hour: "0", minute: "0" });
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [watt, setWatt] = useState(0);
  const handleOnDateChange = (e) => {
    setDate(e.target.value);
  };
  useEffect(() => {
    const fetchActivity = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${backendUrl}/api/switch/my-activity/${date}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const acts = response.data.activities || [];
        setActivities(acts);

        let totalMs = 0;
        let totalWatt = 0;
        acts.forEach((act) => {
          if (act.onTime && act.offTime) {
            const durationMs = new Date(act.offTime) - new Date(act.onTime);
            totalMs += durationMs;
            const durationHours = durationMs / (1000 * 60 * 60);
            totalWatt += (act.watt || 0) * durationHours;
          }
        });
        const totalMinutes = Math.floor(totalMs / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        setTime({ hour: hours, minute: minutes });
        setWatt(totalWatt.toFixed(2));
      } catch (error) {
        setActivities([]);
        setTime({ hour: "0", minute: "0" });
        setWatt(0);
      }
      setLoading(false);
    };
    fetchActivity();
  }, [date, backendUrl]);

  return (
    <div className="max-h-[90vh] bg-[#17181C] rounded-2xl p-7">
      <div className="flex justify-between">
        <div className="flex justify-between gap-5">
          <h2 className="text-xl text-slate-400">{`Total on Time: ${time.hour}h ${time.minute}m `}</h2>
          <h2 className="text-xl text-slate-400">{`${watt} Watt Consumed`}</h2>
        </div>
        <h2 className="text-2xl text-[#a78bfa] font-bold mb-8 text-center">
          {date === new Date().toISOString().split("T")[0]
            ? "Today's Switch Activity"
            : `Switch Activity for ${date}`}
        </h2>
        <div>
          <input
            type="date"
            name="date"
            value={date}
            onChange={handleOnDateChange}
          />
        </div>
      </div>
      {loading ? (
        <div className="text-white text-center">Loading...</div>
      ) : activities.length === 0 ? (
        <div className="text-white text-center">
          No activity found for today.
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-scroll max-h-[70vh]">
          <table className="w-full text-white border border-[#2e303d] rounded-lg">
            <thead>
              <tr className="bg-[#23242a]">
                <th className="py-2 px-4 border-b border-[#2e303d] sticky top-0 bg-[#23242a] z-10">
                  Switch ID
                </th>
                <th className="py-2 px-4 border-b border-[#2e303d] sticky top-0 bg-[#23242a] z-10">
                  Switch Name
                </th>
                <th className="py-2 px-4 border-b border-[#2e303d] sticky top-0 bg-[#23242a] z-10">
                  Consume Watt
                </th>
                <th className="py-2 px-4 border-b border-[#2e303d] sticky top-0 bg-[#23242a] z-10">
                  Category
                </th>
                <th className="py-2 px-4 border-b border-[#2e303d] sticky top-0 bg-[#23242a] z-10">
                  On Time
                </th>
                <th className="py-2 px-4 border-b border-[#2e303d] sticky top-0 bg-[#23242a] z-10">
                  Off Time
                </th>
                <th className="py-2 px-4 border-b border-[#2e303d] sticky top-0 bg-[#23242a] z-10">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act, idx) => (
                <tr key={idx} className="hover:bg-[#2e303d] text-center">
                  <td className="py-2 px-4 border-b border-[#2e303d]">
                    {act.switchId}
                  </td>
                  <td className="py-2 px-4 border-b border-[#2e303d]">
                    {act.switchName}
                  </td>
                  <td className="py-2 px-4 border-b border-[#2e303d]">
                    {act.watt}W
                  </td>
                  <td className="py-2 px-4 border-b border-[#2e303d]">
                    {act.category}
                  </td>
                  <td className="py-2 px-4 border-b border-[#2e303d]">
                    {act.onTime ? new Date(act.onTime).toLocaleString() : "-"}
                  </td>
                  <td className="py-2 px-4 border-b border-[#2e303d]">
                    {act.offTime ? (
                      new Date(act.offTime).toLocaleString()
                    ) : (
                      <p className="bg-green-500 rounded-2xl">Active</p>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-[#2e303d]">
                    {act.onTime && act.offTime
                      ? (() => {
                          const durationMs =
                            new Date(act.offTime) - new Date(act.onTime);
                          const seconds = Math.floor((durationMs / 1000) % 60);
                          const minutes = Math.floor(
                            (durationMs / (1000 * 60)) % 60
                          );
                          const hours = Math.floor(
                            durationMs / (1000 * 60 * 60)
                          );
                          return ` ${hours}h ${minutes}m ${seconds}s`;
                        })()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Data;
