import React, { useState, useEffect } from "react";
import Select from "react-select";
import { FaUser } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegThumbsUp } from "react-icons/fa6";
const ModalContentAggiungiUtente = ({
    tipoIniziale = "paziente",
    onSubmit,
    onClose,
}) => {
    const [tipoUtente, setTipoUtente] = useState(tipoIniziale);
    const [formData, setFormData] = useState({});
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

    const terapistiOptions = [
        { value: "rossi", label: "Dr. Mario Rossi" },
        { value: "bianchi", label: "Dr.ssa Lucia Bianchi" },
        { value: "verdi", label: "Dr. Giovanni Verdi" },
    ];

    const handleTipoChange = (option) => {
        setTipoUtente(option.value);
        setFormData({});
        setTerapistaSelezionato(null);
    };

    const handleSubmit = () => {
        const data = {
            tipoUtente,
            ...formData,
            ...(tipoUtente === "paziente" && {
                terapista: terapistaSelezionato,
            }),
        };
        onSubmit(data);
        onClose();
    };

    const inputWrapper =
        "flex items-center gap-3 border border-gray-300 rounded-[12px] px-4 py-2 bg-white";
    const inputStyle =
        "flex-1 border-none outline-none  text-[14px] placeholder-gray-400 font-marcellus";

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Contenuto scrollabile */}
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
                    <div className={inputWrapper + " flex-1"}>
                        <FaUser className="text-gray-500" size={14} />
                        <input
                            name="nome"
                            placeholder="Nome"
                            className={inputStyle}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={inputWrapper + " flex-1"}>
                        <FaUser className="text-gray-500" size={14} />
                        <input
                            name="cognome"
                            placeholder="Cognome"
                            className={inputStyle}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Data di nascita + Telefono */}
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col flex-1">
                        <label className="text-sm text-gray-600 mb-1 font-marcellus ">
                            Data di nascita
                        </label>
                        <div className={inputWrapper}>
                            <FaCalendarAlt
                                className="text-gray-500 "
                                size={14}
                            />
                            <input
                                type="date"
                                name="dataNascita"
                                className={inputStyle}
                                onChange={handleChange}
                                value={formData.dataNascita || ""}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col flex-1">
                        <label className="text-sm text-gray-600 mb-1 ml-2 invisible">
                            Telefono
                        </label>
                        <div className={inputWrapper}>
                            <FaPhoneAlt className="text-gray-500" size={14} />
                            <input
                                name="telefono"
                                placeholder="Telefono"
                                className={inputStyle}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Email */}
                <div className={inputWrapper}>
                    <MdOutlineEmail className="text-gray-500" size={16} />
                    <input
                        name="email"
                        placeholder="Email"
                        className={inputStyle}
                        onChange={handleChange}
                    />
                </div>

                {/* Terapista (Select) o Professione */}
                {tipoUtente === "paziente" ? (
                    <div>
                        <label className="text-sm text-gray-600 mb-1 font-marcellus ">
                            Terapista
                        </label>
                        <Select
                            options={terapistiOptions}
                            value={terapistaSelezionato}
                            onChange={setTerapistaSelezionato}
                            placeholder="Seleziona un terapista"
                            className="text-[14px]"
                        />
                    </div>
                ) : (
                    <div className={inputWrapper}>
                        <FaUser className="text-gray-500" />
                        <input
                            name="professione"
                            placeholder="Professione"
                            className={inputStyle}
                            onChange={handleChange}
                        />
                    </div>
                )}

                {/* Diagnosi (solo paziente) */}
                {tipoUtente === "paziente" && (
                    <div className={inputWrapper}>
                        <textarea
                            name="diagnosi"
                            placeholder="Diagnosi"
                            rows={3}
                            className={inputStyle + " resize-none"}
                            onChange={handleChange}
                        />
                    </div>
                )}
            </div>

            {/* Footer fisso */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                    onClick={onClose}
                    className="bg-gray-200 hover:bg-gray-300 px-8 py-2 rounded-[12px] font-marcellus text-gray-700 transition-colors duration-200"
                >
                    Chiudi
                </button>

                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-3 border border-gray-300 rounded-[12px] px-4 py-2 bg-white hover:bg-gray-100 font-marcellus text-gray-700 transition-colors duration-200"
                >
                    
                    Aggiungi utente!
                    <FaRegThumbsUp  className="text-gray-700 text-sm" size={16} color="green" />
                </button>
            </div>
        </div>
    );
};

export default ModalContentAggiungiUtente;
