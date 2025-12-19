import React, { useEffect, useState } from "react";
import Home from "./Home";
import { baseCall } from "../data/api/baseCall";
import { toast } from "react-toastify";
import { BsFileEarmarkMedical } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import { CiMedicalClipboard } from "react-icons/ci";

const PazienteInfo = () => {
    const [loading, setLoading] = useState(true);

    const [paziente, setPaziente] = useState(null);
    const [cartella, setCartella] = useState(null);
    const [terapisti, setTerapisti] = useState([]);

    useEffect(() => {
        fetchInfo();
    }, []);

    const fetchInfo = async () => {
        try {
            setLoading(true);

            const { data } = await baseCall({
                endpoint: "/paziente/cartella-clinica",
                method: "GET",
            });

            setPaziente(data.paziente);
            setCartella(data.cartella);
            setTerapisti(data.terapisti || []);
        } catch (e) {
            console.error(e);
            toast.error("Errore nel caricamento delle informazioni");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Home>
                <div className="p-6 text-slate-500">Caricamento…</div>
            </Home>
        );
    }

    return (
        <Home>
            <div className="max-w-5xl mx-auto p-6 space-y-6">
                {/* =======================
                    DATI ANAGRAFICI
                ======================== */}
                <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                    <Header
                        icon={BsFileEarmarkMedical}
                        title="Dati anagrafici"
                    />

                    <table className="w-full text-sm">
                        <tbody className="divide-y">
                            <Row label="Nome" value={paziente?.nome} />
                            <Row label="Cognome" value={paziente?.cognome} />
                            <Row
                                label="Data di nascita"
                                value={formatDate(paziente?.nascita)}
                            />
                            <Row
                                label="In terapia presso lo studio dal"
                                value={formatDate(paziente?.created_at)}
                            />
                        </tbody>
                    </table>
                </section>

                {/* =======================
                    TERAPISTI
                ======================== */}
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
                        <p className="text-sm text-slate-500">
                            Nessun terapista associato al momento
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {terapisti.map((t) => (
                                <span
                                    key={t.id}
                                    className="rounded-full bg-slate-100 px-4 py-1.5 text-sm text-slate-700"
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
                    <Header
                        icon={CiMedicalClipboard}
                        title="Informazioni cliniche"
                    />

                    {!cartella ? (
                        <p className="text-slate-500 text-sm">
                            Nessuna informazione clinica disponibile.
                        </p>
                    ) : (
                        <div className="space-y-4 text-sm text-slate-700">
                            <Info label="Diagnosi" value={cartella.diagnosi} />
                            <Info label="Terapia" value={cartella.terapia} />
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
const Header = ({ icon: Icon, title }) => (
    <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Icon className="text-xl" />
        </span>
        <h2 className="text-xl font-semibold">{title}</h2>
    </div>
);

const Row = ({ label, value }) => (
    <tr>
        <td className="py-2 font-medium text-slate-600 w-1/3">{label}</td>
        <td className="py-2 text-slate-800">{value || "-"}</td>
    </tr>
);

const Info = ({ label, value }) => (
    <div>
        <p className="font-medium text-slate-600">{label}</p>
        <p className="mt-1 whitespace-pre-line">{value || "-"}</p>
    </div>
);

const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

export default PazienteInfo;
