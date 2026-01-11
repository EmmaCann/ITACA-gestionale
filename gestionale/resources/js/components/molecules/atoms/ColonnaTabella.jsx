import React from "react";

export const ColonnaTabella = ({
    children,
    minWidth = "min-w-[80px]",
    grow = false,
    align = "center",
}) => {
    const alignment =
        align === "left"
            ? "justify-start text-left"
            : align === "right"
            ? "justify-end text-right"
            : "justify-center text-center";

    return (
        <div
            className={`
                ${minWidth}
                ${grow ? "flex-1" : "flex-none"}
                flex items-center
                ${alignment}
                px-2
                overflow-hidden
            `}
        >
            {children}
        </div>
    );
};
