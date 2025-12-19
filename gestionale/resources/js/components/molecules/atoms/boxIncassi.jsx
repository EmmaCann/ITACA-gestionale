import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { IncassiItemContainer } from "../incassiItemContainer.jsx";
import { Link } from "@inertiajs/react";
import { getDettagliStats } from "../../../data/api/pagamenti.js";

export const BoxIncassi = ({ text, money, bgColor, ruolo, terapistaId }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [isHoveringPopup, setIsHoveringPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState("top-0 left-full ml-2");
    const [popupData, setPopupData] = useState([]);

    const tipoMap = {
        "INCASSI DEL GIORNO": "giorno",
        "INCASSI DELLA SETTIMANA": "settimana",
        "INCASSI DEL MESE": "mese",
        "INCASSI DELL'ANNO": "anno",
    };

    const normalizedText = text.toUpperCase().trim();
    const tipo = tipoMap[normalizedText];

    const handleMouseEnter = async (event) => {
        setShowDetails(true);
        const box = event.target.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (box.bottom + 300 > windowHeight) {
            setPopupPosition("bottom-0 left-full ml-2");
        } else {
            setPopupPosition("top-0 left-full ml-2");
        }

        try {
            const data = await getDettagliStats(
                tipo,
                ruolo === "staff" ? terapistaId : null
            );
            setPopupData(data);
        } catch (error) {
            console.error("Errore caricamento popup:", error);
            setPopupData([]);
        }
    };

    const handleMouseLeave = () => {
        setTimeout(() => {
            if (!isHoveringPopup) {
                setShowDetails(false);
            }
        }, 200);
    };

    const safePopupData = Array.isArray(popupData)
        ? popupData
        : Object.values(popupData || {});
    const params = {
        param1: safePopupData.map((el) => el.label),
        param2List: null,
        moneyList: safePopupData.map((el) => el.valore),
    };

    return (
        <div
            className="relative w-[290px] h-[100px] rounded-[20px] flex flex-col justify-center items-center text-center shadow-md py-3"
            style={{ backgroundColor: bgColor }}
        >
            <Link
                href={`/incassi/${tipo}`}
                className="text-white font-marcellusSC text-[18px] cursor-pointer transition duration-300 hover:underline hover:underline-offset-4 mt-2"
            >
                {text}
            </Link>

            <span className="text-white font-marcellusSC text-[28px] mt-2 mb-4">
                {money}
            </span>

            <FaChevronRight
                className="
    hidden md:block
    absolute right-4 top-1/2 -translate-y-1/2
    w-[20px] h-[20px]
    text-white cursor-pointer
    transition-transform duration-300
    hover:translate-x-1
"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />

            {(showDetails || isHoveringPopup) && (
                <div
                    className={`absolute ${popupPosition}`}
                    onMouseEnter={() => setIsHoveringPopup(true)}
                    onMouseLeave={() => {
                        setIsHoveringPopup(false);
                        setShowDetails(false);
                    }}
                >
                    <IncassiItemContainer bgColor={bgColor} params={params} />
                </div>
            )}
        </div>
    );
};
