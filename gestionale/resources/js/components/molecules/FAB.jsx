import React from "react";
import { FABicon } from "../molecules/atoms/FABicon.jsx";
import { ItemFab } from "../molecules/atoms/itemFab.jsx";

import { MdEditCalendar } from "react-icons/md";
import { MdOutlineBadge } from "react-icons/md";
import { FaPersonWalking } from "react-icons/fa6";

export const FAB = () => {
    return (
        <div className="flex flex-col justify-center items-center fixed b-4 r-4">
            <div className="flex flex-col justify-center items-center">
                <ItemFab Icon={<FaPersonWalking />} text="NUOVO PAZIENTE"/>
                <ItemFab Icon={<MdOutlineBadge />} text="NUOVO STAFF"/>
                <ItemFab Icon={<MdEditCalendar />} text="APPUNTAMENTO"/>
            </div>
            <FABicon />
        </div>
    );
};
