import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUser, FaCalendarAlt, FaRegThumbsUp } from "react-icons/fa";
import Select from "react-select";
import { IconInputWrapperModal } from "./atoms/iconInputWrapperModal";

const ModalContentAggiuntaFirma = ({ onClose, onSubmit }) => {
    const [utenteNonRegistrato, setUtenteNonRegistrato] = useState(false);

    const [pazientiOptions, setPazientiOptions] = useState([]);
    const [pazienteSelezionato, setPazienteSelezionato] = useState(null);

    const [terapistiOptions, setTerapistiOptions] = useState([]);
    const [terapistaSelezionato, setTerapistaSelezionato] = useState(null);

    const [terapiaOptions, setTerapiaOptions] = useState([]);
    const [terapiaSelezionata, setTerapiaSelezionata] = useState(null);

    const [formData, setFormData] = useState({
        nome: "",
        cognome: "",
        data: "",
        note: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchPazienti();
        fetchTerapisti();
        fetchTerapie();
    }, []);

    const fetchPazienti = async () => {
        try {
            const res = await axios.get("/get-pazienti");
            setPazientiOptions(Object.values(res.data));
        } catch {
            toast.error("Errore nel recupero dei pazienti");
        }
    };

    const fetchTerapisti = async () => {
        try {
            const res = await axios.get("/terapisti");
            setTerapistiOptions(Object.values(res.data));
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
        if (!terapistaSelezionato) {
            toast.error("Seleziona un terapista");
            return;
        }
        if (!terapiaSelezionata) {
            toast.error("Seleziona una terapia");
            return;
        }
        if (!formData.data) {
            toast.error("Seleziona la data");
            return;
        }

        if (!utenteNonRegistrato && !pazienteSelezionato) {
            toast.error(
                "Seleziona un paziente o spunta 'utente non registrato'"
            );
            return;
        }

        if (utenteNonRegistrato && (!formData.nome || !formData.cognome)) {
            toast.error("Inserisci nome e cognome");
            return;
        }

        const payload = {
            data: formData.data,
            terapia: terapiaSelezionata.value,
            note: formData.note,
            terapista_id: terapistaSelezionato.value ?? terapistaSelezionato.id,
            ...(utenteNonRegistrato
                ? { nome: formData.nome, cognome: formData.cognome }
                : { paziente_id: pazienteSelezionato.id }),
        };

        setIsSubmitting(true);
        try {
            await axios.post("/firme", payload);
            toast.success("Firma aggiunta con successo");
            onSubmit?.();
            onClose();
        } catch (e) {
            toast.error("Errore durante la creazione della firma");
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle =
        "flex-1 border-none outline-none text-[14px] placeholder-gray-400 font-marcellus";

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 pb-2">
                <h2 className="font-marcellusSC font-bold text-center text-[22px]">
                    AGGIUNGI FIRMA
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
                                value={formData.nome}
                            />
                        </IconInputWrapperModal>

                        <IconInputWrapperModal icon={FaUser} className="flex-1">
                            <input
                                name="cognome"
                                placeholder="Cognome"
                                className={inputStyle}
                                onChange={handleChange}
                                value={formData.cognome}
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
                        value={formData.data}
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
                <div>
                    <label className="text-sm text-gray-600 mb-1 font-marcellus">
                        Note
                    </label>
                    <textarea
                        name="note"
                        rows={3}
                        placeholder="Note "
                        className="w-full border border-gray-300 rounded-[12px] px-3 py-2 text-[14px] font-marcellus resize-none"
                        value={formData.note}
                        onChange={handleChange}
                    />
                </div>
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
                    {isSubmitting ? "Aggiungendo..." : "Aggiungi firma"}
                    <FaRegThumbsUp size={16} color="green" />
                </button>
            </div>
        </div>
    );
};

export default ModalContentAggiuntaFirma;
