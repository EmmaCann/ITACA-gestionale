import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
    FaUser,
    FaCalendarAlt,
    FaPhoneAlt,
    FaRegThumbsUp,
} from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { creaUtente } from "@/data/api/utenti";
import { baseCall } from "../../data/api/baseCall";
import { IconInputWrapperModal } from "../molecules/atoms/iconInputWrapperModal.jsx";


const ModalContentAggiungiUtente = ({
    tipoIniziale = "paziente",
    onSubmit,
    onClose,
}) => {
    const [tipoUtente, setTipoUtente] = useState(tipoIniziale);
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [terapistiOptions, setTerapistiOptions] = useState([]);
    const [terapistaSelezionato, setTerapistaSelezionato] = useState(null);

    useEffect(() => {
        setTipoUtente(tipoIniziale);
        setFormData({});
        setTerapistaSelezionato(null);
    }, [tipoIniziale]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const tipoOptions = [
        { value: "paziente", label: "Paziente" },
        { value: "staff", label: "Staff" },
    ];

    useEffect(() => {
        if (tipoUtente === "paziente") {
            fetchTerapisti();
        }
    }, [tipoUtente]);

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

    const handleTipoChange = (option) => {
        setTipoUtente(option.value);
        setFormData({});
        setTerapistaSelezionato(null);
    };

    const handleSubmit = async () => {
        const data = {
            tipoUtente,
            ...formData,
            ...(tipoUtente === "paziente" && {
                terapista: terapistaSelezionato,
            }),
        };

        setIsSubmitting(true);

        try {
            const response = await creaUtente(data);
            toast.success("Utente creato con successo!");
            onSubmit?.(response);
            onClose();
        } catch (error) {
            console.error("Errore completo:", error);
            if (error.response?.data?.errors) {
                const validationErrors = error.response.data.errors;
                Object.values(validationErrors).forEach((messages) =>
                    messages.forEach((msg) => toast.error(msg))
                );
            } else {
                toast.error(
                    "Errore nella creazione: " +
                        (error.message || "Errore sconosciuto")
                );
            }
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
                    AGGIUNGI NUOVO {tipoUtente.toUpperCase()}
                </h2>

                <div className="w-[40%]">
                    <Select
                        options={tipoOptions}
                        value={tipoOptions.find(
                            (opt) => opt.value === tipoUtente
                        )}
                        onChange={handleTipoChange}
                        className="text-[14px]"
                    />
                </div>

                {/* Nome + Cognome */}
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

                {/* Data di nascita + Telefono */}
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col flex-1">
                        <label className="text-sm text-gray-600 mb-1 font-marcellus">
                            Data di nascita
                        </label>
                        <IconInputWrapperModal icon={FaCalendarAlt}>
                            <input
                                type="date"
                                name="dataNascita"
                                className={inputStyle}
                                onChange={handleChange}
                                value={formData.dataNascita || ""}
                            />
                        </IconInputWrapperModal>
                    </div>
                    {/* Sesso */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600 mb-1 font-marcellus">
                            Sesso
                        </label>
                        <Select
                            name="sesso"
                            options={[
                                { value: "M", label: "Maschio (M)" },
                                { value: "F", label: "Femmina (F)" },
                            ]}
                            value={
                                formData.sesso
                                    ? {
                                          value: formData.sesso,
                                          label:
                                              formData.sesso === "M"
                                                  ? "Maschio (M)"
                                                  : "Femmina (F)",
                                      }
                                    : null
                            }
                            onChange={(option) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    sesso: option ? option.value : null,
                                }))
                            }
                            placeholder="Seleziona sesso"
                            className="text-[14px] w-[200px]"
                            menuPlacement="auto"
                        />
                    </div>
                </div>
                <div className="flex flex-col flex-1">
                    <label className="text-sm text-gray-600 mb-1 ml-2 invisible">
                        Telefono
                    </label>
                    <IconInputWrapperModal icon={FaPhoneAlt}>
                        <input
                            name="telefono"
                            placeholder="Telefono"
                            className={inputStyle}
                            onChange={handleChange}
                        />
                    </IconInputWrapperModal>
                </div>

                {/* Email */}
                <IconInputWrapperModal icon={MdOutlineEmail}>
                    <input
                        name="email"
                        placeholder="Email"
                        className={inputStyle}
                        onChange={handleChange}
                    />
                </IconInputWrapperModal>

                {/* Terapista o Professione */}
                {tipoUtente === "paziente" ? (
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
                ) : (
                    <IconInputWrapperModal icon={FaUser}>
                        <input
                            name="professione"
                            placeholder="Professione"
                            className={inputStyle}
                            onChange={handleChange}
                        />
                    </IconInputWrapperModal>
                )}

                {/* Diagnosi */}
                {tipoUtente === "paziente" && (
                    <IconInputWrapperModal>
                        <textarea
                            name="diagnosi"
                            placeholder="Diagnosi"
                            rows={3}
                            className={`${inputStyle} resize-none`}
                            onChange={handleChange}
                        />
                    </IconInputWrapperModal>
                )}
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
                    {isSubmitting ? "Aggiungendo..." : "Aggiungi utente!"}
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

export default ModalContentAggiungiUtente;
