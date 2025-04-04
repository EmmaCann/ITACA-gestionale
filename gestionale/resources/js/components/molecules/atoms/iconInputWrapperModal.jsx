import React from "react";

export const IconInputWrapperModal = ({
    icon: Icon,
    children,
    className = "",
}) => {
    return (
        <div className={`flex items-center gap-3 border border-gray-300 rounded-[12px] px-4 py-2 bg-white ${className}`}>
            {Icon && <Icon className="text-gray-500" size={14} />}
            {children}
        </div>
    );
};

