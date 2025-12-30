import React, { useState, useEffect } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
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
    // const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [terapistiOptions, setTerapistiOptions] = useState([]);
    const [terapistiSelezionati, setTerapistiSelezionati] = useState([]);

    // STAFF: professioni multiple
    const [professioniOptions, setProfessioniOptions] = useState([]);
    const [professioniSelezionate, setProfessioniSelezionate] = useState([]);

    const tipoUtente = utente?.ruolo === "paziente" ? "paziente" : "staff";

    const [formData, setFormData] = useState({
        nome: "",
        cognome: "",
        nascita: "",
        sesso: null,
        telefono_1: "",
        telefono_2: "",
        email: "",
        diagnosi: "",
        password: "",
    });

    /* ================= INIT ================= */
    useEffect(() => {
        if (!utente) return;

        setFormData({
            nome: utente.nome || "",
            cognome: utente.cognome || "",
            nascita: utente.nascita || "",
            sesso: utente.sesso || null,
            telefono_1: utente.telefono_1 || "",
            telefono_2: utente.telefono_2 || "",
            email: utente.email || "",
            diagnosi: utente.diagnosi || "",
            password: "",
        });

        if (tipoUtente === "paziente") {
            fetchTerapisti();

            if (Array.isArray(utente.terapisti)) {
                setTerapistiSelezionati(
                    utente.terapisti.map((t) => ({
                        value: t.id,
                        label: `${t.nome} ${t.cognome}`,
                    }))
                );
            }
        }

        if (tipoUtente === "staff") {
            fetchProfessioni();

            if (Array.isArray(utente.staff_dati)) {
                setProfessioniSelezionate(
                    utente.staff_dati.map((p) => ({
                        value: p.professione,
                        label: p.professione,
                    }))
                );
            }
        }
    }, [utente]);

    /* ================= FETCH ================= */
    const fetchTerapisti = async () => {
        try {
            const response = await baseCall({
                endpoint: "/terapisti",
                method: "GET",
            });

            // setTerapistiOptions(
            //     Object.values(response.data).map((t) => ({
            //         value: t.id,
            //         label: `${t.nome} ${t.cognome}`,
            //     }))
            // );
            setTerapistiOptions(Object.values(response.data));
        } catch {
            toast.error("Errore nel recupero dei terapisti");
        }
    };

    const fetchProfessioni = async () => {
        try {
            const response = await baseCall({
                endpoint: "/professioni/terapisti",
                method: "GET",
            });

            setProfessioniOptions(
                Object.values(response.data).map((p) => ({
                    value: p,
                    label: p,
                }))
            );
        } catch {
            toast.error("Errore nel recupero delle professioni");
        }
    };

    /* ================= HANDLERS ================= */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const data = {
            ...formData,

            ...(tipoUtente === "paziente" && {
                terapisti: terapistiSelezionati.map((t) => t.value),
            }),

            ...(tipoUtente === "staff" && {
                professioni: professioniSelezionate.map((p) => p.value),
            }),
        };

        if (!data.password) delete data.password;

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
            toast.error(
                error.response?.data?.message || "Errore durante la modifica"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle =
        "flex-1 border-none outline-none text-[14px] placeholder-gray-400 font-marcellus";

    /* ================= RENDER ================= */
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
                <h2 className="font-marcellusSC font-bold text-center text-[22px]">
                    MODIFICA {tipoUtente.toUpperCase()}
                </h2>

                {/* Nome + Cognome */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <IconInputWrapperModal icon={FaUser} className="flex-1">
                        <input
                            name="nome"
                            placeholder="Nome"
                            className={inputStyle}
                            value={formData.nome}
                            onChange={handleChange}
                        />
                    </IconInputWrapperModal>

                    <IconInputWrapperModal icon={FaUser} className="flex-1">
                        <input
                            name="cognome"
                            placeholder="Cognome"
                            className={inputStyle}
                            value={formData.cognome}
                            onChange={handleChange}
                        />
                    </IconInputWrapperModal>
                </div>

                {/* Data nascita + sesso */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col flex-1">
                        <label className="text-sm mb-1">Data di nascita</label>
                        <IconInputWrapperModal icon={FaCalendarAlt}>
                            <input
                                type="date"
                                name="nascita"
                                className={inputStyle}
                                value={formData.nascita}
                                onChange={handleChange}
                            />
                        </IconInputWrapperModal>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm mb-1">Sesso</label>
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
                            onChange={(opt) =>
                                setFormData((p) => ({
                                    ...p,
                                    sesso: opt?.value ?? null,
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
                            value={formData.telefono_1}
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
                            value={formData.telefono_2}
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
                        value={formData.email}
                        onChange={handleChange}
                    />
                </IconInputWrapperModal>

                {/* Password */}
                <IconInputWrapperModal icon={FaLock}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Nuova password (lascia vuoto)"
                        className={inputStyle}
                        value={formData.password}
                        onChange={handleChange}
                    />
                </IconInputWrapperModal>

                {/* STAFF → professioni */}
                {tipoUtente === "staff" && (
                    <div>
                        <label className="text-sm mb-1">Professioni</label>
                        <CreatableSelect
                            isMulti
                            options={professioniOptions}
                            value={professioniSelezionate}
                            onChange={setProfessioniSelezionate}
                            placeholder="Seleziona o scrivi una professione"
                            formatCreateLabel={(v) => `Aggiungi "${v}"`}
                        />
                    </div>
                )}

                {/* PAZIENTE → terapista */}
                {tipoUtente === "paziente" && (
                    <div>
                        <label className="text-sm mb-1">Terapista</label>
                        <Select
                            isMulti
                            options={terapistiOptions}
                            value={terapistiSelezionati}
                            onChange={setTerapistiSelezionati}
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
                            value={formData.diagnosi}
                            onChange={handleChange}
                        />
                    </IconInputWrapperModal>
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-between pt-4 border-t">
                <button
                    onClick={onClose}
                    className="bg-gray-200 px-8 py-2 rounded-[12px]"
                    disabled={isSubmitting}
                >
                    Chiudi
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-3 border px-4 py-2 rounded-[12px]"
                >
                    {isSubmitting ? "Salvando..." : "Salva modifiche"}
                    <FaRegThumbsUp size={16} />
                </button>
            </div>
        </div>
    );
};

export default ModalContentModificaUtente;
