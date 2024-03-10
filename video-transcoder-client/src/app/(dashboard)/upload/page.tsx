import React from "react";

const page = () => {
  return (
    <div className="">
      <form action="">
        <label
          className="block mb-2 text-sm font-medium text-[#5381e6]"
          htmlFor="file_input"
        >
          Upload file
        </label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer p-2 bg-gray-50  "
          id="file_input"
          type="file"
        />
      </form>
    </div>
  );
};

export default page;
