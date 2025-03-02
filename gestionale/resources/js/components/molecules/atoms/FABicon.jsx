import React from "react";
import { FaPlus } from "react-icons/fa";

export const FABicon = ({ isOpen }) => {
    return (
        <div className={`rounded-full ${isOpen ? "bg-gray-300" : "bg-bluSecondary"} w-[56px] h-[56px] flex justify-center items-center cursor-pointer transition-colors duration-300`}>
            <FaPlus color="white" size={26} />
        </div>
    );
};
