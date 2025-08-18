import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
    FaUser,
    FaCalendarAlt,
    FaRegClock,
    FaStickyNote,
    FaRegThumbsUp,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { baseCall } from "@/data/api/baseCall";
import { creaAppuntamento } from "@/data/api/appuntamenti";

import { IconInputWrapperModal } from "../molecules/atoms/iconInputWrapperModal.jsx";

const ModalContentAggiungiAppuntamento = ({ onClose, onSubmit }) => {
    const [utenteNonRegistrato, setUtenteNonRegistrato] = useState(false);
    const [pazienteSelezionato, setPazienteSelezionato] = useState(null);
    const [terapistaSelezionato, setTerapistaSelezionato] = useState(null);
    const [formData, setFormData] = useState({});
    const [pazientiOptions, setPazientiOptions] = useState([]);
    const [terapistiOptions, setTerapistiOptions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchPazienti();
        fetchTerapisti();
    }, []);

    const fetchPazienti = async () => {
        try {
            const response = await baseCall({
                endpoint: "/get-pazienti",
                method: "GET",
            });
            setPazientiOptions(Object.values(response.data));
        } catch (error) {
            toast.error("Errore nel recupero dei pazienti");
        }
    };

    const fetchTerapisti = async () => {
        try {
            const response = await baseCall({
                endpoint: "/terapisti",
                method: "GET",
            });
            setTerapistiOptions(Object.values(response.data));
        } catch (error) {
            toast.error("Errore nel recupero dei terapisti");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!terapistaSelezionato) {
            toast.error("Seleziona un terapista");
            return;
        }

        if (!utenteNonRegistrato && !pazienteSelezionato) {
            toast.error(
                "Seleziona un paziente o spunta 'utente non registrato'"
            );
            return;
        }

        const data = {
            data: formData.data,
            ora: formData.ora,
            note: formData.note,
            durata_minuti: formData.durata_minuti ? parseInt(formData.durata_minuti) : 30,
            terapista_id:
                terapistaSelezionato?.value || terapistaSelezionato?.id,
            ...(utenteNonRegistrato
                ? {
                      nome: formData.nome,
                      cognome: formData.cognome,
                  }
                : {
                      paziente_id: pazienteSelezionato.id,
                  }),
        };

        setIsSubmitting(true);
        try {
            await creaAppuntamento(data);
            toast.success("Appuntamento creato con successo!");
            window.dispatchEvent(new CustomEvent('calendar:refresh'));

            onSubmit?.(data);
            onClose();
        } catch (error) {
            toast.error("Errore durante la creazione dell'appuntamento");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle =
        "flex-1 border-none outline-none text-[14px] placeholder-gray-400 font-marcellus";

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
                <h2 className="font-marcellusSC font-bold text-center text-[22px]">
                    AGGIUNGI APPUNTAMENTO
                </h2>

                <label className="flex items-center gap-2 font-marcellus">
                    <input
                        type="checkbox"
                        checked={utenteNonRegistrato}
                        onChange={(e) => {
                            setUtenteNonRegistrato(e.target.checked);
                            setPazienteSelezionato(null);
                        }}
                    />
                    Utente non registrato
                </label>

                {!utenteNonRegistrato ? (
                    <div>
                        <label className="text-sm text-gray-600 mb-1 font-marcellus">
                            Paziente
                        </label>
                        <Select
                            options={pazientiOptions}
                            value={pazienteSelezionato}
                            onChange={setPazienteSelezionato}
                            placeholder="Seleziona un paziente"
                            className="text-[14px]"
                            getOptionLabel={(p) => `${p.nome} ${p.cognome}`}
                            getOptionValue={(p) => p.id}
                            isSearchable
                        />
                    </div>
                ) : (
                    <div className="flex flex-row gap-4">
                        <IconInputWrapperModal icon={FaUser} className="flex-1">
                            <input
                                name="nome"
                                placeholder="Nome"
                                className={inputStyle}
                                onChange={handleChange}
                            />
                        </IconInputWrapperModal>
                        <IconInputWrapperModal icon={FaUser} className="flex-1">
                            <input
                                name="cognome"
                                placeholder="Cognome"
                                className={inputStyle}
                                onChange={handleChange}
                            />
                        </IconInputWrapperModal>
                    </div>
                )}

                <IconInputWrapperModal icon={FaCalendarAlt}>
                    <input
                        type="date"
                        name="data"
                        className={inputStyle}
                        onChange={handleChange}
                        value={formData.data || ""}
                    />
                </IconInputWrapperModal>

                <IconInputWrapperModal icon={FaRegClock}>
                    <input
                        type="time"
                        name="ora"
                        className={inputStyle}
                        onChange={handleChange}
                        value={formData.ora || ""}
                    />
                </IconInputWrapperModal>
                <IconInputWrapperModal icon={FaRegClock}>
                    <input
                        type="number"
                        name="durata_minuti"
                        placeholder="Durata (minuti)"
                        min={5}
                        max={720}
                        className={inputStyle}
                        onChange={handleChange}
                        value={formData.durata_minuti || ""}
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
                        placeholder="Seleziona un terapista"
                        className="text-[14px]"
                        getOptionLabel={(p) =>
                            p.label || `${p.nome} ${p.cognome}`
                        }
                        getOptionValue={(p) => p.id || p.value}
                        isSearchable
                    />
                </div>

                <IconInputWrapperModal
                    icon={() => (
                        <FaStickyNote className="mb-[38px] text-gray-500" />
                    )}
                >
                    <textarea
                        name="note"
                        placeholder="Note"
                        rows={3}
                        className={`${inputStyle} resize-none`}
                        onChange={handleChange}
                    />
                </IconInputWrapperModal>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                    onClick={onClose}
                    className="bg-gray-200 hover:bg-gray-300 px-8 py-2 rounded-[12px] font-marcellus text-gray-700 transition-colors duration-200"
                    disabled={isSubmitting}
                >
                    Chiudi
                </button>

                <button
                    onClick={handleSubmit}
                    className={`flex items-center gap-3 border border-gray-300 rounded-[12px] px-4 py-2 font-marcellus transition duration-200 ${
                        isSubmitting
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-white hover:bg-gray-100 text-gray-700"
                    }`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Aggiungendo..." : "Aggiungi appuntamento"}
                    <FaRegThumbsUp
                        className="text-gray-700 text-sm"
                        size={16}
                        color="green"
                    />
                </button>
            </div>
        </div>
    );
};

export default ModalContentAggiungiAppuntamento;
