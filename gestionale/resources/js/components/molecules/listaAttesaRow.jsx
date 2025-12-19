import React, { useState, useEffect } from "react";
import { CheckboxRotondo } from "./atoms/checkboxRotondo";
import { IconInfoButtons } from "./atoms/iconInfoButtons";
import { ColonnaTabella } from "./atoms/ColonnaTabella";
import Select from "react-select";
import { baseCall } from "@/data/api/baseCall";
import { toast } from "react-toastify";
import {
    segnaChiamato,
    aggiornaTerapia,
    aggiornaTerapista,
} from "@/data/api/listaAttesa";
import dayjs from "dayjs";

export const ListaAttesaRow = ({
    index = 0,
    data = {},
    aggiornaLista = () => {},
}) => {
    const [chiamato, setChiamato] = useState(data.chiamato || false);
    const [richiestaTerapista, setRichiestaTerapista] = useState(
        !!data.terapista_id
    );
    const [terapiaSelezionata, setTerapiaSelezionata] = useState(null);
    const [terapistaSelezionato, setTerapistaSelezionato] = useState(null);
    const [professioniOptions, setProfessioniOptions] = useState([]);
    const [terapistiOptions, setTerapistiOptions] = useState([]);
    const [popupContent, setPopupContent] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        fetchProfessioni();
        fetchTerapisti();
    }, []);

    useEffect(() => {
        if (professioniOptions.length > 0 && data.terapia) {
            const terapiaCorrente = professioniOptions.find(
                (opt) => opt.value === data.terapia
            );
            setTerapiaSelezionata(terapiaCorrente || null);
        }
    }, [professioniOptions, data.terapia]);

    useEffect(() => {
        if (terapistiOptions.length > 0 && data.terapista_id) {
            const t = terapistiOptions.find(
                (t) =>
                    t.value === data.terapista_id || t.id === data.terapista_id
            );
            if (t) {
                setTerapistaSelezionato(t);
            }
        }
    }, [terapistiOptions, data.terapista_id]);

    const fetchProfessioni = async () => {
        try {
            const response = await baseCall({
                endpoint: "/professioni/terapisti",
                method: "GET",
            });
            const options = Object.values(response.data).map((professione) => ({
                value: professione,
                label: professione,
            }));
            setProfessioniOptions(options);
        } catch (error) {
            toast.error("Errore nel recupero delle professioni");
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

    const aggiornaTerapiaDB = async (nuovaTerapia) => {
        try {
            await aggiornaTerapia(data.id, nuovaTerapia);
            toast.success("Terapia aggiornata con successo");
        } catch (error) {
            toast.error("Errore aggiornamento terapia");
            console.error("Errore:", error);
        }
    };

    const handlePhoneClick = () => {
        if (data.telefono) {
            setPopupContent(`Telefono: ${data.telefono}`);
            setShowPopup(true);
        } else {
            toast.warning("Numero di telefono non disponibile");
        }
    };

    const handleMailClick = () => {
        if (data.email) {
            setPopupContent(`Email: ${data.email}`);
            setShowPopup(true);
        } else {
            toast.warning("Email non disponibile");
        }
    };

    const pTagStyle = "font-inter text-black text-[14px]";
    const dateStyle = "font-inter text-[#3DA4DD] text-[14px]";

    return (
        <>
            <div className="hidden md:flex bg-white flex-row w-[95%] h-auto py-2 mx-4 items-center gap-4 rounded-[8px] pl-2 my-1">
                <CheckboxRotondo
                    checked={chiamato}
                    onChange={async () => {
                        const nuovoStato = !chiamato;
                        const conferma = window.confirm(
                            nuovoStato
                                ? "Segnare questo utente come chiamato?"
                                : "Annullare la chiamata?"
                        );
                        if (!conferma) return;

                        try {
                            await segnaChiamato(data.id, nuovoStato);
                            setChiamato(nuovoStato);
                            toast.success("Utente aggiornato");
                            aggiornaLista();
                        } catch (err) {
                            toast.error("Errore nel segnare come chiamato");
                        }
                    }}
                />

                <div className="flex-1 flex flex-row items-center justify-between text-black text-[14px] z-20">
                    <ColonnaTabella width="w-[60px]">
                        <p className={pTagStyle}>{index + 1}°</p>
                    </ColonnaTabella>
                    <ColonnaTabella>
                        <p className={pTagStyle}>{data.nome}</p>
                    </ColonnaTabella>
                    <ColonnaTabella>
                        <p className={pTagStyle}>{data.cognome}</p>
                    </ColonnaTabella>
                    <ColonnaTabella>
                        <p className={dateStyle}>
                            {data.data
                                ? dayjs(data.data).format("DD/MM/YYYY")
                                : "-"}
                        </p>
                    </ColonnaTabella>

                    <ColonnaTabella width="w-[160px]">
                        <Select
                            options={professioniOptions}
                            value={terapiaSelezionata}
                            onChange={(selected) => {
                                setTerapiaSelezionata(selected);
                                aggiornaTerapiaDB(selected.value);
                            }}
                            placeholder="Tipo terapia"
                            className="text-[12px]"
                            isSearchable={false}
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 100000,
                                }),

                                control: (provided) => ({
                                    ...provided,
                                    borderRadius: "12px",
                                }),
                            }}
                        />
                    </ColonnaTabella>

                    <ColonnaTabella width="w-[180px]">
                        <div className="flex flex-col gap-1">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={richiestaTerapista}
                                    onChange={(e) =>
                                        setRichiestaTerapista(e.target.checked)
                                    }
                                />
                                Richiesta terapista
                            </label>
                            {richiestaTerapista && (
                                <Select
                                    options={terapistiOptions}
                                    value={terapistaSelezionato}
                                    onChange={async (selected) => {
                                        setTerapistaSelezionato(selected);
                                        try {
                                            await aggiornaTerapista(
                                                data.id,
                                                selected.value
                                            );
                                            toast.success(
                                                "Terapista aggiornato con successo"
                                            );
                                            aggiornaLista();
                                        } catch (error) {
                                            console.error(
                                                "Errore aggiornamento terapista:",
                                                error
                                            );
                                            toast.error(
                                                "Errore aggiornamento terapista"
                                            );
                                        }
                                    }}
                                    placeholder="Seleziona terapista"
                                    className="text-[12px]"
                                    isSearchable
                                    menuPortalTarget={document.body}
                                    styles={{
                                        menuPortal: (base) => ({
                                            ...base,
                                            zIndex: 100000,
                                        }),

                                        control: (provided) => ({
                                            ...provided,
                                            borderRadius: "12px",
                                        }),
                                    }}
                                />
                            )}
                        </div>
                    </ColonnaTabella>

                    <ColonnaTabella>
                        <IconInfoButtons
                            onPhoneClick={handlePhoneClick}
                            onMailClick={handleMailClick}
                        />
                    </ColonnaTabella>
                </div>
            </div>

            <div className="md:hidden bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3 mx-4">
                {/* header card */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CheckboxRotondo
                            checked={chiamato}
                            onChange={async () => {
                                const nuovoStato = !chiamato;
                                const conferma = window.confirm(
                                    nuovoStato
                                        ? "Segnare questo utente come chiamato?"
                                        : "Annullare la chiamata?"
                                );
                                if (!conferma) return;

                                try {
                                    await segnaChiamato(data.id, nuovoStato);
                                    setChiamato(nuovoStato);
                                    toast.success("Utente aggiornato");
                                    aggiornaLista();
                                } catch (err) {
                                    toast.error(
                                        "Errore nel segnare come chiamato"
                                    );
                                }
                            }}
                        />
                        <span className="text-sm text-gray-500">
                            #{index + 1}
                        </span>
                    </div>
                    <span className="text-sm text-gray-400">
                        {dayjs(data.data).format("DD/MM/YYYY")}
                    </span>
                </div>

                {/* nome */}
                <div>
                    <p className="text-xs text-gray-400">Nome</p>
                    <p className="text-base font-medium">
                        {data.nome} {data.cognome}
                    </p>
                </div>

                {/* terapia */}
                <div>
                    <p className="text-xs text-gray-400">Terapia</p>
                    <Select
                        options={professioniOptions}
                        value={terapiaSelezionata}
                        onChange={(selected) => {
                            setTerapiaSelezionata(selected);
                            aggiornaTerapiaDB(selected.value);
                        }}
                        className="text-sm"
                    />
                </div>

                {/* richiesta terapista */}
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={richiestaTerapista}
                        onChange={(e) =>
                            setRichiestaTerapista(e.target.checked)
                        }
                    />
                    Richiesta terapista specifico
                </label>

                {/* contatti */}
                <div className="flex justify-end gap-3 pt-2">
                    <IconInfoButtons
                        onPhoneClick={handlePhoneClick}
                        onMailClick={handleMailClick}
                    />
                </div>
            </div>

            {showPopup && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-40 z-[9998]"
                        onClick={() => setShowPopup(false)}
                    />
                    <div
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow-lg p-4 rounded-md z-[9999] p-8 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-lg text-gray-800 mb-2">
                            {popupContent}
                        </p>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="text-black-600 text-sm underline pt-4"
                        >
                            Chiudi
                        </button>
                    </div>
                </>
            )}
        </>
    );
};
