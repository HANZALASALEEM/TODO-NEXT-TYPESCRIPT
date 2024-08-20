import React from "react";

const DetailComponent = ({ title }) => {
  return (
    <div className="bg-stone-200 w-full h-full rounded-xl">
      <h1 className="px-3 py-2 text-2xl font-semibold">Task Details</h1>
      <h2 className="px-3 py-2 text-xl font-semibold">Title</h2>
    </div>
  );
};

export default DetailComponent;
