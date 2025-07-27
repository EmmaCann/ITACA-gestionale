import React, { useState } from "react";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import CustomModal from "@/components/CustomModal";
import ModalContentTariffaModifica from "./ModalContentTariffaModifica";
import { baseCall } from "@/data/api/baseCall";
import { toast } from "react-toastify";

const TariffarioRow = ({ dati, onUpdated }) => {
    const [modalEditOpen, setModalEditOpen] = useState(false);

   const handleDelete = async () => {
    if (!confirm("Sei sicuro di voler eliminare questa tariffa?")) return;

    try {
        await baseCall({
            endpoint: `/tariffe/${dati.id}`,
            method: "DELETE"
        });

        toast.success("Tariffa eliminata con successo.");
        onUpdated?.(); // Ricarica i dati
    } catch (error) {
        console.error("Errore eliminazione:", error);
        toast.error("Errore durante l'eliminazione.");
    }
};

    const formatData = (rawDate) => {
        const date = new Date(rawDate);
        return date.toISOString().split("T")[0];
    };

    return (
        <>
            <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">
                    {dati.terapista?.nome} {dati.terapista?.cognome}
                </td>
                <td className="px-6 py-4">{dati.terapia}</td>
                <td className="px-6 py-4 text-pinkPrimary font-bold">
                    €{parseFloat(dati.prezzo).toFixed(2)}
                </td>
                <td className="px-6 py-4">{dati.durata}</td>
                <td className="px-6 py-4">
                    {dati.updated_at ? formatData(dati.updated_at) : "—"}
                </td>
                <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                        <button
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm"
                            onClick={() => setModalEditOpen(true)}
                        >
                            <FaRegEdit className="text-gray-700 w-4 h-4" />
                        </button>
                        <button
                            className="p-2 bg-red-100 hover:bg-red-200 rounded-lg shadow-sm"
                            onClick={handleDelete}
                        >
                            <FaTrashAlt className="text-red-600 w-4 h-4" />
                        </button>
                    </div>
                </td>
            </tr>

            {/* Modal modifica */}
            <CustomModal
                isOpen={modalEditOpen}
                onRequestClose={() => setModalEditOpen(false)}
                title="Modifica Tariffa"
                className="max-w-xl"
            >
                <ModalContentTariffaModifica
                    tariffa={dati}
                    onClose={() => setModalEditOpen(false)}
                    onSubmit={() => {
                        setModalEditOpen(false);
                        onUpdated?.();
                    }}
                />
            </CustomModal>
        </>
    );
};

export default TariffarioRow;
