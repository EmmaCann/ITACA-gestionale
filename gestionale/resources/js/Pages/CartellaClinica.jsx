import React, { useEffect, useState } from "react";
import Home from "./Home";
import { usePage } from "@inertiajs/react";
import { baseCall } from "../data/api/baseCall";
import { toast } from "react-toastify";
import { SiGoogledocs } from "react-icons/si";
import { CiMedicalClipboard } from "react-icons/ci";
import { FaUserDoctor } from "react-icons/fa6";
import { BsFileEarmarkMedical } from "react-icons/bs";

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
    const [uploading, setUploading] = useState(false);

    // campi modificabili
    const [anamnesi, setAnamnesi] = useState("");
    const [diagnosi, setDiagnosi] = useState("");
    const [terapia, setTerapia] = useState("");
    const [note, setNote] = useState("");

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
            if (data.cartella) {
                setAnamnesi(data.cartella.anamnesi || "");
                setDiagnosi(data.cartella.diagnosi || "");
                setTerapia(data.cartella.terapia || "");
                setNote(data.cartella.note || "");
            }
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
                method: "PUT",
                data: {
                    anamnesi,
                    diagnosi,
                    terapia,
                    note,
                },
            });

            toast.success("Dati clinici salvati con successo");
            fetchAll();
        } catch (e) {
            console.error(e);
            toast.error("Errore durante il salvataggio");
        }
    };

    const handleUploadFiles = async (e) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        const formData = new FormData();

        Array.from(selectedFiles).forEach((file) => {
            formData.append("files[]", file);
        });

        try {
            setUploading(true);

            await baseCall({
                endpoint: `/cartella-clinica/${pazienteId}/files`,
                method: "POST",
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("File caricati con successo");
            fetchAll();
        } catch (e) {
            console.error(e);
            toast.error("Errore nel caricamento dei file");
        } finally {
            setUploading(false);
            e.target.value = ""; // reset input
        }
    };

    const handleDownload = (fileId) => {
        window.open(`/cartella-clinica/file/${fileId}/download`, "_blank");
    };

    const handleDelete = async (fileId) => {
        if (!confirm("Vuoi eliminare definitivamente questo file?")) return;

        try {
            await baseCall({
                endpoint: `/cartella-clinica/file/${fileId}`,
                method: "DELETE",
            });

            toast.success("File eliminato");
            setFiles((prev) => prev.filter((f) => f.id !== fileId));
        } catch (e) {
            console.error(e);
            toast.error("Errore durante l'eliminazione");
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
                    <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                            <BsFileEarmarkMedical className="text-xl" />
                        </span>
                        <h2 className="text-xl font-semibold">
                            Anagrafica paziente
                        </h2>
                    </div>

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
                    <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                            <FaUserDoctor className="text-xl" />
                        </span>
                        <h2 className="text-xl font-semibold">
                            Terapisti associati
                        </h2>
                    </div>

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
                    <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                            <CiMedicalClipboard className="text-xl" />
                        </span>
                        <h2 className="text-xl font-semibold">Dati clinici</h2>
                    </div>

                    {cartella && (
                        <p className="text-sm text-slate-500 mb-4">
                            Creata il:{" "}
                            <span className="font-medium text-slate-700">
                                {formatDateTime(cartella?.created_at)}
                            </span>
                            <br />
                            Ultimo aggiornamento:{" "}
                            <span className="font-medium text-slate-700">
                                {formatDateTime(cartella?.updated_at)}
                            </span>
                        </p>
                    )}

                    <Textarea
                        label="Anamnesi"
                        value={anamnesi}
                        onChange={setAnamnesi}
                    />

                    <Textarea
                        label="Diagnosi"
                        value={diagnosi}
                        onChange={setDiagnosi}
                    />

                    <Textarea
                        label="Terapia"
                        value={terapia}
                        onChange={setTerapia}
                    />

                    <Textarea
                        label="Note cliniche"
                        value={note}
                        onChange={setNote}
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
                    {/* HEADER */}
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                                <SiGoogledocs className="text-xl" />
                            </span>
                            <h2 className="text-xl font-semibold">
                                Documenti clinici
                            </h2>
                        </div>

                        {/* UPLOAD */}
                        <label className="cursor-pointer rounded-xl bg-bluPrimary px-4 py-2 text-sm text-white hover:bg-bluSecondary">
                            {uploading ? "Caricamento..." : "Carica file"}
                            <input
                                type="file"
                                multiple
                                onChange={handleUploadFiles}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* LISTA FILE */}
                    {files.length === 0 ? (
                        <p className="text-slate-500 text-sm">
                            Nessun documento caricato
                        </p>
                    ) : (
                        <div className="divide-y rounded-xl border border-slate-200">
                            {files.map((f) => (
                                <div
                                    key={f.id}
                                    className="flex items-center justify-between px-4 py-3"
                                >
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            {f.original_name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Caricato da {f.uploader} ·{" "}
                                            {f.created_at}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleDownload(f.id)}
                                            className="text-sky-600 hover:text-sky-800 text-sm"
                                        >
                                            Download
                                        </button>

                                        <button
                                            onClick={() => handleDelete(f.id)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Elimina
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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

const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default CartellaClinica;
