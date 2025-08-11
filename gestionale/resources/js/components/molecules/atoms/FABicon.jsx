import React from "react";
import { FaPlus } from "react-icons/fa";
import { GoPlus } from "react-icons/go";

export const FABicon = ({ isOpen, isFAB=true, onClick }) => {
    if (isFAB) {
        //  Comportamento classico del FAB 
        return (
            <div
                onClick={onClick}
                className={`rounded-full ${isOpen ? "bg-gray-300" : "bg-bluSecondary"} w-[56px] h-[56px] flex justify-center items-center cursor-pointer transition-colors duration-300`}
            >
                <FaPlus color="white" size={26} />
            </div>
        );
    } else {
        //  Comportamento per pagina lista d'attesa
        return (
            <div
                onClick={onClick}
                className="bg-bluPrimary hover:bg-[#8CD1F4] w-[70px] h-[70px]  p-4 mr-4 rounded-full flex justify-center items-center cursor-pointer shadow-lg transition-all duration-300"
            >
              
                <GoPlus  color="white" size={36} />
            </div>
        );
    }
};
