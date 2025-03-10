import React from "react";
import BrainIcon from "../../../../../public/icons/brain.png"

export const ProfileIcon = () => {
return(
    <div className="bg-pinkSecondary rounded-full w-[56px] h-[54px] justify-center items-center flex mx-2">
        <div className=" bg-white rounded-full w-[38px] h-[38px] justify-center items-center flex">
                <img src={BrainIcon} alt="brain icon" className="w-[28px] h-[28px]"/>
        </div>
    </div>
);
}