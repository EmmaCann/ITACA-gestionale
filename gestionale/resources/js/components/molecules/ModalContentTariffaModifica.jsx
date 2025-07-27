import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { FaRegThumbsUp } from "react-icons/fa";
import { baseCall } from "@/data/api/baseCall";

const ModalContentTariffaModifica = ({ onClose, onSubmit, tariffa }) => {
    const [terapistiOptions, setTerapistiOptions] = useState([]);
    const [terapistaSelezionato, setTerapistaSelezionato] = useState(null);
    const [terapia, setTerapia] = useState(tariffa.terapia || "");
    const [prezzo, setPrezzo] = useState(tariffa.prezzo || "");
    const [durata, setDurata] = useState(tariffa.durata || "");

    const handleSubmit = async () => {
        if (!terapistaSelezionato || !terapia || !prezzo || !durata) {
            toast.error("Compila tutti i campi obbligatori.");
            return;
        }

        const payload = {
            id: tariffa.id,
            utente_id: terapistaSelezionato.value,
            terapia,
            prezzo,
            durata,
        };

        try {
            await baseCall({
                endpoint: `/tariffe/update/${tariffa.id}`,
                method: "POST",
                data: payload,
            });

            toast.success("Tariffa aggiornata con successo.");
            onSubmit?.();
            onClose();
        } catch (error) {
            toast.error("Errore durante l'aggiornamento.");
        }
    };

    const fetchTerapisti = async () => {
        try {
            const response = await baseCall({
                endpoint: "/terapisti",
                method: "GET",
            });

            const data = Object.values(response.data);
            setTerapistiOptions(data);

            const found = data.find((opt) => opt.value === tariffa.utente_id);
            if (found) setTerapistaSelezionato(found);
        } catch (err) {
            toast.error("Errore nel recupero terapisti.");
        }
    };

    useEffect(() => {
        fetchTerapisti();
    }, []);

    const inputClass = "w-full border border-gray-300 rounded px-4 py-2 text-sm";

    return (
        <div className="flex flex-col gap-4 p-2 py-4 max-h-[60vh] overflow-y-auto  custom-scrollbar">
            <h2 className="text-center text-xl font-bold font-marcellusSC">
                MODIFICA TARIFFA
            </h2>

            <div>
                <label className="block text-sm mb-1">Terapista</label>
                <Select
                    options={terapistiOptions}
                    value={terapistaSelezionato}
                    onChange={setTerapistaSelezionato}
                    placeholder="Seleziona terapista"
                />
            </div>

            <div>
                <label className="block text-sm mb-1">Terapia</label>
                <input
                    className={inputClass}
                    value={terapia}
                    onChange={(e) => setTerapia(e.target.value)}
                    placeholder="Terapia"
                />
            </div>

            <div>
                <label className="block text-sm mb-1">Prezzo (€)</label>
                <input
                    className={inputClass}
                    value={prezzo}
                    onChange={(e) => setPrezzo(e.target.value)}
                    placeholder="Prezzo"
                    type="number"
                    step="0.01"
                />
            </div>

            <div>
                <label className="block text-sm mb-1">Durata (minuti)</label>
                <input
                    className={inputClass}
                    value={durata}
                    onChange={(e) => setDurata(e.target.value)}
                    placeholder="Durata"
                    type="number"
                />
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                    onClick={onClose}
                    className="bg-gray-200 hover:bg-gray-300 px-8 py-2 rounded-[12px] font-marcellus text-gray-700 transition"
                >
                    Chiudi
                </button>

                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-3 border border-gray-300 rounded-[12px] px-4 py-2 font-marcellus bg-white hover:bg-gray-100 text-gray-700"
                >
                    Salva
                    <FaRegThumbsUp className="text-green-600" size={16} />
                </button>
            </div>
        </div>
    );
};

export default ModalContentTariffaModifica;
