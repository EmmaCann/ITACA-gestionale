import React from "react";
import { usePage } from "@inertiajs/react";
import { SearchBar } from "../molecules/atoms/searchBar.jsx";
import { DatePicker } from "./datePicker.jsx";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiMessageSquare } from "react-icons/fi";
import { WelcomeMessage } from "../molecules/atoms/welcomeMessage.jsx";

export const TopNavBar = () => {
    const { url, props } = usePage();
    const ruolo = props?.ruolo || null;
    const isAdmin = ruolo === "admin";

    const iconsClass =
        "w-[20px] h-[20px] cursor-pointer [@media(max-width:380px)]:w-[16px] [@media(max-width:380px)]:h-[16px]";

    return (
        <div
            className="
                bg-navbar opacity-[60%] w-full h-[55px] rounded-[20px]
                flex flex-row shadow-xs px-4

                /* riduci altezza e tutto il blocco */
                [@media(max-width:380px)]:h-[48px]
                [@media(max-width:350px)]:scale-[0.9]
                [@media(max-width:320px)]:scale-[0.8]
            "
        >
            {/* SINISTRA */}
            <div
                className="
                    flex flex-row justify-start items-center w-full gap-4

                    [@media(max-width:430px)]:gap-2
                    [@media(max-width:380px)]:gap-1

                    ml-2
                "
            >
                {/* NASCONDI WELCOME SU SCHERMI PICCOLISSIMI */}
                <div className="[@media(max-width:350px)]:hidden">
                    <WelcomeMessage />
                </div>

                <div
                    className="
                        [@media(max-width:380px)]:scale-[0.9]
                        [@media(max-width:340px)]:scale-[0.8]
                    "
                >
                    <DatePicker />
                </div>
            </div>

            {/* DESTRA */}
            <div
                className="
                    flex flex-row justify-end items-center w-full gap-4 mr-4 pr-4
                    [@media(max-width:430px)]:gap-2
                    [@media(max-width:380px)]:gap-1
                "
            >
                {isAdmin && !url.startsWith("/pazienti") && (
                    <div className="[@media(max-width:380px)]:hidden">
                        <SearchBar isTopBar={true} />
                    </div>
                )}

                <IoMdNotificationsOutline className={iconsClass} />

                {isAdmin && <FiMessageSquare className={iconsClass} />}
            </div>
        </div>
    );
};
