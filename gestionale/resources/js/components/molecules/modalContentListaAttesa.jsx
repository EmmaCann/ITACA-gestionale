import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import {
    FaUser,
    FaPhoneAlt,
    FaCalendarAlt,
    FaRegThumbsUp,
} from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { baseCall } from "@/data/api/baseCall";
import { IconInputWrapperModal } from "./atoms/iconInputWrapperModal.jsx";
import { creaVoceListaAttesa } from "@/data/api/listaAttesa";

const ModalContentListaAttesa = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({});
    const [dataInserimento, setDataInserimento] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [richiestaTerapista, setRichiestaTerapista] = useState(false);
    const [utenteRegistrato, setUtenteRegistrato] = useState(false);

    const [terapistiOptions, setTerapistiOptions] = useState([]);
    const [terapiaOptions, setTerapiaOptions] = useState([]);
    const [utentiOptions, setUtentiOptions] = useState([]);

    const [terapistaSelezionato, setTerapistaSelezionato] = useState(null);
    const [terapiaSelezionata, setTerapiaSelezionata] = useState(null);
    const [utenteSelezionato, setUtenteSelezionato] = useState(null);

    const isSubmitting = false;

    useEffect(() => {
        fetchTerapisti();
        fetchTerapie();
        fetchUtenti();
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

    const fetchUtenti = async () => {
        try {
            const response = await baseCall({
                endpoint: "/get-pazienti",
                method: "GET",
            });
            setUtentiOptions(Object.values(response.data));
        } catch (error) {
            toast.error("Errore nel recupero utenti");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!terapiaSelezionata) {
            toast.error("Seleziona una terapia");
            return;
        }

        const payload = {
            nome: formData.nome,
            cognome: formData.cognome,
            telefono: formData.telefono,
            email: formData.email,
            data: dataInserimento,
            terapia: terapiaSelezionata.value,
            terapista_id: richiestaTerapista
                ? terapistaSelezionato?.id ?? terapistaSelezionato?.value
                : null,
            chiamato: false,
            utente_id: utenteRegistrato ? utenteSelezionato?.id : null,
        };
        console.log("Payload:", payload);
        try {
            await creaVoceListaAttesa(payload);
            toast.success("Utente inserito in lista d'attesa");
            onSubmit?.(payload);
            onClose();
        } catch (error) {
            toast.error("Errore nell'inserimento in lista");
        }
    };

    const inputStyle =
        "flex-1 border-none outline-none text-[14px] placeholder-gray-400 font-marcellus";

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
                <h2 className="font-marcellusSC font-bold text-center text-[22px]">
                    INSERISCI IN LISTA D'ATTESA
                </h2>

                {/* Check utente registrato */}
                <label className="flex items-center gap-2 font-marcellus">
                    <input
                        type="checkbox"
                        checked={utenteRegistrato}
                        onChange={(e) => {
                            setUtenteRegistrato(e.target.checked);
                            setFormData({});
                        }}
                    />
                    Utente registrato
                </label>

                {/* Selezione utente o input nome/cognome */}
                {utenteRegistrato ? (
                    <Select
                        options={utentiOptions}
                        value={utenteSelezionato}
                        onChange={setUtenteSelezionato}
                        placeholder="Seleziona utente"
                        className="text-[14px]"
                        getOptionLabel={(u) => `${u.nome} ${u.cognome}`}
                        getOptionValue={(u) => u.id}
                        isSearchable
                    />
                ) : (
                    <>
                        <div className="flex gap-4">
                            <IconInputWrapperModal
                                icon={FaUser}
                                className="flex-1"
                            >
                                <input
                                    name="nome"
                                    placeholder="Nome"
                                    className={inputStyle}
                                    onChange={handleChange}
                                />
                            </IconInputWrapperModal>
                            <IconInputWrapperModal
                                icon={FaUser}
                                className="flex-1"
                            >
                                <input
                                    name="cognome"
                                    placeholder="Cognome"
                                    className={inputStyle}
                                    onChange={handleChange}
                                />
                            </IconInputWrapperModal>
                        </div>
                        <IconInputWrapperModal icon={FaPhoneAlt}>
                            <input
                                name="telefono"
                                placeholder="Telefono"
                                className={inputStyle}
                                onChange={handleChange}
                            />
                        </IconInputWrapperModal>
                        <IconInputWrapperModal icon={MdOutlineEmail}>
                            <input
                                name="email"
                                placeholder="Email"
                                className={inputStyle}
                                onChange={handleChange}
                            />
                        </IconInputWrapperModal>
                    </>
                )}

                {/* Data */}
                <IconInputWrapperModal icon={FaCalendarAlt}>
                    <input
                        type="date"
                        value={dataInserimento}
                        onChange={(e) => setDataInserimento(e.target.value)}
                        className={inputStyle}
                    />
                </IconInputWrapperModal>

                {/* Terapia */}
                <div>
                    <label className="text-sm text-gray-600 mb-1 font-marcellus">
                        Terapia richiesta
                    </label>
                    <Select
                        options={terapiaOptions}
                        value={terapiaSelezionata}
                        onChange={setTerapiaSelezionata}
                        placeholder="Seleziona terapia"
                        className="text-[14px]"
                    />
                </div>

                {/* Richiesta terapista */}
                <label className="flex items-center gap-2 font-marcellus ">
                    <input
                        type="checkbox"
                        checked={richiestaTerapista}
                        onChange={(e) => {
                            setRichiestaTerapista(e.target.checked);
                            if (!e.target.checked)
                                setTerapistaSelezionato(null);
                        }}
                    />
                    Richiesta terapista
                </label>

                {richiestaTerapista && (
                    <div className="pb-4">
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
                )}
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
                    Inserisci
                    <FaRegThumbsUp
                        className="text-sm text-green-600"
                        size={16}
                    />
                </button>
            </div>
        </div>
    );
};

export default ModalContentListaAttesa;
