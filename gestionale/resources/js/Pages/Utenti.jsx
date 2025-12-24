import React, { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import { baseCall } from "../data/api/baseCall.js";
import Home from "./Home.jsx";
import Select from "react-select";
import { toast } from "react-toastify";
import {
    FaUser,
    FaUserMd,
    FaPlus,
    FaPhone,
    FaEnvelope,
    FaEdit,
    FaTrash,
    FaFilter,
    FaSearch,
    FaBirthdayCake,
    FaVenusMars,
    FaBroom,
    FaNotesMedical,
} from "react-icons/fa";
import ModalContentAggiungiUtente from "../components/molecules/ModalContentAggiungiUtente.jsx";
import CustomModal from "../components/customModal.jsx";
import ModalContentModificaUtente from "../components/molecules/modalContentModificaUtente.jsx";

/* --------- helpers --------- */
const calcEta = (dateStr) => {
    if (!dateStr) return null;
    const nascita = new Date(dateStr);
    const today = new Date();
    let years = today.getFullYear() - nascita.getFullYear();
    const m = today.getMonth() - nascita.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < nascita.getDate())) years--;
    return years;
};

const ageOptions = [
    { label: "3", value: { min: 3, max: 3 } },
    { label: "4", value: { min: 4, max: 4 } },
    { label: "5", value: { min: 5, max: 5 } },
    { label: "6", value: { min: 6, max: 6 } },
    { label: "7", value: { min: 7, max: 7 } },
    { label: "8+", value: { min: 8, max: null } },
];

const sessoOptions = [
    { label: "Maschio", value: "M" },
    { label: "Femmina", value: "F" },
];

const CONTROL_H = 48;

const makeSelectStyles = () => ({
    container: (b) => ({ ...b, width: "100%" }),
    control: (base, state) => ({
        ...base,
        borderRadius: 12,
        borderColor: state.isFocused ? "#d1d5db" : "#e2e8f0",
        minHeight: CONTROL_H,
        height: CONTROL_H,
        backgroundColor: "#f8fafc",
        boxShadow: "none",
        ":hover": { borderColor: "#cbd5e1" },
    }),
    indicatorsContainer: (b) => ({ ...b, gap: 4, height: CONTROL_H }),
    dropdownIndicator: (b) => ({ ...b, padding: 8 }),
    clearIndicator: (b) => ({ ...b, padding: 6 }),
    indicatorSeparator: () => ({ display: "none" }),
    input: (b) => ({ ...b, margin: 0, padding: 0 }),
    placeholder: (b) => ({ ...b, color: "#64748b", fontSize: "12px" }),
    singleValue: (b) => ({ ...b, color: "#0f172a", fontSize: "12px" }),
    menu: (b) => ({ ...b, borderRadius: 12, overflow: "hidden", zIndex: 30 }),
});

const fieldLabel = "block text-sm text-slate-600 mb-1";

const InputWithIcon = ({ icon: Icon, ...props }) => (
    <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Icon className="h-4 w-4" />
        </div>
        <input
            {...props}
            className={`w-full h-12 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4
      outline-none focus:bg-white focus:border-bluPrimary`}
        />
    </div>
);

const Toggle = ({
    checked,
    onChange,
    label = "Collaborazione terapisti",
}) => (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 h-12">
        <span className="text-sm text-slate-700">
            {label}
        </span>

        <button
            type="button"
            onClick={() => onChange(!checked)}
            aria-pressed={checked}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${checked ? "bg-bluPrimary" : "bg-slate-300"}`}
        >
            <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform
                    ${checked ? "translate-x-5" : "translate-x-1"}`}
            />
        </button>
    </div>
);

