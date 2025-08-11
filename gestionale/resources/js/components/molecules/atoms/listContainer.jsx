import React from "react";

export const ListContainer = ({ small }) => {
    
    const heightClass = small ? "h-[280px]" : "h-[390px]";

    return (
        <div className={`bg-bgContainer rounded-[20px] w-[280px] overflow-y-auto flex flex-col ${heightClass}`}>
        </div>
    );
};
