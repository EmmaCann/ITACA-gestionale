import React from "react";

export const ColonnaTabella = ({ children, width = "w-[120px]", align = "center" }) => {
    const alignment = align === "center" ? "text-center" : align === "left" ? "text-left" : "text-right";
    return (
        <div className={`${width} ${alignment} flex items-center justify-center`}>
            {children}
        </div>
    );
};
