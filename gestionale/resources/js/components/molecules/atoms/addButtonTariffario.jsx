import React from "react";
import { FiPlus } from "react-icons/fi";

const AddButtonTariffario = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-pinkSecondary hover:bg-pinkPrimary text-white font-semibold py-2 px-6 rounded flex items-center gap-2"
        >
            <FiPlus className="text-lg" />
            Aggiungi Tariffa
        </button>
    );
};

export default AddButtonTariffario;
