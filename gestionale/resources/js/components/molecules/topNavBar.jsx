import React from "react";
import {usePage} from "@inertiajs/react"
import { SearchBar } from "../molecules/atoms/searchBar.jsx";
import { DatePicker } from "./datePicker.jsx";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiMessageSquare } from "react-icons/fi";
import { WelcomeMessage } from "../molecules/atoms/welcomeMessage.jsx";

export const TopNavBar = () => {
const {url, props} = usePage();  //otteniamo l'url e le props condivise (ruolo, logged_user)
const ruolo = props?.ruolo || null;
const isAdmin = ruolo === 'admin';

const iconsClass= " w-[20px] h-[20px] cursor-pointer" 
    return (
        <div className="bg-navbar opacity-[60%] w-full h-[55px] rounded-[20px] flex flex-row shadow-xs ">
            <div  className="flex flex-row justify-start items-center w-full gap-4 ml-8">
                <WelcomeMessage />
                <DatePicker/>
            </div>
            <div className="flex flex-row justify-end items-center w-full gap-4 mr-4 pr-4">
                {/* Show SearchBar and chat icon only for admin */}
                { isAdmin && !url.startsWith("/pazienti") && <SearchBar isTopBar={true} /> }
                <IoMdNotificationsOutline className={iconsClass} />
                { isAdmin && <FiMessageSquare className={iconsClass} /> }
            </div>
        </div>
    );

}