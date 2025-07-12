import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";
const AddSwitch = () => {
  const { backendUrl } = useContext(StoreContext);
  const [form, setForm] = useState({
    id: "",
    name: "",
    watt: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${backendUrl}/api/switch/add-switches`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setForm({
          id: "",
          name: "",
          watt: "",
          category: "",
        });
      }
    } catch (error) {
      toast.error("failed to add switch");
      console.log(error);
    }
  };

  return (
    <div className="bg-[#23242a] p-6 rounded-xl shadow-md max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label htmlFor="id" className="text-white font-semibold">
          Switch ID
        </label>
        <input
          type="text"
          name="id"
          id="id"
          value={form.id}
          onChange={handleChange}
          required
          className="p-2 rounded bg-[#17181c] text-white border border-[#2e303d]"
          placeholder="Enter unique switch ID (switch1)"
        />

        <label htmlFor="name" className="text-white font-semibold">
          Switch Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={form.name}
          onChange={handleChange}
          required
          className="p-2 rounded bg-[#17181c] text-white border border-[#2e303d]"
          placeholder="Enter switch name (Bead Room)"
        />
        <label htmlFor="watt" className="text-white font-semibold">
          Consume Watt
        </label>
        <input
          type="number"
          name="watt"
          min="1"
          id="watt"
          value={form.watt}
          onChange={handleChange}
          required
          className="p-2 rounded bg-[#17181c] text-white border border-[#2e303d]"
          placeholder="Enter watt (200w)"
        />

        <label htmlFor="category" className="text-white font-semibold">
          Category
        </label>
        <select
          name="category"
          id="category"
          value={form.category}
          onChange={handleChange}
          required
          className="p-2 rounded bg-[#17181c] text-white border border-[#2e303d]"
        >
          <option value="">Select Category</option>
          <option value="Light">Light</option>
          <option value="Fan">Fan</option>
          <option value="Socket">Socket</option>
        </select>

        <button
          type="submit"
          className="mt-4 bg-[#a78bfa] text-[#17181c] font-bold py-2 rounded hover:bg-[#8b5cf6] transition"
        >
          Add Switch
        </button>
      </form>
    </div>
  );
};

export default AddSwitch;
