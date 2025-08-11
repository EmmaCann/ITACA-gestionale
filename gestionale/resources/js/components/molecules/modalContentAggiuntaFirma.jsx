import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUser, FaCalendarAlt, FaRegThumbsUp } from "react-icons/fa";
import Select from "react-select";
import { IconInputWrapperModal } from "./atoms/iconInputWrapperModal";

const ModalContentAggiuntaFirma = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        nome: "",
        cognome: "",
        data: "",
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
            const res = await axios.get("/terapisti");
            setTerapistiOptions(res.data);
        } catch {
            toast.error("Errore nel recupero terapisti");
        }
    };

    const fetchTerapie = async () => {
        try {
            const res = await axios.get("/professioni/terapisti");
            const options = Object.values(res.data).map((t) => ({
                value: t,
                label: t,
            }));
            setTerapiaOptions(options);
        } catch {
            toast.error("Errore nel recupero terapie");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const { nome, cognome, data } = formData;
        if (
            !nome ||
            !cognome ||
            !data ||
            !terapistaSelezionato ||
            !terapiaSelezionata
        ) {
            toast.error("Compila tutti i campi");
            return;
        }

        console.log("Dati inviati:", {
            nome,
            cognome,
            data,
            terapia: terapiaSelezionata.value,
            terapista_id: terapistaSelezionato.value,
        });

        try {
            await axios.post("/firme", {
                nome,
                cognome,
                data,
                terapia: terapiaSelezionata.value,
                terapista_id: terapistaSelezionato.value,
            });

            toast.success("Firma aggiunta con successo");
            onSubmit?.();
            onClose();
        } catch {
            toast.error("Errore durante la creazione della firma");
        }
    };

    const inputStyle =
        "flex-1 border-none outline-none text-[14px] placeholder-gray-400 font-marcellus";

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 pb-8">
                <h2 className="font-marcellusSC text-xl text-center">
                    AGGIUNGI FIRMA
                </h2>

                <IconInputWrapperModal icon={FaUser}>
                    <input
                        name="nome"
                        placeholder="Nome"
                        className={inputStyle}
                        onChange={handleChange}
                    />
                </IconInputWrapperModal>

                <IconInputWrapperModal icon={FaUser}>
                    <input
                        name="cognome"
                        placeholder="Cognome"
                        className={inputStyle}
                        onChange={handleChange}
                    />
                </IconInputWrapperModal>

                <IconInputWrapperModal icon={FaCalendarAlt}>
                    <input
                        type="date"
                        name="data"
                        className={inputStyle}
                        onChange={handleChange}
                    />
                </IconInputWrapperModal>

                <div>
                    <label className="text-sm text-gray-600 mb-1 font-marcellus">
                        Terapista
                    </label>
                    <Select
                        options={terapistiOptions}
                        value={terapistaSelezionato}
                        onChange={setTerapistaSelezionato}
                        placeholder="Seleziona terapista"
                        className="text-[14px]"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600 mb-1 font-marcellus">
                        Terapia
                    </label>
                    <Select
                        options={terapiaOptions}
                        value={terapiaSelezionata}
                        onChange={setTerapiaSelezionata}
                        placeholder="Seleziona terapia"
                        className="text-[14px]"
                    />
                </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                    onClick={onClose}
                    className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded text-sm text-gray-700 font-marcellus"
                >
                    Chiudi
                </button>
                <button
                    onClick={handleSubmit}
                    className="bg-white hover:bg-gray-100 border border-gray-300 px-6 py-2 rounded text-sm text-gray-700 font-marcellus flex items-center gap-2"
                >
                    Aggiungi Firma
                    <FaRegThumbsUp className="text-green-600" />
                </button>
            </div>
        </div>
    );
};

export default ModalContentAggiuntaFirma;
