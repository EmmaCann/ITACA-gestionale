import React, { useEffect, useState } from "react";
import Select from "react-select";
import { FaUser, FaCalendarAlt, FaRegThumbsUp } from "react-icons/fa";
import { MdEuro } from "react-icons/md";
import { toast } from "react-toastify";
import { baseCall } from "../../data/api/baseCall";
import { creaPagamento } from "@/data/api/pagamenti";
import { IconInputWrapperModal } from "./atoms/iconInputWrapperModal.jsx";

const ModalContentAggiungiPagamento = ({ onClose, onSubmit }) => {
    const [terapistiOptions, setTerapistiOptions] = useState([]);
    const [pazientiOptions, setPazientiOptions] = useState([]);
    const [terapistaSelezionato, setTerapistaSelezionato] = useState(null);
    const [pazienteSelezionato, setPazienteSelezionato] = useState(null);
    const [utenteNonRegistrato, setUtenteNonRegistrato] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fattura, setFattura] = useState(false);

    const [formData, setFormData] = useState({
        nome: "",
        cognome: "",
        data: "",
        importo: "",
        note: "",
    });

    useEffect(() => {
        fetchTerapisti();
        fetchPazienti();
    }, []);

    const fetchTerapisti = async () => {
        try {
            const response = await baseCall({
                endpoint: "/terapisti",
                method: "GET",
            });

            setTerapistiOptions(Object.values(response.data));
        } catch (error) {
            toast.error("Errore nel recupero dei terapisti");
            console.error("Errore terapisti:", error);
        }
    };

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
                "Seleziona un paziente registrato o spunta 'utente non registrato'"
            );
            return;
        }

        const data = {
            terapista_id:
                terapistaSelezionato?.value || terapistaSelezionato?.id,
            data: formData.data,
            importo: formData.importo,
            note: formData.note,
            fattura: fattura ? 1 : 0,
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
            console.log("🧾 Data inviata:", data);

            await creaPagamento(data);
            toast.success("Pagamento aggiunto con successo!");
            onSubmit?.(data);
            onClose();
        } catch (error) {
            toast.error("Errore durante l'aggiunta del pagamento");
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
                    AGGIUNGI PAGAMENTO
                </h2>

                {/* Checkbox */}
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

                {/* Paziente selezionato o input nome/cognome */}
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
                            menuPlacement="auto"
                            maxMenuHeight={100}
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

                {/* Data */}
                <div>
                    <label className="text-sm text-gray-600 mb-1 font-marcellus">
                        Data della prestazione
                    </label>
                    <IconInputWrapperModal icon={FaCalendarAlt}>
                        <input
                            type="date"
                            name="data"
                            className={inputStyle}
                            onChange={handleChange}
                            value={formData.data || ""}
                        />
                    </IconInputWrapperModal>
                </div>

                {/* Importo */}
                <div className="flex flex-row gap-4  w-full">
                    <IconInputWrapperModal icon={MdEuro}>
                        <input
                            type="number"
                            name="importo"
                            placeholder="Importo (€)"
                            className={inputStyle}
                            onChange={handleChange}
                        />
                    </IconInputWrapperModal>

                    <label className="flex items-center gap-2 font-marcellus">
                        <input
                            type="checkbox"
                            checked={fattura}
                            onChange={(e) => setFattura(e.target.checked)}
                        />
                        Fattura
                    </label>
                </div>
                <div>
                    <label className="text-sm text-gray-600 mb-1 font-marcellus">
                        Note
                    </label>
                    <textarea
                        name="note"
                        rows={3}
                        placeholder="Note"
                        className="w-full border border-gray-300 rounded-[12px] px-3 py-2 text-[14px] font-marcellus resize-none"
                        value={formData.note}
                        onChange={handleChange}
                    />
                </div>

                {/* Terapista */}
                <div>
                    <label className="text-sm text-gray-600 mb-1 font-marcellus">
                        Terapista
                    </label>
                    <Select
                        options={
                            Array.isArray(terapistiOptions)
                                ? terapistiOptions
                                : []
                        }
                        value={terapistaSelezionato}
                        onChange={setTerapistaSelezionato}
                        placeholder="Seleziona un terapista"
                        className="text-[14px]"
                        menuPlacement="auto"
                        maxMenuHeight={100}
                    />
                </div>
            </div>

            {/* Footer */}
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
                    {isSubmitting ? "Aggiungendo..." : "Aggiungi importo"}
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

export default ModalContentAggiungiPagamento;
