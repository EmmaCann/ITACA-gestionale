import React from "react";

export const ItemFab = ({ Icon, text }) => { 

    return (
        <div className="bg-bluSecondary w-[180px] h-[48px] p-4 m-1 gap-4 flex  justify-start items-center rounded-[40px] cursor-pointer">
            {Icon && <Icon size={20} color="white" />}
            <span className="font-inter text-[12px] text-white ">
                {text}
            </span>
        </div>
    );
};
