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
    const [firme, setFirme] = useState([]);
    const { props } = usePage();
    const ruolo = props?.ruolo || null;
    const canEdit = ruolo !== "paziente";

    const fetchFirme = async () => {
        try {
            const params = {};
            if (meseFiltro) params.mese = meseFiltro.value;
            if (annoFiltro) params.anno = annoFiltro.value;

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

        window.location.href = `/firme/export?${params.toString()}`;
    };

    useEffect(() => {
        fetchFirme();
    }, [meseFiltro, annoFiltro]);

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
    const Layout=Home;

    return (
        <Layout>
            <div className="p-8">
                {/* Barra superiore */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl text-gray-700 font-marcellusSC">
                            ARCHIVIO FIRME
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Storico firme pazienti
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {canEdit && (
                            <button
                                onClick={() => setModalOpen(true)}
                                className="bg-pinkSecondary hover:bg-pinkPrimary text-white font-semibold py-3 px-6 rounded-[18px] flex items-center gap-2"
                            >
                                <FiPlus />
                                Aggiungi Firma
                            </button>
                        )}
                    </div>
                </div>

                {/* Filtri */}
                <div className="flex gap-4 mb-4 items-center">
                    <div className="w-48 ">
                        <Select
                            classNamePrefix="filtro"
                            className="w-full"
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    borderRadius: "12px",
                                }),
                            }}
                            options={mesiOptions}
                            value={meseFiltro}
                            onChange={setMeseFiltro}
                            placeholder="Filtro mese"
                            isClearable
                        />
                    </div>
                    <div className="w-48">
                        <Select
                            options={anniOptions}
                            value={annoFiltro}
                            onChange={setAnnoFiltro}
                            placeholder="Filtro anno"
                            isClearable
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    borderRadius: "12px",
                                }),
                            }}
                        />
                    </div>
                </div>

                {/* Tabella firme */}
                <div className="bg-white shadow-md rounded-[20px] p-4 ">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                        Firme Registrate
                    </h2>
                    <ArchivioFirmeTable dati={firme} onDelete={handleDelete} canEdit={canEdit} />
                </div>

                {/* Bottone export discreto (solo per utenti con permessi di editing) */}
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
