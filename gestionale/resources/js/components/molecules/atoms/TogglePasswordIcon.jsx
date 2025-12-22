import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const TogglePasswordIcon = ({ toggle, isVisible }) => {
    return (
        <button
            type="button"
            className="text-[#3DA4DD] opacity-[70%] w-[18px] h-[14px] ml-2 cursor-pointer"
            onClick={toggle} 
        >
            {isVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
    );
};
