import React from "react";
import { SearchBar } from "../molecules/atoms/searchBar.jsx";
import { DatePicker } from "../molecules/atoms/datePicker.jsx";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiMessageSquare } from "react-icons/fi";
import { WelcomeMessage } from "../molecules/atoms/welcomeMessage.jsx";

export const TopNavBar = () => {
const iconsClass= " w-[20px] h-[20px] cursor-pointer" 
    return (
        <div className="bg-navbar opacity-[60%] w-full h-[55px] rounded-[20px] flex flex-row drop-shadow-sm ">
            <div  className="flex flex-row justify-start items-center w-full gap-4 ml-8">
                <WelcomeMessage username="admin"/>
                <DatePicker/>
            </div>
            <div className="flex flex-row justify-end items-center w-full gap-4 mr-4">
                <SearchBar/>
                <IoMdNotificationsOutline className={iconsClass} />
                <FiMessageSquare className={iconsClass} />
            </div>
        </div>
    );

}