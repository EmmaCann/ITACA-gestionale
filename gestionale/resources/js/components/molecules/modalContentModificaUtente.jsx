import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
    FaUser,
    FaCalendarAlt,
    FaPhoneAlt,
    FaRegThumbsUp,
    FaLock,
} from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { baseCall } from "../../data/api/baseCall";
import { IconInputWrapperModal } from "../molecules/atoms/iconInputWrapperModal.jsx";

const ModalContentModificaUtente = ({ utente, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [terapistiOptions, setTerapistiOptions] = useState([]);
    const [terapistaSelezionato, setTerapistaSelezionato] = useState(null);

    const tipoUtente = utente?.ruolo === "paziente" ? "paziente" : "staff";

    useEffect(() => {
        if (utente) {
            setFormData({
                nome: utente.nome || "",
                cognome: utente.cognome || "",
                nascita: utente.nascita || "",
                sesso: utente.sesso || null,
                telefono: utente.telefono || "",
                email: utente.email || "",
                professione: utente.professione || "",
                diagnosi: utente.diagnosi || "",
                password: "",
            });

            if (tipoUtente === "paziente") {
                fetchTerapisti();
                if (Array.isArray(utente.terapisti) && utente.terapisti.length) {
                    setTerapistaSelezionato({
                        value: utente.terapisti[0].id,
                        label: `${utente.terapisti[0].nome} ${utente.terapisti[0].cognome}`,
                    });
                }
            }
        }
    }, [utente]);

    const fetchTerapisti = async () => {
        try {
            const response = await baseCall({
                endpoint: "/terapisti",
                method: "GET",
            });
            setTerapistiOptions(
                Object.values(response.data).map((t) => ({
                    value: t.id,
                    label: `${t.nome} ${t.cognome}`,
                }))
            );
        } catch (error) {
            toast.error("Errore nel recupero dei terapisti");
            console.error("Errore terapisti:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const data = {
            ...formData,
            ...(tipoUtente === "paziente" && {
                terapista_id: terapistaSelezionato?.value,
            }),
        };

        // Se la password è vuota non la mando
        if (!data.password) {
            delete data.password;
        }

        setIsSubmitting(true);

        try {
            const response = await baseCall({
                endpoint: `/utenti/${utente.id}`,
                method: "PUT",
                data,
            });

            toast.success("Utente modificato con successo!");
            onSubmit?.(response);
            onClose();
        } catch (error) {
            console.error("Errore update:", error);
            toast.error(
                error.response?.data?.message || "Errore durante la modifica"
            );
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
                    MODIFICA {tipoUtente.toUpperCase()}
                </h2>

                {/* Nome + Cognome */}
                <div className="flex flex-row gap-4">
                    <IconInputWrapperModal icon={FaUser} className="flex-1">
                        <input
                            name="nome"
                            placeholder="Nome"
                            className={inputStyle}
                            value={formData.nome || ""}
                            onChange={handleChange}
                        />
                    </IconInputWrapperModal>
                    <IconInputWrapperModal icon={FaUser} className="flex-1">
                        <input
                            name="cognome"
                            placeholder="Cognome"
                            className={inputStyle}
                            value={formData.cognome || ""}
                            onChange={handleChange}
                        />
                    </IconInputWrapperModal>
                </div>

                {/* Data di nascita + sesso */}
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col flex-1">
                        <label className="text-sm text-gray-600 mb-1 font-marcellus">
                            Data di nascita
                        </label>
                        <IconInputWrapperModal icon={FaCalendarAlt}>
                            <input
                                type="date"
                                name="nascita"
                                className={inputStyle}
                                value={formData.nascita || ""}
                                onChange={handleChange}
                            />
                        </IconInputWrapperModal>
                    </div>
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
                        />
                    </div>
                </div>

                {/* Telefono */}
                <IconInputWrapperModal icon={FaPhoneAlt}>
                    <input
                        name="telefono"
                        placeholder="Telefono"
                        className={inputStyle}
                        value={formData.telefono || ""}
                        onChange={handleChange}
                    />
                </IconInputWrapperModal>

                {/* Email */}
                <IconInputWrapperModal icon={MdOutlineEmail}>
                    <input
                        name="email"
                        placeholder="Email"
                        className={inputStyle}
                        value={formData.email || ""}
                        onChange={handleChange}
                    />
                </IconInputWrapperModal>

                {/* Password */}
                <IconInputWrapperModal icon={FaLock}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Nuova password (lascia vuoto per non cambiare)"
                        className={inputStyle}
                        value={formData.password || ""}
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
                            options={terapistiOptions}
                            value={terapistaSelezionato}
                            onChange={setTerapistaSelezionato}
                            placeholder="Seleziona un terapista"
                            className="text-[14px]"
                            menuPlacement="auto"
                        />
                    </div>
                ) : (
                    <IconInputWrapperModal icon={FaUser}>
                        <input
                            name="professione"
                            placeholder="Professione"
                            className={inputStyle}
                            value={formData.professione || ""}
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
                            value={formData.diagnosi || ""}
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
                    {isSubmitting ? "Salvando..." : "Salva modifiche"}
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

export default ModalContentModificaUtente;
