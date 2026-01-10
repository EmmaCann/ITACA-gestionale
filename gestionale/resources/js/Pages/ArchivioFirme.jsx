import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Home from "./Home";

import ArchivioFirmeTable from "../components/archivioFirmeTable";
import CustomModal from "../components/customModal";
import ModalContentAggiuntaFirma from "../components/molecules/modalContentAggiuntaFirma";
import { toast } from "react-toastify";
import { FiPlus } from "react-icons/fi";
import { FaFileExcel } from "react-icons/fa";
import Select from "react-select";
import axios from "axios";

const ArchivioFirme = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [meseFiltro, setMeseFiltro] = useState(null);
    const [annoFiltro, setAnnoFiltro] = useState(null);
    const [oggiFiltro, setOggiFiltro] = useState(false);
    const [terapistaFiltro, setTerapistaFiltro] = useState(null);
    const [pazienteFiltro, setPazienteFiltro] = useState(null);

    const [terapistiOptions, setTerapistiOptions] = useState([]);
    const [pazientiOptions, setPazientiOptions] = useState([]);

    const [firme, setFirme] = useState([]);
    const { props } = usePage();
    const ruolo = props?.ruolo || null;
    const canEdit = ruolo !== "paziente";

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [tRes, pRes] = await Promise.all([
                    axios.get("/terapisti"),
                    axios.get("/get-pazienti"),
                ]);

                setTerapistiOptions(Object.values(tRes.data)); // [{value,label}]
                setPazientiOptions(Object.values(pRes.data)); // [{id,nome,cognome,...}]
            } catch (e) {
                console.error(e);
                toast.error("Errore nel recupero filtri (pazienti/terapisti)");
            }
        };

        fetchOptions();
    }, []);

    const fetchFirme = async () => {
        try {
            const params = {};
            if (meseFiltro) params.mese = meseFiltro.value;
            if (annoFiltro) params.anno = annoFiltro.value;
            if (oggiFiltro) params.oggi = 1;
            if (terapistaFiltro) params.terapista_id = terapistaFiltro.value; // /terapisti -> value
            if (pazienteFiltro) params.paziente_id = pazienteFiltro.id; // /get-pazienti -> id

            const endpoint = canEdit ? "/firme" : "/firme/paziente";
            const res = await axios.get(endpoint, { params });
            setFirme(res.data);
        } catch {
            toast.error("Errore nel recupero delle firme");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Sei sicuro di voler eliminare questa firma?")) return;

        try {
            await axios.delete(`/firme/${id}`);
            toast.success("Firma eliminata con successo");
            fetchFirme();
        } catch {
            toast.error("Errore durante l'eliminazione");
        }
    };

    const handleAddFirma = () => {
        fetchFirme();
    };

    const handleExportExcel = () => {
        const params = new URLSearchParams();
        if (meseFiltro) params.append("mese", meseFiltro.value);
        if (annoFiltro) params.append("anno", annoFiltro.value);
        if (oggiFiltro) params.append("oggi", "1");
        if (terapistaFiltro)
            params.append("terapista_id", terapistaFiltro.value);
        if (pazienteFiltro) params.append("paziente_id", pazienteFiltro.id);

        window.location.href = `/firme/export?${params.toString()}`;
    };

    useEffect(() => {
        fetchFirme();
    }, [meseFiltro, annoFiltro, oggiFiltro, terapistaFiltro, pazienteFiltro]);

    const mesiOptions = [
        { value: 1, label: "Gennaio" },
        { value: 2, label: "Febbraio" },
        { value: 3, label: "Marzo" },
        { value: 4, label: "Aprile" },
        { value: 5, label: "Maggio" },
        { value: 6, label: "Giugno" },
        { value: 7, label: "Luglio" },
        { value: 8, label: "Agosto" },
        { value: 9, label: "Settembre" },
        { value: 10, label: "Ottobre" },
        { value: 11, label: "Novembre" },
        { value: 12, label: "Dicembre" },
    ];

    const currentYear = new Date().getFullYear();
    const anniOptions = Array.from({ length: 5 }, (_, i) => {
        const year = currentYear - i;
        return { value: year, label: year };
    });

    // const Layout = ruolo === "paziente" ? HomePaziente : Home;
    const Layout = Home;

    return (
        <Layout>
            <div className="p-4 md:p-8">
                {/* Barra superiore */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl text-gray-700 font-marcellusSC">
                            ARCHIVIO FIRME
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Storico firme pazienti
                        </p>
                    </div>

                    {/* MOBILE: CTA FULL WIDTH */}
                    {canEdit && (
                        <button
                            onClick={() => setModalOpen(true)}
                            className="
                md:hidden
                w-full
                flex items-center justify-center gap-2
                bg-pinkSecondary hover:bg-pinkPrimary
                text-white font-semibold
                py-3 px-6
                rounded-[18px]
            "
                        >
                            <FiPlus />
                            Aggiungi Firma
                        </button>
                    )}

                    {/* DESKTOP: CTA A DESTRA */}
                    {canEdit && (
                        <button
                            onClick={() => setModalOpen(true)}
                            className="
                hidden md:flex
                items-center gap-2
                bg-pinkSecondary hover:bg-pinkPrimary
                text-white font-semibold
                py-3 px-6
                rounded-[18px]
            "
                        >
                            <FiPlus />
                            Aggiungi Firma
                        </button>
                    )}
                </div>

                {/* Filtri */}
                <div className="mb-4">
                    <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:items-center md:gap-4">
                        {/* Mese */}
                        <div className="col-span-1 md:w-48">
                            <Select
                                classNamePrefix="filtro"
                                className="w-full"
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        borderRadius: "12px",
                                        minHeight: "44px",
                                    }),
                                }}
                                options={mesiOptions}
                                value={meseFiltro}
                                onChange={setMeseFiltro}
                                placeholder="Filtro mese"
                                isClearable
                            />
                        </div>

                        {/* Anno */}
                        <div className="col-span-1 md:w-48">
                            <Select
                                options={anniOptions}
                                value={annoFiltro}
                                onChange={setAnnoFiltro}
                                placeholder="Filtro anno"
                                isClearable
                                className="w-full"
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        borderRadius: "12px",
                                        minHeight: "44px",
                                    }),
                                }}
                            />
                        </div>

                        {/* Terapista (in mobile prende tutta la riga) */}
                        <div className="col-span-2 md:w-60">
                            <Select
                                options={terapistiOptions}
                                value={terapistaFiltro}
                                onChange={setTerapistaFiltro}
                                placeholder="Filtro terapista"
                                isClearable
                                isSearchable
                                className="w-full"
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        borderRadius: "12px",
                                        minHeight: "44px",
                                    }),
                                }}
                            />
                        </div>

                        {/* Paziente (solo admin/staff) */}
                        {canEdit && (
                            <div className="col-span-2 md:w-60">
                                <Select
                                    options={pazientiOptions}
                                    value={pazienteFiltro}
                                    onChange={setPazienteFiltro}
                                    placeholder="Filtro paziente"
                                    isClearable
                                    isSearchable
                                    className="w-full"
                                    getOptionLabel={(p) =>
                                        `${p.nome} ${p.cognome}`
                                    }
                                    getOptionValue={(p) => p.id}
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            borderRadius: "12px",
                                            minHeight: "44px",
                                        }),
                                    }}
                                />
                            </div>
                        )}

                        <div className="flex items-center h-[44px] px-3 rounded-[12px] border border-gray-200 bg-white">
                            <label className="flex items-center gap-2 text-sm text-gray-700 font-marcellus cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={oggiFiltro}
                                    onChange={(e) =>
                                        setOggiFiltro(e.target.checked)
                                    }
                                    className="accent-bluPrimary"
                                />
                                Oggi
                            </label>
                        </div>
                    </div>
                </div>

                {/* Tabella firme */}
                <div className="bg-white shadow-md rounded-[20px] p-4 ">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                        Firme Registrate
                    </h2>
                    <ArchivioFirmeTable
                        dati={firme}
                        onDelete={handleDelete}
                        canEdit={canEdit}
                    />
                </div>

                {/* Bottone export  (solo per utenti con permessi di editing) */}
                {canEdit && (
                    <div className="mt-12">
                        <button
                            onClick={handleExportExcel}
                            className="text-gray-600 bg-gray-200 hover:bg-gray-300 text-sm py-2 px-3 rounded-md flex items-center gap-1"
                        >
                            <FaFileExcel className="text-gray-500" />
                            Esporta Excel
                        </button>
                    </div>
                )}

                {/* Modal aggiunta firma */}
                {canEdit && (
                    <CustomModal
                        isOpen={modalOpen}
                        onRequestClose={() => setModalOpen(false)}
                        title="Nuova Firma"
                        className="max-w-xl"
                    >
                        <ModalContentAggiuntaFirma
                            onClose={() => setModalOpen(false)}
                            onSubmit={handleAddFirma}
                        />
                    </CustomModal>
                )}
            </div>
        </Layout>
    );
};

export default ArchivioFirme;
