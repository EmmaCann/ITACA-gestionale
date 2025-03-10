import React from "react";

export const IconTextNavbar = ({ icon: Icon, image, text, iconSize }) => {
    return (
        <div className="w-full h-[40px] flex gap-8 justify-start items-center pl-4 cursor-pointer 
                         rounded-lg
                         hover:bg-white hover:bg-opacity-20 hover:shadow-md">
            {image ? (
                <img src={image} alt={text} className="w-[24px] h-[24px] " />
            ) : (
                Icon && <Icon size={iconSize} className="text-black" />
            )}
            <span className="font-marcellusSC text-[15px] text-black">{text}</span>
        </div>
    );
};
