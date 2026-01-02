// resources/js/components/modals/EventDetailsModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { usePage } from "@inertiajs/react";

export default function EventDetailsModal({ id, onClose, onChanged, canEdit }) {
    const { props } = usePage();
    const ruolo = props?.ruolo; // "admin" | "staff" | "paziente"

    const [data, setData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    // opzioni per multiselect gruppo (solo se edit)
    const [pazientiOptions, setPazientiOptions] = useState([]);
    const [terapistiOptions, setTerapistiOptions] = useState([]);

    const isGroup = useMemo(() => data?.is_group === true, [data]);

    // ✅ qui decidiamo se mostrare il titolo nel dettaglio
    const showGroupTitle = !(ruolo === "paziente" && isGroup);

    useEffect(() => {
        let alive = true;

        axios
            .get(`/appuntamenti/${id}`)
            .then((res) => {
                if (!alive) return;

                const a = res.data;

                setData({
                    id: a.id,
                    data: a.data,
                    ora: a.ora,
                    durata_minuti: a.durata_minuti,
                    note: a.note ?? "",

                    // GROUP
                    is_group: !!a.is_group,
                    titolo: a.titolo ?? "",
                    pazienti: Array.isArray(a.pazienti) ? a.pazienti : [],
                    terapisti: Array.isArray(a.terapisti) ? a.terapisti : [],

                    // SINGLE (retrocompat)
                    paziente_id: a.paziente?.id ?? null,
                    paziente_nome: a.paziente?.nome ?? "",
                    paziente_cognome: a.paziente?.cognome ?? "",

                    terapista_id: a.terapista?.id ?? null,
                    terapista_nome: a.terapista?.nome ?? "",
                    terapista_cognome: a.terapista?.cognome ?? "",
                });

                setEditing(false);
            })
            .catch(() => {
                alert("Errore nel caricamento dettagli");
                onClose?.();
            });

        return () => {
            alive = false;
        };
    }, [id]);

    // carica opzioni SOLO se serve (gruppo + canEdit)
    useEffect(() => {
        if (!isGroup || !canEdit) return;

        let alive = true;

        Promise.all([axios.get("/get-pazienti"), axios.get("/terapisti")])
            .then(([pazRes, terRes]) => {
                if (!alive) return;
                setPazientiOptions(Object.values(pazRes.data || {}));
                setTerapistiOptions(Object.values(terRes.data || {}));
            })
            .catch(() => {});

        return () => {
            alive = false;
        };
    }, [isGroup, canEdit]);

    const handleSave = async () => {
        setSaving(true);
        try {
            if (isGroup) {
                await axios.patch(`/appuntamenti/${id}`, {
                    // titolo: lo mando solo se è visibile/modificabile (admin/staff)
                    ...(showGroupTitle ? { titolo: data.titolo } : {}),

                    data: data.data,
                    ora: (data.ora || "").slice(0, 5),
                    durata_minuti: data.durata_minuti,
                    note: data.note,

                    pazienti_ids: (data.pazienti || []).map((p) => p.id),
                    terapisti_ids: (data.terapisti || []).map(
                        (t) => t.id ?? t.value
                    ),
                });
            } else {
                await axios.patch(`/appuntamenti/${id}`, {
                    data: data.data,
                    ora: (data.ora || "").slice(0, 5),
                    durata_minuti: data.durata_minuti,
                    note: data.note,
                    terapista_id: data.terapista_id,
                    paziente_id: data.paziente_id ?? null,
                    nome: data.paziente_id ? null : data.paziente_nome,
                    cognome: data.paziente_id ? null : data.paziente_cognome,
                });
            }

            setEditing(false);
            onChanged?.();
        } catch (e) {
            alert("Errore nel salvataggio");
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Eliminare definitivamente l'appuntamento?")) return;
        try {
            await axios.delete(`/appuntamenti/${id}`);
            onChanged?.();
            onClose?.();
        } catch {
            alert("Errore nell'eliminazione");
        }
    };

    if (!data) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-4 w-full max-w-xl space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                        {isGroup
                            ? "Dettagli terapia di gruppo"
                            : "Dettagli appuntamento"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <label className="col-span-1">
                        <span className="text-gray-500">Data</span>
                        <input
                            disabled={!editing}
                            type="date"
                            value={data.data || ""}
                            onChange={(e) =>
                                setData((d) => ({ ...d, data: e.target.value }))
                            }
                            className="w-full border rounded px-2 py-1"
                        />
                    </label>

                    <label>
                        <span className="text-gray-500">Ora</span>
                        <input
                            disabled={!editing}
                            type="time"
                            value={(data.ora || "").slice(0, 5)}
                            onChange={(e) =>
                                setData((d) => ({ ...d, ora: e.target.value }))
                            }
                            className="w-full border rounded px-2 py-1"
                        />
                    </label>

                    <label>
                        <span className="text-gray-500">Durata (min)</span>
                        <input
                            disabled={!editing}
                            type="number"
                            min={5}
                            max={720}
                            value={data.durata_minuti || 30}
                            onChange={(e) =>
                                setData((d) => ({
                                    ...d,
                                    durata_minuti: parseInt(
                                        e.target.value || "0"
                                    ),
                                }))
                            }
                            className="w-full border rounded px-2 py-1"
                        />
                    </label>

                    {/* GROUP */}
                    {isGroup && (
                        <>
                            {/* ✅ Titolo visibile solo se NON paziente */}
                            {showGroupTitle && (
                                <div className="col-span-2">
                                    <span className="text-gray-500">Titolo</span>
                                    <input
                                        disabled={!editing}
                                        value={data.titolo || ""}
                                        onChange={(e) =>
                                            setData((d) => ({
                                                ...d,
                                                titolo: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded px-2 py-1"
                                        placeholder="Nome terapia di gruppo"
                                    />
                                </div>
                            )}

                            <div className="col-span-2">
                                <span className="text-gray-500">
                                    Pazienti ({data.pazienti?.length || 0})
                                </span>
                                <Select
                                    isDisabled={!editing}
                                    isMulti
                                    options={pazientiOptions}
                                    value={data.pazienti || []}
                                    onChange={(v) =>
                                        setData((d) => ({
                                            ...d,
                                            pazienti: v || [],
                                        }))
                                    }
                                    className="text-[14px]"
                                    placeholder="Seleziona pazienti"
                                    getOptionLabel={(p) =>
                                        `${p.nome} ${p.cognome}`
                                    }
                                    getOptionValue={(p) => p.id}
                                    isSearchable
                                />
                            </div>

                            <div className="col-span-2">
                                <span className="text-gray-500">
                                    Terapisti ({data.terapisti?.length || 0})
                                </span>
                                <Select
                                    isDisabled={!editing}
                                    isMulti
                                    options={terapistiOptions}
                                    value={data.terapisti || []}
                                    onChange={(v) =>
                                        setData((d) => ({
                                            ...d,
                                            terapisti: v || [],
                                        }))
                                    }
                                    className="text-[14px]"
                                    placeholder="Seleziona terapisti"
                                    getOptionLabel={(t) =>
                                        t.label || `${t.nome} ${t.cognome}`
                                    }
                                    getOptionValue={(t) => t.id || t.value}
                                    isSearchable
                                />
                            </div>
                        </>
                    )}

                    {/* SINGLE */}
                    {!isGroup && (
                        <>
                            <div className="col-span-2">
                                <span className="text-gray-500">Paziente</span>
                                <input
                                    disabled={!editing || data.paziente_id}
                                    value={`${data.paziente_nome ?? ""}`}
                                    onChange={(e) =>
                                        setData((d) => ({
                                            ...d,
                                            paziente_nome: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded px-2 py-1"
                                    placeholder="Nome (ospite)"
                                />
                                <input
                                    disabled={!editing || data.paziente_id}
                                    value={`${data.paziente_cognome ?? ""}`}
                                    onChange={(e) =>
                                        setData((d) => ({
                                            ...d,
                                            paziente_cognome: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded px-2 py-1 mt-2"
                                    placeholder="Cognome (ospite)"
                                />
                            </div>

                            <div className="col-span-2">
                                <span className="text-gray-500">Terapista</span>
                                <input
                                    disabled
                                    value={`${data.terapista_nome ?? ""} ${
                                        data.terapista_cognome ?? ""
                                    }`}
                                    className="w-full border rounded px-2 py-1"
                                />
                            </div>
                        </>
                    )}

                    <div className="col-span-2">
                        <span className="text-gray-500">Note</span>
                        <textarea
                            disabled={!editing}
                            value={data.note ?? ""}
                            onChange={(e) =>
                                setData((d) => ({ ...d, note: e.target.value }))
                            }
                            className="w-full border rounded px-2 py-1"
                            rows={3}
                        />
                    </div>
                </div>

                <div className="flex justify-between pt-2">
                    <div className="space-x-2">
                        {canEdit && !editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="px-4 py-2 rounded bg-bluPrimary text-white"
                            >
                                Modifica
                            </button>
                        )}
                        {canEdit && editing && (
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-4 py-2 rounded bg-green-400 text-white"
                            >
                                {saving ? "Salvo…" : "Salva"}
                            </button>
                        )}
                    </div>

                    {canEdit && (
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 rounded bg-red-500 text-white"
                        >
                            Elimina
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
