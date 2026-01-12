import React, { useState, useEffect } from "react";
import Select from "react-select";
import { IconInputWrapperModal } from "./atoms/iconInputWrapperModal.jsx";
import { FaUser, FaRegBell } from "react-icons/fa";
import CustomModal from "../customModal.jsx";
import { toast } from "react-toastify";
import {
    inviaNotifica,
    getUtentiPerNotifica,
} from "../../data/api/notifiche.js";

const destinatariOptions = [
    { value: "tutti", label: "Tutti gli utenti" },
    { value: "staff", label: "Tutto lo staff" },
    { value: "pazienti", label: "Tutti i pazienti" },
    { value: "singolo", label: "Utente specifico" },
];

const urgenzaOptions = [
    { value: "bassa", label: "Bassa" },
    { value: "media", label: "Media" },
    { value: "alta", label: "Alta" },
];

const tipoOptions = [
    { value: "generica", label: "Generica" },
    { value: "avviso", label: "Avviso" },
    { value: "alert", label: "Alert" },
    { value: "sistema", label: "Sistema" },
];

const ModalContentInviaNotifica = ({ isOpen, onRequestClose }) => {
    const [destinatario, setDestinatario] = useState(null);
    const [utenteSingolo, setUtenteSingolo] = useState("");
    const [messaggio, setMessaggio] = useState("");
    const [urgenza, setUrgenza] = useState(null);
    const [tipologia, setTipologia] = useState(null);
    const [utentiOptions, setUtentiOptions] = useState([]);
    const [utenteSelezionato, setUtenteSelezionato] = useState(null);

    const inputStyle =
        "flex-1 border-none outline-none text-[14px] placeholder-gray-400 font-marcellus";

    const resetForm = () => {
        setDestinatario(null);
        setUtenteSelezionato(null);
        setUtentiOptions([]);
        setMessaggio("");
        setUrgenza(null);
        setTipologia(null);
    };

    const handleSubmit = async () => {
        if (!destinatario) {
            return toast.error("Seleziona un destinatario");
        }

        if (destinatario.value === "singolo" && !utenteSelezionato) {
            return toast.error("Seleziona un utente");
        }

        if (!messaggio.trim()) {
            return toast.error("Inserisci un messaggio");
        }

        const payload = {
            destinatario: destinatario.value,
            messaggio,
            urgenza: urgenza?.value || null,
            tipologia: tipologia?.value || null,
            utente_id:
                destinatario.value === "singolo"
                    ? utenteSelezionato?.id
                    : null,
        };

        try {
            await inviaNotifica(payload);
            toast.success("Notifica inviata correttamente");
            resetForm();
            onRequestClose();
        } catch (error) {
            toast.error("Errore durante l'invio della notifica");
        }
    };

    useEffect(() => {
        if (destinatario?.value !== "singolo") return;
        const fetchUtenti = async () => {
            try {
                const utenti = await getUtentiPerNotifica();

                const lista = Array.isArray(utenti.data)
                    ? utenti.data
                    : Object.values(utenti.data || {});

                setUtentiOptions(lista);
            } catch (error) {
                setUtentiOptions([]);
                toast.error("Errore nel caricamento utenti");
            }
        };

        fetchUtenti();
    }, [destinatario]);

    const handleChangeDestinatario = (value) => {
        setDestinatario(value);
        setUtenteSelezionato(null);
        setUtentiOptions([]);
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title="Invia Notifica"
            className="modal-notifica"
        >
            <div className="flex flex-col h-full overflow-hidden">
                {/* --- SCROLL AREA --- */}
                <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
                    <h2 className="font-marcellusSC font-bold text-center text-[22px]">
                        INVIA NOTIFICA
                    </h2>

                    {/* DESTINATARIO */}
                    <div>
                        <label className="text-sm text-gray-600 mb-1 font-marcellus">
                            Destinatario
                        </label>
                        <Select
                            options={destinatariOptions}
                            value={destinatario}
                            onChange={handleChangeDestinatario}
                            placeholder="Seleziona destinatario"
                        />
                    </div>

                    {/* UTENTE SPECIFICO */}
                    {destinatario?.value === "singolo" && (
                        <div>
                            <label className="text-sm text-gray-600 mb-1 font-marcellus">
                                Seleziona utente
                            </label>

                            <Select
                                options={
                                    Array.isArray(utentiOptions)
                                        ? utentiOptions
                                        : []
                                }
                                value={utenteSelezionato}
                                onChange={setUtenteSelezionato}
                                placeholder="Cerca o seleziona un utente"
                                isSearchable
                                getOptionLabel={(u) => `${u.nome} ${u.cognome}`}
                                getOptionValue={(u) => u.id}
                            />
                        </div>
                    )}

                    {/* MESSAGGIO */}
                    <div>
                        <label className="text-sm text-gray-600 mb-1 font-marcellus">
                            Messaggio
                        </label>
                        <textarea
                            placeholder="Scrivi la notifica..."
                            className="w-full p-3 border rounded-lg text-[14px] font-marcellus"
                            rows={4}
                            value={messaggio}
                            onChange={(e) => setMessaggio(e.target.value)}
                        />
                    </div>

                    {/* URGENZA */}
                    <div>
                        <label className="text-sm text-gray-600 mb-1 font-marcellus">
                            Urgenza
                        </label>
                        <Select
                            options={urgenzaOptions}
                            value={urgenza}
                            onChange={setUrgenza}
                            placeholder="Seleziona urgenza"
                            className="text-[14px]"
                        />
                    </div>

                    {/* TIPOLOGIA */}
                    <div>
                        <label className="text-sm text-gray-600 mb-1 font-marcellus">
                            Tipologia
                        </label>
                        <Select
                            options={tipoOptions}
                            value={tipologia}
                            onChange={setTipologia}
                            placeholder="Tipologia notifica"
                            className="text-[14px]"
                        />
                    </div>
                </div>

                {/* --- FOOTER --- */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                    <button
                        onClick={onRequestClose}
                        className="bg-gray-200 hover:bg-gray-300 px-8 py-2 rounded-[12px] font-marcellus text-gray-700 transition-colors duration-200"
                    >
                        Chiudi
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-3 border border-gray-300 rounded-[12px] px-4 py-2 font-marcellus transition duration-200 bg-white hover:bg-gray-100 text-gray-700"
                    >
                        Invia
                        <FaRegBell
                            className="text-gray-700 text-sm"
                            size={16}
                        />
                    </button>
                </div>
            </div>
        </CustomModal>
    );
};

export default ModalContentInviaNotifica;
