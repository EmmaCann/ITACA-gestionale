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
import CreatableSelect from "react-select/creatable";

const ModalContentAggiungiUtente = ({
    tipoIniziale = "paziente",
    onSubmit,
    onClose,
}) => {
    const [tipoUtente, setTipoUtente] = useState(tipoIniziale);
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [terapistiOptions, setTerapistiOptions] = useState([]);
    const [terapistiSelezionati, setTerapistiSelezionati] = useState([]);

    //  professioni multiple (solo staff)
    const [professioniOptions, setProfessioniOptions] = useState([]);
    const [professioniSelezionate, setProfessioniSelezionate] = useState([]);

    /* ------------------ INIT ------------------ */
    useEffect(() => {
        setTipoUtente(tipoIniziale);
        setFormData({});
        setTerapistiSelezionati([]);
        setProfessioniSelezionate([]);
    }, [tipoIniziale]);

    /* ------------------ HANDLERS ------------------ */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const tipoOptions = [
        { value: "paziente", label: "Paziente" },
        { value: "staff", label: "Staff" },
    ];

    const handleTipoChange = (option) => {
        setTipoUtente(option.value);
        setFormData({});
        setTerapistaSelezionato(null);
        setProfessioniSelezionate([]);
    };

    /* ------------------ FETCH ------------------ */
    useEffect(() => {
        if (tipoUtente === "paziente") {
            fetchTerapisti();
        }
        if (tipoUtente === "staff") {
            fetchProfessioni();
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
        }
    };

    const fetchProfessioni = async () => {
        try {
            const response = await baseCall({
                endpoint: "/professioni/terapisti",
                method: "GET",
            });

            const options = Object.values(response.data).map((p) => ({
                value: p,
                label: p,
            }));

            setProfessioniOptions(options);
        } catch (error) {
            toast.error("Errore nel recupero delle professioni");
        }
    };

    /* ------------------ SUBMIT ------------------ */
    const handleSubmit = async () => {
        const data = {
            tipoUtente,
            ...formData,

            ...(tipoUtente === "paziente" && {
                terapisti: terapistiSelezionati.map((t) => t.value),
            }),

            ...(tipoUtente === "staff" && {
                professioni: professioniSelezionate.map((p) => p.value),
            }),
        };

        setIsSubmitting(true);

        try {
            const response = await creaUtente(data);
            toast.success("Utente creato con successo!");
            onSubmit?.(response);
            onClose();
        } catch (error) {
            if (error.response?.data?.errors) {
                Object.values(error.response.data.errors).forEach((messages) =>
                    messages.forEach((msg) => toast.error(msg))
                );
            } else {
                toast.error("Errore nella creazione utente");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle =
        "flex-1 border-none outline-none text-[14px] placeholder-gray-400 font-marcellus";

    /* ================== RENDER ================== */
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
                <h2 className="font-marcellusSC font-bold text-center text-[22px]">
                    AGGIUNGI NUOVO {tipoUtente.toUpperCase()}
                </h2>

                <div className="w-full sm:w-[40%]">
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
                <div className="flex flex-col sm:flex-row gap-4">
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

                {/* Data nascita + sesso */}
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
                                value={formData.dataNascita || ""}
                                onChange={handleChange}
                            />
                        </IconInputWrapperModal>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600 mb-1 font-marcellus">
                            Sesso
                        </label>
                        <Select
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
                            className="text-[14px] w-full sm:w-[200px]"
                        />
                    </div>
                </div>

              
                {/* Telefoni */}
                <div className="flex flex-col gap-3">
                    <IconInputWrapperModal icon={FaPhoneAlt}>
                        <input
                            name="telefono_1"
                            placeholder={
                                tipoUtente === "paziente"
                                    ? "Telefono mamma"
                                    : "Telefono principale"
                            }
                            className={inputStyle}
                            onChange={handleChange}
                        />
                    </IconInputWrapperModal>

                    <IconInputWrapperModal icon={FaPhoneAlt}>
                        <input
                            name="telefono_2"
                            placeholder={
                                tipoUtente === "paziente"
                                    ? "Telefono papà"
                                    : "Telefono secondario"
                            }
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

                {/* STAFF → professioni multiple */}
                {tipoUtente === "staff" && (
                    <div>
                        <label className="text-sm text-gray-600 mb-1 font-marcellus">
                            Professioni
                        </label>
                        <CreatableSelect
                            isMulti
                            options={professioniOptions}
                            value={professioniSelezionate}
                            onChange={setProfessioniSelezionate}
                            placeholder="Seleziona o scrivi una nuova professione"
                            className="text-[14px]"
                            formatCreateLabel={(inputValue) =>
                                `Aggiungi nuova professione: "${inputValue}"`
                            }
                        />
                    </div>
                )}

                {/* PAZIENTE → terapista */}
                {tipoUtente === "paziente" && (
                    <div>
                        <label className="text-sm text-gray-600 mb-1 font-marcellus">
                            Terapisti
                        </label>
                        <Select
                            isMulti
                            options={terapistiOptions}
                            value={terapistiSelezionati}
                            onChange={setTerapistiSelezionati}
                            placeholder="Seleziona uno o più terapisti"
                            className="text-[14px]"
                        />
                    </div>
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
                    className="bg-gray-200 hover:bg-gray-300 px-8 py-2 rounded-[12px] font-marcellus"
                    disabled={isSubmitting}
                >
                    Chiudi
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-3 border border-gray-300 rounded-[12px] px-4 py-2 font-marcellus bg-white hover:bg-gray-100"
                >
                    {isSubmitting ? "Aggiungendo..." : "Aggiungi utente!"}
                    <FaRegThumbsUp size={16} />
                </button>
            </div>
        </div>
    );
};

export default ModalContentAggiungiUtente;
