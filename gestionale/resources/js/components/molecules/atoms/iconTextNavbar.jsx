import React from "react";

export const IconTextNavbar = ({ icon:Icon, text ,iconSize}) => {

    return(
        <div className="w-full flex gap-8 justify-start items-center pl-4 cursor-pointer">
            {Icon && <Icon size={iconSize} color="black" />} 
            <span className="font-marcellusSC text-[15px] text-black ">{text}</span>
        </div>
    );

}