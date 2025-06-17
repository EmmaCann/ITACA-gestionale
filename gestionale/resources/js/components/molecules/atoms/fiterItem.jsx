import React, { useState } from "react";

export const FilterItem = ({ text, bgColor, onClick, isActive }) => {
    const backgroundColor = bgColor === "blu" ? "bg-bluSecondary" : "bg-pinkSecondary";
    const borderColor = bgColor === "blu" ? "border-[#3DA4DD]" : "border-[#c47ea4]"; 

    return (
        <div className="flex flex-col items-center cursor-pointer">
            <div 
                className={`rounded-[20px] flex justify-center items-center text-center transition-all duration-300
                            border-[1.5px] ${borderColor} ${backgroundColor} opacity-90 hover:bg-opacity-80`}
                onClick={onClick}
            >
                <span className="text-white font-inter text-[12px] py-1 px-8">{text}</span>
            </div>

            {isActive && (
                <div className={`w-[80%] h-[2px] mt-1 ${bgColor === "blu" ? "bg-bluSecondary" : "bg-pinkSecondary"}`} />
            )}
        </div>
    );
};

