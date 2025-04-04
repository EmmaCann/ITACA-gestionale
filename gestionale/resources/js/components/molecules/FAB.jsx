import React, { useState, useEffect } from "react";
import { FABicon } from "../molecules/atoms/FABicon.jsx";
import { ItemFab } from "../molecules/atoms/itemFab.jsx";
import { MdEditCalendar, MdOutlineBadge } from "react-icons/md";
import { FaPersonWalking } from "react-icons/fa6";

import CustomModal from "../customModal.jsx";
import ModalContentAggiungiUtente from "./ModalContentAggiungiUtente.jsx"; 

export const FAB = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("paziente");

    const toggleFAB = () => {
        setIsOpen((prev) => !prev);
    };

    const handleOpenModal = (type) => {
        setModalType(type);
        setModalOpen(true);
        setIsOpen(false); // chiude il menu FAB
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".fab-container")) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <>
            <div className="fixed bottom-6 right-2 flex flex-col items-center fab-container z-50">
                <div className={`flex flex-col items-end transition-all duration-300 ${isOpen ? "mb-4 opacity-100" : "h-0 overflow-hidden"}`}>
                    <div onClick={() => handleOpenModal("paziente")}>
                        <ItemFab Icon={FaPersonWalking} text="NUOVO PAZIENTE" />
                    </div>
                    <div onClick={() => handleOpenModal("staff")}>
                        <ItemFab Icon={MdOutlineBadge} text="NUOVO STAFF" />
                    </div>
                    <ItemFab Icon={MdEditCalendar} text="APPUNTAMENTO" />
                </div>

                <div onClick={toggleFAB}>
                    <FABicon isOpen={isOpen} />
                </div>
            </div>

            {/* Modal riutilizzabile con contenuto dinamico */}
            <CustomModal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                title="Aggiungi Utente"
            >
                <ModalContentAggiungiUtente
                    tipoIniziale={modalType}
                    onClose={() => setModalOpen(false)}
                    onSubmit={(data) => {
                        console.log("Utente aggiunto:", data);
                        // Qui puoi aggiungere logica per inviare al backend o aggiornare uno store
                    }}
                />
            </CustomModal>
        </>
    );
};
