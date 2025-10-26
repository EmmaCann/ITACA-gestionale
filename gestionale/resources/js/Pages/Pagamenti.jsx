import React, { useState } from "react";
import Home from "./Home";
import Select from "react-select";
import {
    FiCreditCard,
    FiCalendar,
    FiAlertCircle,
    FiCheckCircle,
} from "react-icons/fi";

const Pagamenti = () => {
    // ---- mock options per i Select (non filtrano ancora) ----
    const monthOptions = [
        { value: "all", label: "Tutti" },
        { value: "10", label: "Ottobre" },
        { value: "11", label: "Novembre" },
    ];
    const yearOptions = [
        { value: "2025", label: "2025" },
        { value: "2024", label: "2024" },
    ];
    const therapistOptions = [
        { value: "all", label: "Tutti" },
        { value: "rossi", label: "Dr. Mario Rossi" },
        { value: "bianchi", label: "Dr.ssa Laura Bianchi" },
        { value: "verdi", label: "Dr. Giuseppe Verdi" },
    ];

    // solo per evidenziare lo stile del tab (nessuna logica)
    const [activeTab, setActiveTab] = useState("tutti");

    // classi Tailwind per react-select (unstyled)
    const selectClassNames = {
        control: ({ isFocused }) =>
            `min-h-11 rounded-xl border bg-white text-sm px-2
       ${
           isFocused
               ? "border-bluPrimary ring-2 ring-bluPrimary/20"
               : "border-slate-200"
       }
       hover:border-bluSecondary shadow-none`,
        valueContainer: () => "px-1",
        indicatorsContainer: () => "pr-1",
        dropdownIndicator: () => "p-1 text-slate-500",
        menu: () =>
            "mt-1 rounded-xl border border-slate-200 shadow-lg overflow-hidden z-50 bg-white",
        option: ({ isFocused, isSelected }) =>
            `px-3 py-2 text-sm cursor-pointer ${
                isSelected
                    ? "bg-bluPrimary text-white"
                    : isFocused
                    ? "bg-slate-100"
                    : "bg-white"
            }`,
        placeholder: () => "text-slate-500",
        singleValue: () => "text-slate-900",
        input: () => "text-slate-900",
    };

    // ---- dati mock per la tabella ----
    const rows = [
        {
            date: "15 ott 2025",
            therapist: "Dr. Mario Rossi",
            service: "Fisioterapia",
            amount: "€80.00",
            status: "paid",
        },
        {
            date: "8 ott 2025",
            therapist: "Dr.ssa Laura Bianchi",
            service: "Osteopatia",
            amount: "€120.00",
            status: "paid",
        },
        {
            date: "20 ott 2025",
            therapist: "Dr. Giuseppe Verdi",
            service: "Massoterapia",
            amount: "€60.00",
            status: "paid",
        },
        {
            date: "28 ott 2025",
            therapist: "Dr. Mario Rossi",
            service: "Fisioterapia",
            amount: "€100.00",
            status: "hold",
        },
        {
            date: "5 nov 2025",
            therapist: "Dr.ssa Laura Bianchi",
            service: "Osteopatia",
            amount: "€90.00",
            status: "hold",
        },
        {
            date: "22 ott 2025",
            therapist: "Dr. Giuseppe Verdi",
            service: "Massoterapia",
            amount: "€80.00",
            status: "overdue",
        },
    ];

    const StatusBadge = ({ status }) => {
        const map = {
            paid: {
                label: "Pagato",
                cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
                icon: <FiCheckCircle size={14} className="mr-1" />,
            },
            hold: {
                label: "In Sospeso",
                cls: "bg-amber-50 text-amber-700 border border-amber-200",
                icon: null,
            },
            overdue: {
                label: "Scaduto",
                cls: "bg-rose-50 text-rose-700 border border-rose-200",
                icon: null,
            },
        };
        const s = map[status] ?? map.paid;
        return (
            <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${s.cls}`}
            >
                {s.icon}
                {s.label}
            </span>
        );
    };

    return (
        <Home>
            <div className="min-h-screen bg-slate-50 p-6">
                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl font-[Marcellus_SC] text-slate-800 mb-2">
                        I Miei Pagamenti
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Monitora tutti i tuoi pagamenti e scadenze
                    </p>
                </div>

                {/* FILTRI (react-select statici) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">
                            Mese
                        </label>
                        <Select
                            unstyled
                            defaultValue={monthOptions[0]}
                            options={monthOptions}
                            classNames={selectClassNames}
                            components={{ IndicatorSeparator: null }}
                            placeholder="Tutti"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">
                            Anno
                        </label>
                        <Select
                            unstyled
                            defaultValue={yearOptions[0]}
                            options={yearOptions}
                            classNames={selectClassNames}
                            components={{ IndicatorSeparator: null }}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">
                            Terapista
                        </label>
                        <Select
                            unstyled
                            defaultValue={therapistOptions[0]}
                            options={therapistOptions}
                            classNames={selectClassNames}
                            components={{ IndicatorSeparator: null }}
                            placeholder="Tutti"
                        />
                    </div>
                </div>

                {/* STATISTICHE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-24">
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-900">
                            <FiCreditCard size={22} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">
                                Totale Pagato
                            </div>
                            <div className="font-[Marcellus] text-xl">
                                €260.00
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-900">
                            <FiCalendar size={22} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">
                                Da Pagare
                            </div>
                            <div className="font-[Marcellus] text-xl">
                                €270.00
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-900">
                            <FiAlertCircle size={22} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">
                                Scadenze Imminenti
                            </div>
                            <div className="font-[Marcellus] text-xl">1</div>
                        </div>
                    </div>
                </div>

                {/* TABS */}
                <div className="grid grid-cols-3 gap-3 mb-4 mt-8">
                    {[
                        { key: "tutti", label: "Tutti (6)" },
                        { key: "completati", label: "Completati (3)" },
                        { key: "dapagare", label: "Da Pagare (3)" },
                    ].map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setActiveTab(t.key)}
                            className={`w-full rounded-2xl px-4 py-3 text-center text-sm font-semibold transition
        ${
            activeTab === t.key
                ? "bg-gradient-to-r from-pinkSecondary/20 to-pinkSecondary/10 text-slate-800 border border-pinkSecondary/30 shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-pinkSecondary/10 hover:text-slate-700"
        }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* TABELLA */}
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    {/* header azzurro bluSecondary schiarito */}
                    <div className="grid grid-cols-12 items-center px-6 py-3 bg-bluSecondary/10 text-slate-700 font-semibold border-b border-bluSecondary/30">
                        <div className="col-span-3">Data</div>
                        <div className="col-span-3">Terapista</div>
                        <div className="col-span-3">Prestazione</div>
                        <div className="col-span-2">Importo</div>
                        <div className="col-span-1">Stato</div>
                    </div>

                    {rows.map((r, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-12 items-center px-6 py-4 border-t border-slate-100 hover:bg-slate-50/60"
                        >
                            <div className="col-span-3 font-semibold text-slate-800">
                                {r.date}
                            </div>
                            <div className="col-span-3 text-slate-700">
                                {r.therapist}
                            </div>
                            <div className="col-span-3 text-slate-700">
                                {r.service}
                            </div>
                            <div className="col-span-2 font-semibold text-slate-800">
                                {r.amount}
                            </div>
                            <div className="col-span-1">
                                <StatusBadge status={r.status} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Home>
    );
};

export default Pagamenti;
