import React from "react";
import Home from "./Home";
import {
    FaExclamationTriangle,
    FaUsers,
    FaSignature,
    FaCalendarAlt,
    FaMoneyCheckAlt,
    FaFileAlt,
    FaFolderOpen,
    FaBellSlash,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Pill = ({ children }) => (
    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs font-medium">
        {children}
    </span>
);

const DangerBanner = ({ title, children }) => (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5">
        <div className="flex items-start gap-3">
            <FaExclamationTriangle className="h-6 w-6 text-red-600 shrink-0" />
            <div>
                <h3 className="font-semibold text-red-700">{title}</h3>
                <p className="mt-1 text-sm text-red-800">{children}</p>
            </div>
        </div>
    </div>
);

const DangerCard = ({ icon: Icon, title, badge, description, onDelete }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-content-center rounded-xl bg-gray-100 text-gray-700">
                <Icon className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
                <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
                {badge && (
                    <div className="mt-1">
                        <Pill>{badge}</Pill>
                    </div>
                )}
            </div>
        </div>

        <p className="mt-4 text-sm text-gray-700">{description}</p>

        <div className="mt-6">
            <button
                type="button"
                onClick={onDelete}
                className="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 active:bg-red-100"
            >
                Elimina Dati
            </button>
        </div>
    </div>
);

const NOTE_ITEMS = [
    "Aver effettuato un backup completo del sistema",
    "Aver ottenuto le autorizzazioni necessarie",
    "Aver verificato che i dati non siano necessari in piattaforma",
];

const CARDS = [
    {
        title: "Lista d'Attesa",
        badge: "Gestione Pazienti",
        description:
            "Rimuove tutti i pazienti dalla lista d'attesa del sistema",
        icon: FaUsers,
        endpoint: "/admin/utilita/purge/waitlist",
    },
    {
        title: "Archivio Firme",
        badge: "Documenti",
        description: "Elimina tutte le firme digitali salvate nel sistema",
        icon: FaSignature,
        endpoint: "/admin/utilita/purge/signatures",
    },
    {
        title: "Appuntamenti",
        badge: "Pianificazione",
        description:
            "Cancella tutti gli appuntamenti programmati dal calendario",
        icon: FaCalendarAlt,
        endpoint: "/admin/utilita/purge/appointments",
    },
    {
        title: "Registro Incassi",
        badge: "Amministrazione",
        description: "Elimina tutti i record delle transazioni finanziarie",
        icon: FaMoneyCheckAlt,
        endpoint: "/admin/utilita/purge/payments",
    },
    {
        title: "Tariffario",
        badge: "Amministrazione",
        description: "Rimuove tutte le tariffe e listini prezzi configurati",
        icon: FaFileAlt,
        endpoint: "/admin/utilita/purge/prices",
    },
    {
        title: "Cartelle Cliniche",
        badge: "Dati Clinici",
        description:
            "Elimina definitivamente tutte le cartelle cliniche dei pazienti",
        icon: FaFolderOpen,
        endpoint: "/admin/utilita/purge/medical-charts",
    },
    // {
    //     title: "Notifiche di Sistema",
    //     badge: "Comunicazioni",
    //     description:
    //         "Elimina tutte le notifiche più vecchie di 90 giorni per evitare l'accumulo di dati inutili.",
    //     icon: FaBellSlash,
    //     endpoint: "/admin/utilita/purge/notifications",
    // },
];

const Utilità = () => {
    const handleDeleteClick = async (card) => {
        if (!confirm(`Confermi l'eliminazione definitiva di: ${card.title}?`)) {
            return;
        }

        try {
            const response = await fetch(card.endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                },
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Operazione completata.");
            } else {
                toast.error(
                    data.message ||
                        "Si è verificato un errore nell'eliminazione dei dati."
                );
            }
        } catch (error) {
            console.error(error);
            toast.error("Errore di connessione al server.");
        }
    };

    return (
        <Home>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-1">
                    Amministrazione Sistema
                </h1>
                <p className="mb-6 text-gray-600">
                    Gestione avanzata delle operazioni di manutenzione e pulizia
                    dati
                </p>

                {/* Banner Avviso Critico */}
                <DangerBanner title="Attenzione - Operazioni Critiche">
                    Le operazioni seguenti comportano l'eliminazione definitiva
                    dei dati. Verificare di aver effettuato backup appropriati
                    prima di procedere.
                </DangerBanner>

                {/* NOTE IMPORTANTI */}
                <div className="mt-6 rounded-xl border border-[#6BB2DF] bg-[#E8F4FB] p-6">
                    <h2 className="text-xl font-semibold text-[#064B72]">
                        Note Importanti
                    </h2>
                    <p className="mt-2 text-gray-700">
                        Prima di procedere con qualsiasi operazione di
                        eliminazione, assicurarsi di:
                    </p>
                    <ul className="mt-4 space-y-2">
                        {NOTE_ITEMS.map((t, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-[#6BB2DF]"></span>
                                <span className="text-gray-800">{t}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Griglia Card */}
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {CARDS.map((c) => (
                        <DangerCard
                            key={c.title}
                            title={c.title}
                            badge={c.badge}
                            description={c.description}
                            icon={c.icon}
                            onDelete={() => handleDeleteClick(c)}
                        />
                    ))}
                </div>
            </div>

            {/* Toast Container */}
            <ToastContainer position="top-right" autoClose={3000} />
        </Home>
    );
};

export default Utilità;
