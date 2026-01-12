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
import CustomModal from "../customModal.jsx";
import ModalContentListaAttesa from "./modalContentListaAttesa.jsx";
import {
    aggiornaVoceListaAttesa,
    eliminaVoceListaAttesa,
} from "@/data/api/listaAttesa";


export const ListaAttesaRow = ({ index, data, aggiornaLista }) => {
    const [chiamato, setChiamato] = useState(!!data.chiamato);
    const [richiestaTerapista, setRichiestaTerapista] = useState(
        !!data.terapista_id
    );
    const [terapiaSelezionata, setTerapiaSelezionata] = useState(null);
    const [terapistaSelezionato, setTerapistaSelezionato] = useState(null);
    const [professioniOptions, setProfessioniOptions] = useState([]);
    const [terapistiOptions, setTerapistiOptions] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    /* ====== FETCH ====== */
    useEffect(() => {
        baseCall({ endpoint: "/professioni/terapisti", method: "GET" }).then(
            (res) =>
                setProfessioniOptions(
                    Object.values(res.data).map((p) => ({
                        value: p,
                        label: p,
                    }))
                )
        );

        baseCall({ endpoint: "/terapisti", method: "GET" }).then((res) =>
            setTerapistiOptions(Object.values(res.data))
        );
    }, []);

    useEffect(() => {
        if (professioniOptions.length && data.terapia) {
            setTerapiaSelezionata(
                professioniOptions.find((p) => p.value === data.terapia)
            );
        }
    }, [professioniOptions, data.terapia]);

    useEffect(() => {
        if (terapistiOptions.length && data.terapista_id) {
            setTerapistaSelezionato(
                terapistiOptions.find(
                    (t) =>
                        t.value === data.terapista_id ||
                        t.id === data.terapista_id
                )
            );
        }
    }, [terapistiOptions, data.terapista_id]);

    /* ====== HANDLERS ====== */
    const handleChiamato = async () => {
        const nuovo = !chiamato;
        const ok = window.confirm(
            nuovo ? "Segnare come chiamato?" : "Annullare chiamata?"
        );
        if (!ok) return;

        try {
            await segnaChiamato(data.id, nuovo);
            setChiamato(nuovo);
            aggiornaLista();
        } catch {
            toast.error("Errore aggiornamento chiamato");
        }
    };

    const aggiornaTerapiaDB = async (val) => {
        try {
            await aggiornaTerapia(data.id, val);
            aggiornaLista();
        } catch {
            toast.error("Errore aggiornamento terapia");
        }
    };

    /* ====== RENDER ====== */
    return (
        <>
            <div
                className="
    hidden md:grid
    bg-white mx-4 my-1 px-3 py-2 rounded-[8px]
    grid-cols-[40px_50px_1.1fr_1.1fr_0.4fr_0.9fr_1.2fr_1.6fr_0.8fr_0.6fr]
    items-center text-[14px]"
            >
                <CheckboxRotondo checked={chiamato} onChange={handleChiamato} />

                <div>{index + 1}°</div>

                <div className="truncate">{data.nome}</div>

                <div className="truncate">{data.cognome}</div>

                <div className="text-center">
                    {data.note && (
                        <button onClick={() => setShowPopup(true)}>📝</button>
                    )}
                </div>

                <div>{dayjs(data.data).format("DD/MM/YYYY")}</div>

                <div>
                    <Select
                        options={professioniOptions}
                        value={terapiaSelezionata}
                        onChange={(s) => aggiornaTerapiaDB(s.value)}
                        className="text-[12px]"
                        isSearchable={false}
                    />
                </div>

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
                            onChange={(s) =>
                                aggiornaTerapista(data.id, s.value)
                            }
                            className="text-[12px]"
                        />
                    )}
                </div>

                <div className="flex justify-center gap-2">
                    <IconInfoButtons />
                </div>

                <div className="flex justify-center gap-2">
                    <button
                            title="Modifica"
                            disabled={chiamato}
                            onClick={() => setIsEditOpen(true)}
                        >
                            ✏️
                        </button>

                        <button
                            title="Elimina"
                            disabled={chiamato}
                            onClick={async () => {
                                const ok = window.confirm(
                                    "Vuoi eliminare questa voce?"
                                );
                                if (!ok) return;

                                try {
                                    await eliminaVoceListaAttesa(data.id);
                                    toast.success("Voce eliminata");
                                    aggiornaLista();
                                } catch {
                                    toast.error("Errore eliminazione");
                                }
                            }}
                        >
                            🗑
                        </button>
                </div>
            </div>

            <div className="md:hidden bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3 mx-4">
                <div className="flex items-center justify-between">
                    <CheckboxRotondo
                        checked={chiamato}
                        onChange={handleChiamato}
                    />
                    <span className="text-xs text-gray-400">
                        #{index + 1} · {dayjs(data.data).format("DD/MM/YYYY")}
                    </span>
                </div>

                <div>
                    <p className="text-xs text-gray-400">Nome</p>
                    <p className="text-base font-medium">
                        {data.nome} {data.cognome}
                    </p>
                </div>

                {data.note && (
                    <div>
                        <p className="text-xs text-gray-400">Note</p>
                        <p className="text-sm italic text-gray-600">
                            {data.note}
                        </p>
                    </div>
                )}

                <div>
                    <p className="text-xs text-gray-400">Terapia</p>
                    <Select
                        options={professioniOptions}
                        value={terapiaSelezionata}
                        onChange={(s) => aggiornaTerapiaDB(s.value)}
                        className="text-sm"
                    />
                </div>

                <div className="flex justify-between items-center pt-2">
                    <IconInfoButtons />
                    <div className="flex gap-3">
                        <button
                            title="Modifica"
                            disabled={chiamato}
                            onClick={() => setIsEditOpen(true)}
                        >
                            ✏️
                        </button>

                        <button
                            title="Elimina"
                            disabled={chiamato}
                            onClick={async () => {
                                const ok = window.confirm(
                                    "Vuoi eliminare questa voce?"
                                );
                                if (!ok) return;

                                try {
                                    await eliminaVoceListaAttesa(data.id);
                                    toast.success("Voce eliminata");
                                    aggiornaLista();
                                } catch {
                                    toast.error("Errore eliminazione");
                                }
                            }}
                        >
                            🗑
                        </button>
                    </div>
                </div>
            </div>

            {/* POPUP NOTE */}
            {showPopup && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 z-[9998]"
                        onClick={() => setShowPopup(false)}
                    />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg z-[9999] max-w-[500px] w-[90%]">
                        <h3 className="mb-3">Note</h3>
                        <p className="text-sm whitespace-pre-wrap">
                            {data.note}
                        </p>
                        <button
                            className="mt-4 underline text-sm"
                            onClick={() => setShowPopup(false)}
                        >
                            Chiudi
                        </button>
                    </div>
                </>
            )}

            {isEditOpen && (
                <CustomModal
                    isOpen={true}
                    onRequestClose={() => setIsEditOpen(false)}
                    title="Modifica voce lista d'attesa"
                    className="w-[95vw] md:w-[60%] max-h-[90vh]"
                >
                    <ModalContentListaAttesa
                        isEdit
                        initialData={data}
                        onClose={() => setIsEditOpen(false)}
                        onSubmit={async (payload) => {
                            try {
                                await aggiornaVoceListaAttesa(data.id, payload);
                                toast.success("Voce aggiornata");
                                setIsEditOpen(false);
                                aggiornaLista();
                            } catch {
                                toast.error("Errore aggiornamento");
                            }
                        }}
                    />
                </CustomModal>
            )}
        </>
    );
};