const ContactButtons = ({ telefono, email }) => {
    const [popupContent, setPopupContent] = useState(null);

    const handlePhoneClick = () => {
        if (telefono) setPopupContent(`Telefono: ${telefono}`);
        else toast.warning("Numero di telefono non disponibile");
    };

    const handleMailClick = () => {
        if (email) setPopupContent(`Email: ${email}`);
        else toast.warning("Email non disponibile");
    };

    return (
        <>
            <div className="flex items-center gap-3 text-slate-600">
                <button
                    type="button"
                    onClick={handlePhoneClick}
                    className="p-2 rounded-md hover:bg-slate-100"
                    aria-label="Mostra telefono"
                    title="Mostra telefono"
                >
                    <FaPhone className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={handleMailClick}
                    className="p-2 rounded-md hover:bg-slate-100"
                    aria-label="Mostra email"
                    title="Mostra email"
                >
                    <FaEnvelope className="h-4 w-4" />
                </button>
            </div>

            {popupContent && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 z-[9998]"
                        onClick={() => setPopupContent(null)}
                    />
                    <div
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-lg rounded-md z-[9999] p-6 w-[min(90vw,420px)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-gray-800 text-lg">{popupContent}</p>
                        <button
                            onClick={() => setPopupContent(null)}
                            className="mt-4 text-sm text-slate-700 underline"
                        >
                            Chiudi
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

/* --------- DeleteConfirmModal --------- */
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, utente }) => {
    const [typed, setTyped] = useState("");
    if (!isOpen) return null;

    const fullName = `${utente?.nome ?? ""} ${utente?.cognome ?? ""}`.trim();
    const canDelete =
        fullName.length > 0 &&
        typed.trim().toLowerCase() === fullName.toLowerCase();

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 z-[9998]"
                onClick={onClose}
            />
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl z-[9999] w-[min(90vw,560px)] p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-semibold text-red-700 mb-2">
                    Eliminazione utente
                </h3>
                <p className="text-sm text-slate-700">
                    Stai per eliminare <b>{fullName || "utente"}</b>. Questa
                    azione rimuoverà anche:
                </p>
                <ul className="list-disc pl-6 my-3 text-sm text-slate-700">
                    <li>
                        associazioni in <b>pazienti_terapisti</b>
                    </li>
                    <li>
                        dati in <b>staff_dati</b>
                    </li>
                    <li>
                        cartella in <b>cartelle_cliniche</b>
                    </li>
                    <li>
                        tutti gli <b>appuntamenti</b> collegati
                    </li>
                </ul>
                <p className="text-sm text-slate-700 mb-3">
                    Per confermare digita il nome completo:{" "}
                    <b>{fullName || "(Nome Cognome)"}</b>
                </p>
                <input
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    placeholder={fullName || "Nome Cognome"}
                    className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none focus:bg-white focus:border-red-400"
                />

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-4 h-10"
                    >
                        Annulla
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={!canDelete}
                        className={`rounded-xl px-4 h-10 text-white ${
                            canDelete
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-red-300 cursor-not-allowed"
                        }`}
                    >
                        Elimina definitivamente
                    </button>
                </div>
            </div>
        </>
    );
};

/* --------- page --------- */
const Utenti = () => {
    const [tab, setTab] = useState("pazienti");
    const [openModal, setOpenModal] = useState(false);
    const [modalTipo, setModalTipo] = useState("paziente");

    const pazientiRefetchRef = useRef(null);
    const staffRefetchRef = useRef(null);

    const { props } = usePage();
    const ruolo = props?.ruolo;

    useEffect(() => {
        if (ruolo === "staff") {
            setTab("pazienti");
        }
    }, [ruolo]);

    const openAddModal = () => {
        setModalTipo(tab === "pazienti" ? "paziente" : "staff");
        setOpenModal(true);
    };

    const handleModalSubmit = (resp) => {
        const tipo = resp?.data?.utente?.ruolo || modalTipo;
        if (tipo === "paziente") pazientiRefetchRef.current?.();
        else staffRefetchRef.current?.();
    };

    return (
        <Home>
            <div className="min-h-full overflow-y-auto ">
                {/* Header */}
                <div className="mx-auto max-w-7xl px-6 pt-8">
                    <div className="rounded-2xl bg-white px-6 py-6 shadow-sm ring-1 ring-slate-100">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">
                                    Gestione Utenti
                                </h1>
                                <p className="mt-1 text-slate-600">
                                    Gestisci pazienti e staff del centro medico
                                </p>
                            </div>

                            {/* MOBILE: CTA FULL WIDTH */}
                            {ruolo === "admin" && (
                                <button
                                    onClick={openAddModal}
                                    className="
                md:hidden
                w-full
                inline-flex items-center justify-center gap-2
                rounded-xl
                bg-bluPrimary
                px-4 py-3
                text-white
                hover:bg-bluSecondary
            "
                                >
                                    <FaPlus />
                                    Aggiungi Utente
                                </button>
                            )}

                            {/* DESKTOP: CTA A DESTRA */}
                            {ruolo === "admin" && (
                                <button
                                    onClick={openAddModal}
                                    className="
                hidden md:inline-flex
                items-center gap-2
                rounded-xl
                bg-bluPrimary
                px-4 py-2
                text-white
                hover:bg-bluSecondary
            "
                                >
                                    <FaPlus />
                                    Aggiungi Utente
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                {ruolo !== "staff" && (
                    <div className="mx-auto max-w-7xl px-6 mt-4">
                        <div className="rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-100">
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => setTab("pazienti")}
                                    className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition ${
                                        tab === "pazienti"
                                            ? "bg-pinkSecondary text-white"
                                            : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                                    }`}
                                >
                                    <FaUser />
                                    Pazienti
                                </button>
                                <button
                                    onClick={() => setTab("staff")}
                                    className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition ${
                                        tab === "staff"
                                            ? "bg-bluSecondary text-white "
                                            : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                                    }`}
                                >
                                    <FaUserMd />
                                    Staff
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="mx-auto max-w-7xl px-6 pb-20">
                    {ruolo === "staff" ? (
                        <PazientiView
                            registerRefetch={(fn) =>
                                (pazientiRefetchRef.current = fn)
                            }
                            ruolo={ruolo}
                        />
                    ) : tab === "pazienti" ? (
                        <PazientiView
                            registerRefetch={(fn) =>
                                (pazientiRefetchRef.current = fn)
                            }
                            ruolo={ruolo}
                        />
                    ) : (
                        <StaffView
                            registerRefetch={(fn) =>
                                (staffRefetchRef.current = fn)
                            }
                            ruolo={ruolo}
                        />
                    )}
                </div>
            </div>

            <CustomModal
                isOpen={openModal}
                onRequestClose={() => setOpenModal(false)}
                title="Aggiungi utente"
                className="w-[95vw] sm:w-[90vw] md:w-[60%] max-h-[90vh]  overflow-hidden rounded-[20px] shadow-lg"
            >
                <ModalContentAggiungiUtente
                    tipoIniziale={modalTipo}
                    onSubmit={(resp) => {
                        handleModalSubmit(resp);
                        setOpenModal(false);
                    }}
                    onClose={() => setOpenModal(false)}
                />
            </CustomModal>
        </Home>
    );
};

export default Utenti;

/* -------------------- Views -------------------- */

function PazientiView({ registerRefetch, ruolo }) {
    const [loading, setLoading] = useState(true);
    const [pazienti, setPazienti] = useState([]);

    // delete state
    const [toDelete, setToDelete] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);

    const confirmDelete = (utente) => {
        setToDelete(utente);
        setOpenDelete(true);
    };

    const [openEditModal, setOpenEditModal] = useState(false);
    const [utenteSelezionato, setUtenteSelezionato] = useState(null);

    const apriModifica = (utente) => {
        setUtenteSelezionato(utente);
        setOpenEditModal(true);
    };

    const doDelete = async () => {
        try {
            await baseCall({
                endpoint: `/utenti/${toDelete.id}`,
                method: "DELETE",
            });
            toast.success("Utente eliminato con tutti i dati collegati.");
            setOpenDelete(false);
            setToDelete(null);
            await fetchPazienti();
        } catch (e) {
            console.error(e);
            const msg =
                e?.response?.data?.message || "Errore durante l'eliminazione.";
            toast.error(msg);
        }
    };

    // filtri
    const [query, setQuery] = useState("");
    const [etaOpt, setEtaOpt] = useState(null);
    const [sessoOpt, setSessoOpt] = useState(null);
    const [terapistaOpt, setTerapistaOpt] = useState(null);
    const [multi, setMulti] = useState(false);
    const [terapistiOptions, setTerapistiOptions] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await baseCall({
                    endpoint: "/terapisti",
                    method: "GET",
                });
                const normalized = Array.isArray(data)
                    ? data
                    : data && typeof data === "object"
                    ? Object.values(data)
                    : [];
                setTerapistiOptions(normalized);
            } catch (e) {}
        })();
    }, []);

    const fetchPazienti = async () => {
        setLoading(true);
        try {
            const params = {
                search: query || undefined,
                sesso: sessoOpt?.value || undefined,
                eta_min: etaOpt?.value?.min ?? undefined,
                eta_max: etaOpt?.value?.max ?? undefined,
                terapista_id: terapistaOpt?.value || undefined,
                multi_terapisti: multi || undefined,
            };
            const { data } = await baseCall({
                endpoint: "/get-pazienti",
                method: "GET",
                params,
            });

            const normalized = Array.isArray(data)
                ? data
                : data && typeof data === "object" && Array.isArray(data.data)
                ? data.data
                : data && typeof data === "object"
                ? Object.values(data)
                : [];

            setPazienti(normalized);
        } catch (e) {
            console.error("Fetch pazienti failed:", e);
            setPazienti([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPazienti();
        // eslint-disable-next-line
    }, [query, etaOpt, sessoOpt, terapistaOpt, multi]);

    useEffect(() => {
        registerRefetch?.(fetchPazienti);
    }, [registerRefetch]);

    const resetFiltri = () => {
        setQuery("");
        setEtaOpt(null);
        setSessoOpt(null);
        setTerapistaOpt(null);
        setMulti(false);
    };

    const filtered = pazienti;

    return (
        <>
            {/* Filtri Pazienti */}
            <section className="mt-6 mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <div className="mb-5 flex items-center gap-3 text-slate-900">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                        <FaFilter />
                    </span>
                    <h2 className="text-xl font-semibold">Filtri Pazienti</h2>
                </div>

                <div className="grid grid-cols-12 gap-x-5 gap-y-4">
                    {/* Cerca */}
                    <div className="col-span-12 xl:col-span-5">
                        <label className={fieldLabel}>Cerca per nome</label>
                        <InputWithIcon
                            icon={FaSearch}
                            placeholder="Cerca paziente..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    {/* Età */}
                    <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-2">
                        <label className={fieldLabel}>Età</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <FaBirthdayCake className="h-4 w-4" />
                            </div>
                            <Select
                                styles={makeSelectStyles(true)}
                                placeholder="Seleziona età"
                                options={ageOptions}
                                value={etaOpt}
                                onChange={setEtaOpt}
                                isClearable
                            />
                        </div>
                    </div>

                    {/* Sesso */}
                    <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-2">
                        <label className={fieldLabel}>Sesso</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <FaVenusMars className="h-4 w-4" />
                            </div>
                            <Select
                                styles={makeSelectStyles(true)}
                                placeholder="Seleziona sesso"
                                options={sessoOptions}
                                value={sessoOpt}
                                onChange={setSessoOpt}
                                isClearable
                            />
                        </div>
                    </div>

                    {/* Terapista  */}

                    <div className="col-span-12 md:col-span-4 xl:col-span-3">
                        <label className={fieldLabel}>Terapista</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <FaUserMd className="h-4 w-4" />
                            </div>
                            <Select
                                styles={makeSelectStyles(true)}
                                placeholder="Seleziona terapista"
                                options={terapistiOptions}
                                value={terapistaOpt}
                                onChange={setTerapistaOpt}
                                isClearable
                            />
                        </div>
                    </div>

                    {/* Collaborazione */}

                     <div className="col-span-12 md:col-span-6 xl:col-span-4">
                        <Toggle checked={multi} onChange={setMulti} />
                    </div>

                    {/* Reset */}
                    <div className="col-span-12 xl:col-span-3 xl:col-start-10">
                        <button
                            onClick={resetFiltri}
                            className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200  text-slate-700 hover:bg-slate-50 text-[14px]"
                        >
                            <FaBroom />
                            Cancella Filtri
                        </button>
                    </div>
                </div>
            </section>

            {/* Tabella Pazienti */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                        <FaUser />
                    </span>
                    <h2 className="text-xl font-semibold text-slate-900">
                        Pazienti ({loading ? "…" : filtered.length})
                    </h2>
                </div>

                <Table
                    headers={[
                        "Nome",
                        "Cognome",
                        "Età",
                        "Sesso",
                        "Contatti",
                        "Terapisti",
                        ruolo === "staff" ? "Cartella" : "Azioni",
                    ]}
                >
                    {loading ? (
                        <tr>
                            <td
                                className="px-4 py-6 text-slate-500"
                                colSpan={7}
                            >
                                Caricamento…
                            </td>
                        </tr>
                    ) : filtered.length === 0 ? (
                        <tr>
                            <td
                                className="px-4 py-6 text-slate-500"
                                colSpan={7}
                            >
                                Nessun paziente trovato
                            </td>
                        </tr>
                    ) : (
                        filtered.map((p) => {
                            const anni = calcEta(p.nascita);
                            return (
                                <tr key={p.id} className="text-slate-800">
                                    <td className="px-4 py-4">
                                        {p.nome ?? "-"}
                                    </td>
                                    <td className="px-4 py-4">
                                        {p.cognome ?? "-"}
                                    </td>
                                    <td className="px-4 py-4">
                                        {anni != null ? `${anni} anni` : "-"}
                                    </td>
                                    <td className="px-4 py-4">
                                        {p.sesso ?? "-"}
                                    </td>
                                    <td className="px-4 py-4">
                                        <ContactButtons
                                            telefono={p.telefono}
                                            email={p.email}
                                        />
                                    </td>

                                    {/* TERAPISTI: render dal backend */}
                                    <td className="px-4 py-4 align-top">
                                        {/* Mobile: primo + contatore */}
                                        <div className="md:hidden">
                                            {Array.isArray(p.terapisti) &&
                                            p.terapisti.length > 0 ? (
                                                <div className="flex items-center gap-2">
                                                    <Chip>
                                                        <FaUserMd className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                                        <span className="max-w-[10rem] truncate inline-block align-middle">
                                                            {
                                                                p.terapisti[0]
                                                                    .nome
                                                            }{" "}
                                                            {
                                                                p.terapisti[0]
                                                                    .cognome
                                                            }
                                                        </span>
                                                    </Chip>
                                                    {p.terapisti.length > 1 && (
                                                        <span className="text-xs text-slate-500">
                                                            +
                                                            {p.terapisti
                                                                .length - 1}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-slate-400 text-sm">
                                                    —
                                                </div>
                                            )}
                                        </div>

                                        {/* Desktop: tutte le chip */}
                                        <div className="hidden md:flex md:flex-wrap md:gap-2">
                                            {Array.isArray(p.terapisti) &&
                                            p.terapisti.length > 0 ? (
                                                p.terapisti.map((t) => (
                                                    <Chip key={t.id}>
                                                        <FaUserMd className="mr-1 h-3 w-3" />
                                                        <span className="max-w-[14rem] truncate inline-block align-middle text-[11px]">
                                                            {t.nome} {t.cognome}
                                                        </span>
                                                    </Chip>
                                                ))
                                            ) : (
                                                <div className="text-slate-400 text-sm">
                                                    —
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-4 py-4">
                                        {ruolo === "staff" ? (
                                            <Link
                                                href={`/cartella-clinica/${p.id}`}
                                                className="rounded-[12px] bg-bluSecondary text-white flex text-center justify-center text-[12px] p-2"
                                            >
                                                Cartella clinica
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-4">
                                                <button
                                                    className="text-sky-700 hover:text-sky-900"
                                                    onClick={() =>
                                                        apriModifica(p)
                                                    }
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() =>
                                                        confirmDelete(p)
                                                    }
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </Table>
            </section>

            <DeleteConfirmModal
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                onConfirm={doDelete}
                utente={toDelete}
            />

            <CustomModal
                isOpen={openEditModal}
                onRequestClose={() => setOpenEditModal(false)}
                title="Modifica utente"
                 className="w-[95vw] sm:w-[90vw] md:w-[60%] max-h-[90vh]  overflow-hidden rounded-[20px] shadow-lg"
            >
                <ModalContentModificaUtente
                    utente={utenteSelezionato}
                    onSubmit={() => {
                        setOpenEditModal(false);
                        fetchPazienti();
                    }}
                    onClose={() => setOpenEditModal(false)}
                />
            </CustomModal>
        </>
    );
}

function StaffView({ registerRefetch, ruolo }) {
    const [loading, setLoading] = useState(true);
    const [staff, setStaff] = useState([]);

    // delete state
    const [toDelete, setToDelete] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);

    const confirmDelete = (utente) => {
        setToDelete(utente);
        setOpenDelete(true);
    };

    const [openEditModal, setOpenEditModal] = useState(false);
    const [utenteSelezionato, setUtenteSelezionato] = useState(null);

    const apriModifica = (utente) => {
        setUtenteSelezionato(utente);
        setOpenEditModal(true);
    };

    const doDelete = async () => {
        try {
            await baseCall({
                endpoint: `/utenti/${toDelete.id}`,
                method: "DELETE",
            });
            toast.success("Utente eliminato con tutti i dati collegati.");
            setOpenDelete(false);
            setToDelete(null);
            await fetchStaff();
        } catch (e) {
            console.error(e);
            toast.error("Errore durante l'eliminazione.");
        }
    };

    // filtri
    const [query, setQuery] = useState("");
    const [sessoOpt, setSessoOpt] = useState(null);
    const [terapiaOpt, setTerapiaOpt] = useState(null);
    const [professioniOptions, setProfessioniOptions] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await baseCall({
                    endpoint: "/professioni/terapisti",
                    method: "GET",
                });
                const normalized = Array.isArray(data)
                    ? data
                    : data && typeof data === "object"
                    ? Object.values(data)
                    : [];
                setProfessioniOptions(
                    normalized.map((p) => ({ label: p, value: p }))
                );
            } catch (e) {}
        })();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const params = {
                search: query || undefined,
                sesso: sessoOpt?.value || undefined,
                professione: terapiaOpt?.value || undefined,
            };

            const { data } = await baseCall({
                endpoint: "/utenti/staff",
                method: "GET",
                params,
            });

            const normalized = Array.isArray(data)
                ? data
                : data && typeof data === "object"
                ? Object.values(data)
                : [];
            setStaff(normalized);
        } catch (e) {
            console.error("Fetch staff failed:", e);
            setStaff([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
        // eslint-disable-next-line
    }, [query, sessoOpt, terapiaOpt]);

    useEffect(() => {
        registerRefetch?.(fetchStaff);
    }, [registerRefetch]);

    const resetFiltri = () => {
        setQuery("");
        setSessoOpt(null);
        setTerapiaOpt(null);
    };

    const filtered = staff;

    return (
        <>
            {/* Filtri Staff */}
            <section className="mt-6 mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <div className="mb-5 flex items-center gap-3 text-slate-900">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                        <FaFilter />
                    </span>
                    <h2 className="text-xl font-semibold">Filtri Staff</h2>
                </div>

                <div className="grid grid-cols-12 gap-x-5 gap-y-4">
                    <div className="col-span-12 xl:col-span-5">
                        <label className={fieldLabel}>Cerca per nome</label>
                        <InputWithIcon
                            icon={FaSearch}
                            placeholder="Cerca staff..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3">
                        <label className={fieldLabel}>Sesso</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <FaVenusMars className="h-4 w-4" />
                            </div>
                            <Select
                                styles={makeSelectStyles(true)}
                                placeholder="Seleziona sesso"
                                options={sessoOptions}
                                value={sessoOpt}
                                onChange={setSessoOpt}
                                isClearable
                            />
                        </div>
                    </div>

                    <div className="col-span-12 sm:col-span-6 lg:col-span-5 xl:col-span-4">
                        <label className={fieldLabel}>Terapia</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <FaNotesMedical className="h-4 w-4" />
                            </div>
                            <Select
                                styles={makeSelectStyles(true)}
                                placeholder="Seleziona terapia"
                                options={professioniOptions}
                                value={terapiaOpt}
                                onChange={setTerapiaOpt}
                                isClearable
                            />
                        </div>
                    </div>

                    <div className="col-span-12 xl:col-span-3 xl:col-start-10">
                        <button
                            onClick={resetFiltri}
                            className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-slate-700 hover:bg-slate-50 text-[14px]"
                        >
                            <FaBroom />
                            Cancella Filtri
                        </button>
                    </div>
                </div>
            </section>

            {/* Tabella Staff */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                        <FaUserMd />
                    </span>
                    <h2 className="text-xl font-semibold text-slate-900">
                        Staff ({loading ? "…" : filtered.length})
                    </h2>
                </div>

                <Table
                    headers={[
                        "Nome",
                        "Cognome",
                        "Età",
                        "Sesso",
                        "Contatti",
                        "Azioni",
                    ]}
                >
                    {loading ? (
                        <tr>
                            <td
                                className="px-4 py-6 text-slate-500"
                                colSpan={6}
                            >
                                Caricamento…
                            </td>
                        </tr>
                    ) : filtered.length === 0 ? (
                        <tr>
                            <td
                                className="px-4 py-6 text-slate-500"
                                colSpan={6}
                            >
                                Nessun membro dello staff
                            </td>
                        </tr>
                    ) : (
                        filtered.map((u) => {
                            const anni = calcEta(u.nascita);
                            return (
                                <tr key={u.id} className="text-slate-800">
                                    <td className="px-4 py-4">
                                        {u.nome ?? "-"}
                                    </td>
                                    <td className="px-4 py-4">
                                        {u.cognome ?? "-"}
                                    </td>
                                    <td className="px-4 py-4">
                                        {anni != null ? `${anni} anni` : "-"}
                                    </td>
                                    <td className="px-4 py-4">
                                        {u.sesso ?? "-"}
                                    </td>
                                    <td className="px-4 py-4">
                                        <ContactButtons
                                            telefono={u.telefono}
                                            email={u.email}
                                        />
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => apriModifica(u)} 
                                                className="text-sky-700 hover:text-sky-900"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(u)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </Table>
            </section>

            <DeleteConfirmModal
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                onConfirm={doDelete}
                utente={toDelete}
            />

            <CustomModal
                isOpen={openEditModal}
                onRequestClose={() => setOpenEditModal(false)}
                title="Modifica utente"
               className="w-[95vw] sm:w-[90vw] md:w-[60%] max-h-[90vh] overflow-hidden rounded-[20px] shadow-lg"
            >
                <ModalContentModificaUtente
                    utente={utenteSelezionato}
                    onSubmit={() => {
                        setOpenEditModal(false);
                        fetchStaff();
                    }}
                    onClose={() => setOpenEditModal(false)}
                />
            </CustomModal>
        </>
    );
}

/* -------------------- Table helper -------------------- */
function Table({ headers, children }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 md:table-fixed">
                <thead>
                    <tr className="text-left text-slate-500">
                        {headers.map((h, i) => (
                            <th
                                key={i}
                                className={`bg-slate-50 px-4 py-3 text-sm font-medium ${
                                    i === 0 ? "rounded-l-xl" : ""
                                } ${
                                    i === headers.length - 1
                                        ? "rounded-r-xl"
                                        : ""
                                }`}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">{children}</tbody>
            </table>
        </div>
    );
}

const Chip = ({ children }) => (
    <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 text-xs sm:text-sm px-2.5 sm:px-3 py-1">
        {children}
    </span>
);
