import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { IncassiItemContainer } from "../incassiItemContainer.jsx";

export const BoxIncassi = ({ text, money, bgColor }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [isHoveringPopup, setIsHoveringPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState("top-0 left-full ml-2");

    const testData = {
        "INCASSI DEL GIORNO": {
            param1: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
            param2List: ["200€", "180€", "220€", "250€", "270€", "300€", "280€", "310€"],
            moneyList: ["200€", "180€", "220€", "250€", "270€", "300€", "280€", "310€"],
        },
        "INCASSI DELLA SETTIMANA": {
            param1: ["LUN", "MAR", "MER", "GIO", "VEN", "SAB", "DOM"],
            param2List: ["1.02.25", "2.02.25", "3.02.25", "4.02.25", "5.02.25", "6.02.25", "7.02.25"],
            moneyList: ["1000€", "1200€", "1100€", "1300€", "1250€", "1400€", "1500€"],
        },
        "INCASSI DEL MESE": {
            param1: ["Settimana 1", "Settimana 2", "Settimana 3", "Settimana 4"],
            param2List: ["500€", "700€", "900€", "600€"],
            moneyList: ["5000€", "7000€", "9000€", "6000€"],
        },
        "INCASSI DELL'ANNO": {
            param1: ["GEN", "FEB", "MAR", "APR", "MAG", "GIU", "LUG", "AGO", "SET", "OTT", "NOV", "DIC"],
            param2List: null, 
            moneyList: ["10.000€", "12.000€", "15.000€", "13.000€", "17.000€", "20.000€", "22.000€", "19.000€", "21.000€", "25.000€", "27.000€", "30.000€"],
        },
    };

    const normalizedText = text.toUpperCase().trim();

    const handleMouseEnter = (event) => {
        setShowDetails(true);

        const box = event.target.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (box.bottom + 300 > windowHeight) {
            setPopupPosition("bottom-0 left-full ml-2");
        } else {
            setPopupPosition("top-0 left-full ml-2");
        }
    };

    const handleMouseLeave = () => {
        setTimeout(() => {
            if (!isHoveringPopup) {
                setShowDetails(false);
            }
        }, 200);
    };

    return (
        <div
            className="relative w-[290px] h-[100px] rounded-[20px] flex flex-col justify-center items-center text-center shadow-md py-3"
            style={{ backgroundColor: bgColor }}
        >
            {/* Titolo leggermente abbassato */}
            <p className="text-white font-marcellusSC text-[18px] cursor-pointer transition duration-300 hover:underline hover:underline-offset-4 mt-2">
                {text}
            </p>

            {/* Importo rialzato per allinearlo meglio */}
            <span className="text-white font-marcellusSC text-[28px] mt-2 mb-4">
                {money}
            </span>

            {/* Freccia spostata a destra e centrata verticalmente */}
            <FaChevronRight
                className="absolute right-4 top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-white cursor-pointer transition-transform duration-300 hover:translate-x-1"
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
                    <IncassiItemContainer
                        bgColor={bgColor}
                        params={testData[normalizedText] || { param1: [], param2List: [], moneyList: [] }}
                    />
                </div>
            )}
        </div>
    );
};
