import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { toast } from "react-toastify";

const SwitchList = ({ onEditClick }) => {
  const { backendUrl } = useContext(StoreContext);
  const [switches, setSwitches] = useState([]);

  useEffect(() => {
    const fetchSwitches = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${backendUrl}/api/switch/get-switches`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSwitches(response.data.response);
      } catch (error) {
        setSwitches([]);
      }
    };
    fetchSwitches();
  }, [backendUrl]);

  const handleOnDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (confirm("Are you want to delet")) {
      try {
        const response = await axios.delete(
          `${backendUrl}/api/switch/delete-switch/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
         
          toast.success(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Can't delete");
      }
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-[400px] w-full text-white border border-[#2e303d] rounded-lg">
        <thead>
          <tr className="bg-[#23242a]">
            <th className="py-2 px-4 border-b font-normal border-[#2e303d]">
              ID
            </th>
            <th className="py-2 px-4 border-b font-normal border-[#2e303d]">
              Name
            </th>
            <th className="py-2 px-4 border-b font-normal border-[#2e303d]">
              Watt
            </th>
            <th className="py-2 px-4 border-b font-normal border-[#2e303d]">
              Category
            </th>
            <th className="py-2 px-4 border-b font-normal border-[#2e303d]">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>
          {switches.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No switches found.
              </td>
            </tr>
          ) : (
            switches.map((sw) => (
              <tr
                key={sw.switchId}
                className="hover:bg-[#2e303d] text-center text-[#ffffffc7]"
              >
                <td className="py-2 px-4 border-b border-[#2e303d]">
                  {sw.switchId}
                </td>
                <td className="py-2 px-4 border-b border-[#2e303d]">
                  {sw.switchName}
                </td>
                <td className="py-2 px-4 border-b border-[#2e303d]">
                  {sw.watt}
                </td>
                <td className="py-2 px-4 border-b border-[#2e303d]">
                  {sw.category}
                </td>
                <td className="py-2 px-4 border-b border-[#2e303d] ">
                  <div className="flex justify-between">
                    <FaRegEdit
                      className="cursor-pointer"
                      onClick={() => onEditClick(sw)}
                    />
                    <MdOutlineDelete
                      className="cursor-pointer text-2xl"
                      onClick={() => handleOnDelete(sw.switchId)}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SwitchList;
