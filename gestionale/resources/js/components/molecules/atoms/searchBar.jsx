import React from "react";
import { IoIosSearch } from "react-icons/io";

export const SearchBar = ({ isTopBar }) => {
  const topBarClass = "h-[28px] w-[270px]";
  const largeClass = "h-[40px] w-[550px] drop-shadow"; 

  return (
    <div className={`flex justify-center rounded-[20px] bg-white items-center mr-2 ${isTopBar ? topBarClass : largeClass}`}>
      <input
        type="text"
        placeholder="Cerca..."
        className="w-full h-full rounded-[20px] outline-none px-4 text-[12px]"
      />
      <IoIosSearch className="mr-2 w-[20px] h-[20px] cursor-pointer" />
    </div>
  );
};
