import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { FaUserMd, FaEuroSign, FaClock, FaRegThumbsUp } from "react-icons/fa";
import { baseCall } from "@/data/api/baseCall";
import { IconInputWrapperModal } from "./atoms/iconInputWrapperModal";

const ModalContentTariffaInserimento = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        prezzo: "",
        durata: "",
    });

    const [terapistiOptions, setTerapistiOptions] = useState([]);
    const [terapiaOptions, setTerapiaOptions] = useState([]);

    const [terapistaSelezionato, setTerapistaSelezionato] = useState(null);
    const [terapiaSelezionata, setTerapiaSelezionata] = useState(null);

    useEffect(() => {
        fetchTerapisti();
        fetchTerapie();
    }, []);

    const fetchTerapisti = async () => {
    try {
        const response = await baseCall({
            endpoint: "/terapisti",
            method: "GET",
        });

       
        setTerapistiOptions(Object.values(response.data));
    } catch (error) {
        toast.error("Errore nel recupero terapisti");
    }
};


    const fetchTerapie = async () => {
        try {
            const response = await baseCall({
                endpoint: "/professioni/terapisti",
                method: "GET",
            });
            const options = Object.values(response.data).map((t) => ({
                value: t,
                label: t,
            }));
            setTerapiaOptions(options);
        } catch (error) {
            toast.error("Errore nel recupero terapie");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!terapistaSelezionato || !terapiaSelezionata || !formData.prezzo || !formData.durata) {
            toast.error("Compila tutti i campi");
            return;
        }

        try {
            await baseCall({
                endpoint: "/tariffe",
                method: "POST",
                data: {
                    utente_id: terapistaSelezionato.value,
                    terapia: terapiaSelezionata.value,
                    prezzo: parseFloat(formData.prezzo),
                    durata: parseInt(formData.durata),
                },
            });

            toast.success("Tariffa creata con successo");
            onSubmit?.();
            onClose();
        } catch (error) {
            toast.error("Errore durante la creazione della tariffa");
        }
    };

    const inputStyle = "flex-1 border-none outline-none text-[14px] placeholder-gray-400 font-marcellus";

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
                <h2 className="font-marcellusSC font-bold text-center text-[22px]">
                    NUOVA TARIFFA
                </h2>

                {/* Terapista */}
                <div>
                    <label className="text-sm text-gray-600 mb-1 font-marcellus">Terapista</label>
                    <Select
                        options={terapistiOptions}
                        value={terapistaSelezionato}
                        onChange={setTerapistaSelezionato}
                        placeholder="Seleziona terapista"
                        className="text-[14px]"
                    />
                </div>

                {/* Terapia */}
                <div>
                    <label className="text-sm text-gray-600 mb-1 font-marcellus">Terapia</label>
                    <Select
                        options={terapiaOptions}
                        value={terapiaSelezionata}
                        onChange={setTerapiaSelezionata}
                        placeholder="Seleziona terapia"
                        className="text-[14px]"
                    />
                </div>

                {/* Prezzo */}
                <IconInputWrapperModal icon={FaEuroSign}>
                    <input
                        name="prezzo"
                        type="number"
                        placeholder="Prezzo (€)"
                        className={inputStyle}
                        onChange={handleChange}
                    />
                </IconInputWrapperModal>

                {/* Durata */}
                <IconInputWrapperModal icon={FaClock}>
                    <input
                        name="durata"
                        type="number"
                        placeholder="Durata (minuti)"
                        className={inputStyle}
                        onChange={handleChange}
                    />
                </IconInputWrapperModal>
            </div>

            {/* Footer */}
            <div className="flex justify-between pt-4 border-t border-gray-200 pt-2">
                <button
                    onClick={onClose}
                    className="bg-gray-200 hover:bg-gray-300 px-8 py-2 rounded-[12px] font-marcellus text-gray-700 transition-colors duration-200"
                >
                    Chiudi
                </button>
                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-3 border border-gray-300 rounded-[12px] px-4 py-2 font-marcellus bg-white hover:bg-gray-100 text-gray-700"
                >
                    Aggiungi tariffa
                    <FaRegThumbsUp className="text-sm text-green-600" size={16} />
                </button>
            </div>
        </div>
    );
};

export default ModalContentTariffaInserimento;
