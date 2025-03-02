import React from "react";

export const ItemFab = ({ icon:Icon, text}) => {
    return (
        <div className="bg-bluSecondary w-[200px] w-[40px] flex gap-8 justify-center items-center  cursor-pointer">
            {Icon && <Icon size="22" color="white" />}
            <span className="font-inter text-[15px] text-white ">
                {text}
            </span>
        </div>
    );
};
