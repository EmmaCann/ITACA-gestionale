import React, { useState, useEffect } from "react";
import { FABicon } from "../molecules/atoms/FABicon.jsx";
import { ItemFab } from "../molecules/atoms/itemFab.jsx";
import { MdEditCalendar } from "react-icons/md";
import { MdOutlineBadge } from "react-icons/md";
import { FaPersonWalking } from "react-icons/fa6";

export const FAB = () => {
    // Stato per gestire l'apertura/chiusura
    const [isOpen, setIsOpen] = useState(false);

    // Funzione per togglare il menu FAB
    const toggleFAB = () => {
        setIsOpen((prev) => !prev);
    };

    // Chiudere il FAB se si clicca fuori
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".fab-container")) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="fixed bottom-6 right-2 flex flex-col items-center fab-container">
            {/* Contenitore degli ItemFab */}
            <div className={`flex flex-col items-end transition-all duration-300 ${isOpen ? "mb-4 opacity-100" : "h-0 overflow-hidden "}`}>
                <ItemFab Icon={FaPersonWalking} text="NUOVO PAZIENTE" />
                <ItemFab Icon={MdOutlineBadge} text="NUOVO STAFF" />
                <ItemFab Icon={MdEditCalendar} text="APPUNTAMENTO" />
            </div>

            {/* FABicon principale */}
            <div onClick={toggleFAB}>
                <FABicon isOpen={isOpen} />
            </div>
        </div>
    );
};
