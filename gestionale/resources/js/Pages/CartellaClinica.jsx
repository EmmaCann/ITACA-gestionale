import React, { useEffect, useState } from "react";
import Home from "./Home";
import { usePage } from "@inertiajs/react";
import { baseCall } from "../data/api/baseCall";
import { toast } from "react-toastify";

/* ===============================
   Cartella Clinica - Staff only
================================ */
const CartellaClinica = () => {
    const { props } = usePage();
    const { pazienteId } = props;

    const [loading, setLoading] = useState(true);

    // dati
    const [utente, setUtente] = useState(null);
    const [terapisti, setTerapisti] = useState([]);
    const [cartella, setCartella] = useState(null);
    const [files, setFiles] = useState([]);

    // campi modificabili
    const [diagnosi, setDiagnosi] = useState("");
    const [noteCliniche, setNoteCliniche] = useState("");
    const [obiettivi, setObiettivi] = useState("");
    const [osservazioni, setOsservazioni] = useState("");

    /* ===============================
       FETCH DATI
    ================================ */
    useEffect(() => {
        fetchAll();
    }, []);
    const fetchAll = async () => {
        try {
            setLoading(true);

            const { data } = await baseCall({
                endpoint: `/cartella-clinica/${pazienteId}/data`,
                method: "GET",
            });

            setUtente(data.paziente);
            setTerapisti(data.paziente?.terapisti || []);
            setFiles(data.files || []);

            // se hai cartella clinica separata
            setCartella(data.cartella || null);
        } catch (e) {
            console.error(e);
            toast.error("Errore nel caricamento della cartella clinica");
        } finally {
            setLoading(false);
        }
    };

    /* ===============================
       SALVA DATI CLINICI
    ================================ */
    const handleSave = async () => {
        try {
            await baseCall({
                endpoint: `/cartella-clinica/${pazienteId}`,
                method: "POST",
                data: {
                    diagnosi,
                    note_cliniche: noteCliniche,
                    obiettivi,
                    osservazioni,
                },
            });

            toast.success("Dati clinici salvati con successo");
        } catch (e) {
            console.error(e);
            toast.error("Errore durante il salvataggio");
        }
    };

    if (loading) {
        return (
            <Home>
                <div className="p-6 text-slate-500">Caricamento…</div>
            </Home>
        );
    }

    /* ===============================
       RENDER
    ================================ */
    return (
        <Home>
            <div className="max-w-6xl mx-auto p-6 space-y-6">
                {/* TORNA INDIETRO */}
                <button
                    onClick={() => window.history.back()}
                    className="text-sm text-slate-600 hover:text-slate-900"
                >
                    ← Torna ai pazienti
                </button>

                {/* =======================
                    ANAGRAFICA PAZIENTE
                ======================== */}
                <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                    <h2 className="text-xl font-semibold mb-4">
                        Anagrafica paziente
                    </h2>

                    <table className="w-full text-sm">
                        <tbody className="divide-y">
                            <Row label="Nome" value={utente?.nome} />
                            <Row label="Cognome" value={utente?.cognome} />
                            <Row
                                label="Data di nascita"
                                value={utente?.nascita || "-"}
                            />
                            <Row label="Sesso" value={utente?.sesso || "-"} />
                            <Row label="Email" value={utente?.email || "-"} />
                            <Row
                                label="Telefono"
                                value={utente?.telefono || "-"}
                            />
                        </tbody>
                    </table>
                </section>

                {/* =======================
                    TERAPISTI ASSOCIATI
                ======================== */}
                <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                    <h2 className="text-xl font-semibold mb-4">
                        Terapisti associati
                    </h2>

                    {terapisti.length === 0 ? (
                        <p className="text-slate-500">
                            Nessun terapista assegnato
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {terapisti.map((t) => (
                                <span
                                    key={t.id}
                                    className="rounded-full bg-slate-100 px-3 py-1 text-sm"
                                >
                                    {t.nome} {t.cognome}
                                </span>
                            ))}
                        </div>
                    )}
                </section>

                {/* =======================
                    DATI CLINICI
                ======================== */}
                <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                    <h2 className="text-xl font-semibold mb-4">Dati clinici</h2>

                    <Textarea
                        label="Diagnosi"
                        value={diagnosi}
                        onChange={setDiagnosi}
                    />

                    <Textarea
                        label="Note cliniche"
                        value={noteCliniche}
                        onChange={setNoteCliniche}
                    />

                    <Textarea
                        label="Obiettivi terapeutici"
                        value={obiettivi}
                        onChange={setObiettivi}
                    />

                    <Textarea
                        label="Osservazioni"
                        value={osservazioni}
                        onChange={setOsservazioni}
                    />

                    <div className="mt-4">
                        <button
                            onClick={handleSave}
                            className="rounded-xl bg-bluPrimary px-6 py-2 text-white hover:bg-bluSecondary"
                        >
                            Salva dati clinici
                        </button>
                    </div>
                </section>

                {/* =======================
                    DOCUMENTI CLINICI
                ======================== */}
                <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                    <h2 className="text-xl font-semibold mb-2">
                        📎 Documenti clinici
                    </h2>
                    <p className="text-slate-500 text-sm mb-4">
                        File caricati nella cartella clinica del paziente
                    </p>

                    {/* Qui rimane il tuo componente upload/lista */}
                    {/* <DocumentiClinici pazienteId={pazienteId} /> */}
                </section>
            </div>
        </Home>
    );
};

/* ===============================
   COMPONENTI DI SUPPORTO
================================ */
const Row = ({ label, value }) => (
    <tr>
        <td className="py-2 font-medium text-slate-600 w-1/3">{label}</td>
        <td className="py-2 text-slate-800">{value}</td>
    </tr>
);

const Textarea = ({ label, value, onChange }) => (
    <div className="mb-4">
        <label className="block text-sm text-slate-600 mb-1">{label}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:bg-white focus:border-bluPrimary"
        />
    </div>
);

export default CartellaClinica;
