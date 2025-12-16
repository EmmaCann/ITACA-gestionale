import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import Home from "./Home";
import { baseCall } from "../data/api/baseCall";
import { toast } from "react-toastify";
import { FaUpload, FaFileWord } from "react-icons/fa";

export default function CartellaClinica() {
    const { props } = usePage();
    const { pazienteId, ruolo } = props;

    const [paziente, setPaziente] = useState(null);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (ruolo !== "staff") {
            toast.error("Accesso non autorizzato");
            return;
        }

        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await baseCall({
                endpoint: `/cartella-clinica/${pazienteId}/data`,
                method: "GET",
            });

            setPaziente(data.paziente);
            setFiles(data.files);
        } catch (e) {
            toast.error("Errore nel caricamento cartella clinica");
        }
    };

    const handleUpload = async (e) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles.length) return;

        const formData = new FormData();
        for (const f of selectedFiles) {
            formData.append("files[]", f);
        }

        try {
            setUploading(true);
            await baseCall({
                endpoint: `/cartella-clinica/${pazienteId}/files`,
                method: "POST",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("File caricati con successo");
            fetchData();
        } catch {
            toast.error("Errore upload file");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Home hideFAB>
            <div className="max-w-6xl mx-auto space-y-6">

                {/* DATI PAZIENTE */}
                {paziente && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-100">
                        <h2 className="text-xl font-semibold mb-2">
                            {paziente.nome} {paziente.cognome}
                        </h2>
                        <p className="text-sm text-slate-600">
                            Età: {paziente.eta ?? "-"} • Sesso: {paziente.sesso ?? "-"}
                        </p>
                    </div>
                )}

                {/* FILE */}
                <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Documenti clinici</h3>

                        <label className="cursor-pointer flex items-center gap-2 bg-bluPrimary text-white px-4 py-2 rounded-xl text-sm">
                            <FaUpload />
                            {uploading ? "Caricamento..." : "Carica file"}
                            <input
                                type="file"
                                multiple
                                hidden
                                onChange={handleUpload}
                            />
                        </label>
                    </div>

                    {files.length === 0 ? (
                        <p className="text-slate-500 text-sm">
                            Nessun documento caricato
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {files.map((f) => (
                                <li
                                    key={f.id}
                                    className="flex justify-between items-center border rounded-xl px-4 py-2 text-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <FaFileWord className="text-blue-600" />
                                        {f.original_name}
                                    </div>
                                    <div className="text-slate-500 text-xs">
                                        Caricato da {f.uploader}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </Home>
    );
}
