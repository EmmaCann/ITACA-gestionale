import React from "react";
import { FaCheck } from "react-icons/fa";

export const CheckboxRotondo = ({
    checked = false,
    isStatic = false,
    onChange = () => {},
}) => {
    const commonClasses = `
        w-6 h-6 rounded-full border-2 
        flex items-center justify-center
        transition-all duration-200 
    `;

    if (isStatic) {
        return (
            <div
                className={`
                    ${commonClasses} 
                    ${checked ? "bg-[#3DA4DD] border-[#3DA4DD]" : "bg-transparent border-white"}
                `}
            >
                <FaCheck size={12} className="text-white" />
            </div>
        );
    }

    // Dinamico
    const checkedStyle = "bg-[#3FA1DE] border-[#3FA1DE]";
    const uncheckedStyle = "bg-transparent border-[#D9D9D9]";
    const iconColor = checked ? "text-white" : "text-[#D9D9D9]";

    return (
        <label className="inline-flex items-center justify-center w-6 h-6 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="hidden peer"
            />
            <div className={`${commonClasses} ${checked ? checkedStyle : uncheckedStyle}`}>
                <FaCheck size={12} className={iconColor} />
            </div>
        </label>
    );
};
