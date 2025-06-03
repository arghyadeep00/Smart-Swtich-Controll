import React, { useContext, useState } from "react";
import AddSwitch from "../components/AddSwitch";
import SwitchList from "../components/SwitchList";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import EditSwitchForm from "../components/EditSwitchForm"
const Settings = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [editingSwitch, setEditingSwitch] = useState(null);
  const { backendUrl } = useContext(StoreContext);
  const handleEditClick = (switchData) => {
    setEditingSwitch(switchData); 
  };

  const handleCancelEdit = () => {
    setEditingSwitch(null); 
  };

  const handleSaveEdit = async(updatedData) => {
    
    const token = localStorage.getItem("token");
    try {
      const response =await axios.put(
        `${backendUrl}/api/switch/edit-switch`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(response.data.success){
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error('cant not edit');
    }

    setEditingSwitch(null); 
  };

  return (
    <div className="w-full flex min-h-[80vh]">
      {/* Sidebar */}
      <div className="min-w-[15vw] bg-[#23242a] rounded-l-2xl p-8 flex flex-col gap-8">
        <ul className="flex flex-col gap-5 text-white font-semibold text-lg">
          <li
            className={`cursor-pointer px-2 py-1 rounded transition ${
              activeTab === "list"
                ? "bg-[#a78bfa] text-[#17181c]"
                : "hover:bg-[#2e303d]"
            }`}
            onClick={() => {
              setActiveTab("list");
              setEditingSwitch(null);
            }}
          >
            Switch List
          </li>
          <li
            className={`cursor-pointer px-2 py-1 rounded transition ${
              activeTab === "add"
                ? "bg-[#a78bfa] text-[#17181c]"
                : "hover:bg-[#2e303d]"
            }`}
            onClick={() => {
              setActiveTab("add");
              setEditingSwitch(null);
            }}
          >
            Add Switch
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-full rounded-r-2xl bg-[#1a1b20] p-8">
        {activeTab === "add" && <AddSwitch />}
        {activeTab === "list" && (
          <div className="text-white text-xl flex justify-center h-full">
            {editingSwitch ? (
              <EditSwitchForm
                switchData={editingSwitch}
                onCancel={handleCancelEdit}
                onSave={handleSaveEdit}
              />
            ) : (
              <SwitchList onEditClick={handleEditClick} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
