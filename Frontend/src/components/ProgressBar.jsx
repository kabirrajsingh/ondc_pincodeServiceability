// eslint-disable-next-line no-unused-vars
import React from "react";

// eslint-disable-next-line react/prop-types
const ProgressBar = ({ percent }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
      <div
        className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
        style={{ width: `${percent}%` }}
      >
        {percent}
      </div>
    </div>
  );
};

export default ProgressBar;
