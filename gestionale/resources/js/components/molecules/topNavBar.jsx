import React from "react";
import { usePage } from "@inertiajs/react";
import { SearchBar } from "../molecules/atoms/searchBar.jsx";
import { DatePicker } from "./datePicker.jsx";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiMessageSquare } from "react-icons/fi";
import { WelcomeMessage } from "../molecules/atoms/welcomeMessage.jsx";
import { MdNotificationAdd } from "react-icons/md";

export const TopNavBar = ({ mode = "full" }) => {
    const { url, props } = usePage();
    const ruolo = props?.ruolo || null;
    const isAdmin = ruolo === "admin";

    const iconCls = "w-[20px] h-[20px] mr-4 cursor-pointer ";

    /* MOBILE: SOLO DATE PICKER */
    if (mode === "date") {
        return <DatePicker />;
    }

    /* MOBILE: RIGA 2 = WELCOME + ICONE */
    if (mode === "welcome") {
        return (
            <>
                <WelcomeMessage />

                <div className="flex items-center gap-3">
                    <IoMdNotificationsOutline className={iconCls} />
                    {isAdmin && <FiMessageSquare className={iconCls} />}
                </div>
            </>
        );
    }

    /* DESKTOP FULL VERSION (sfondo originale) */
    return (
        <div
            className="
                bg-navbar opacity-[60%] w-full h-[55px] rounded-[20px]
                flex items-center shadow-xs px-4 gap-6
            "
        >
            {/* Saluto */}
            <WelcomeMessage />

            {/* Datepicker subito dopo il saluto */}
            <div className="flex items-center">
                <DatePicker />
            </div>

            {/* Spazio flessibile */}
            <div className="flex-1" />

            {/* Icone */}
            <div className="flex items-center gap-4">
                
               {!isAdmin && <IoMdNotificationsOutline className={iconCls}  />}
                {isAdmin && <MdNotificationAdd className={iconCls} />}
            </div>
        </div>
    );
};
