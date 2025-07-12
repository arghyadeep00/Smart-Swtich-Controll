import React, { useState } from "react";

const EditSwitchForm = ({ switchData, onSave, onCancel }) => {
  const [form, setForm] = useState({
    switchId: switchData?.switchId || "",
    switchName: switchData?.switchName || "",
    watt: switchData?.watt || "",
    category: switchData?.category || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-[#23242a] to-[#1a1b20] p-5 rounded-2xl shadow-2xl max-w-md w-full mx-auto flex flex-col gap-2 border border-[#2e303d]"
    >
      <h2 className="text-white text-2xl font-bold mb-4 text-center tracking-wide">
        Edit Switch Details
      </h2>
      <div className="flex flex-col gap-1">
        <label className="text-[#a78bfa] text-[1.1rem]" htmlFor="switchId">
          Switch ID
        </label>
        <input
          type="text"
          id="switchId"
          name="switchId"
          value={form.switchId}
          onChange={handleChange}
          disabled
          className="p-1 w-full rounded px-3 bg-[#17181c] text-[#ffffff9c] border border-[#2e303d] focus:ring-2 focus:ring-[#a78bfa] outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[#a78bfa] text-[1.1rem]" htmlFor="switchName">
          Switch Name
        </label>
        <input
          type="text"
          id="switchName"
          name="switchName"
          value={form.switchName}
          onChange={handleChange}

          className="p-1 w-full px-3 rounded bg-[#17181c] text-white border border-[#2e303d] focus:ring-2 focus:ring-[#a78bfa] outline-none"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[#a78bfa] text-[1.1rem]" htmlFor="watt">
          Watt
        </label>
        <input
          type="number"
          id="watt"
          name="watt"
          value={form.watt}
          onChange={handleChange}
          className="p-1 w-full px-3 rounded bg-[#17181c] text-white border border-[#2e303d] focus:ring-2 focus:ring-[#a78bfa] outline-none"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[#a78bfa] text-[1.1rem]" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          className="p-1 mt-2 px-3 rounded bg-[#17181c] text-white border border-[#2e303d]"
          required
        >
          <option value="">Select Category</option>
          <option value="Light">Light</option>
          <option value="Fan">Fan</option>
          <option value="Socket">Socket</option>
        </select>
      </div>
      <div className="flex gap-4 mt-8 justify-center">
        <button
          type="submit"
          className="bg-[#a78bfa] cursor-pointer hover:bg-[#8b5cf6] text-[#17181c] px-6 py-1 rounded-lg transition"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-[#23242a] cursor-pointer hover:bg-[#2e303d] text-[#a78bfa] px-6 py-1 rounded-lg border border-[#a78bfa] transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditSwitchForm;
