import React from "react";
import { FaTrashAlt } from "react-icons/fa";

const ArchivioFirmeRow = ({ dati, onDelete, canEdit = true }) => {
    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 font-semibold text-gray-900">{dati.nome}</td>
            <td className="px-6 py-4">{dati.cognome}</td>
            <td className="px-6 py-4">{dati.data}</td>
            <td className="px-6 py-4">{dati.terapia}</td>
            <td className="px-6 py-4">{dati.terapista}</td>
            {canEdit ? (
                <td className="px-6 py-4">
                    <div className="flex justify-center">
                        <button
                            className="p-2 bg-red-100 hover:bg-red-200 rounded-lg shadow-sm"
                            onClick={() => onDelete(dati.id)}
                        >
                            <FaTrashAlt className="text-red-600 w-4 h-4" />
                        </button>
                    </div>
                </td>
            ) : null}
        </tr>
    );
};

export default ArchivioFirmeRow;
