import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

export const IconInfoButtons = ({onClick }) => {
    return (
        <div className="flex flex-row items-center justify-center gap-2">
            <div className="bg-bluPrimary rounded-full flex justify-center items-center w-[28px] h-[28px]">
                <FaPhoneAlt size={16} color="white" />
            </div>
            <div className="bg-bluPrimary rounded-full flex justify-center items-center w-[28px] h-[28px]">
                <IoMail size={18} color="white"/>
            </div>
        </div>
    );
};
