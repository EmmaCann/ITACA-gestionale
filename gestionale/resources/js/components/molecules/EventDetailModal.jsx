// resources/js/components/modals/EventDetailsModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EventDetailsModal({ id, onClose, onChanged, canEdit }) {
    const [data, setData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

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

                    // PAZIENTE
                    paziente_id: a.paziente?.id ?? null,
                    paziente_nome: a.paziente?.nome ?? "",
                    paziente_cognome: a.paziente?.cognome ?? "",
                    paziente_email: a.paziente?.email ?? "",
                    paziente_tel1: a.paziente?.telefono_1 ?? "",
                    paziente_tel2: a.paziente?.telefono_2 ?? "",

                    // TERAPISTA
                    terapista_id: a.terapista?.id ?? null,
                    terapista_nome: a.terapista?.nome ?? "",
                    terapista_cognome: a.terapista?.cognome ?? "",
                    terapista_email: a.terapista?.email ?? "",
                    terapista_tel1: a.terapista?.telefono_1 ?? "",
                    terapista_tel2: a.terapista?.telefono_2 ?? "",
                });
            })

            .catch(() => {
                alert("Errore nel caricamento dettagli");
                onClose?.();
            });
        return () => {
            alive = false;
        };
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.patch(`/appuntamenti/${id}`, {
                data: data.data,
                ora: data.ora?.slice(0, 5), // HH:mm
                durata_minuti: data.durata_minuti,
                note: data.note,
                terapista_id: data.terapista_id,
                paziente_id: data.paziente_id ?? null,
                nome: data.paziente_id ? null : data.paziente_nome,
                cognome: data.paziente_id ? null : data.paziente_cognome,
            });
            setEditing(false);
            onChanged?.();
        } catch {
            alert("Errore nel salvataggio");
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
                        Dettagli appuntamento
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
