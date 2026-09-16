import React from "react";
import { useDispatch } from "react-redux";
import Bell from "./DashBoardLatoutComp/Bell";
import Author from "./DashBoardLatoutComp/Author";
import Message from "./DashBoardLatoutComp/Message";

export default function Header({ title, description }) {
  return (
    <div className="bg-white border-b border-gray-200 w-full px-6 py-4 flex items-center sticky top-0 z-40">
      <div>
        <h1 className="text-gray-800 text-xl font-semibold">
          {title || ""}
        </h1>
        {description && (
          <p className="text-gray-500 text-sm mt-0.5">
            {description}
          </p>
        )}
      </div>
      <div className="flex-grow"></div>
      <div className="flex justify-center items-center gap-3">
        <Bell />
        <Message />
        <Author />
      </div>
    </div>
  );
}
