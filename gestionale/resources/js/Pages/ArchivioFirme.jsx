import React, { useState, useEffect } from "react";
import Home from "./Home";
import ArchivioFirmeTable from "../components/archivioFirmeTable";
import CustomModal from "../components/customModal";
import ModalContentAggiuntaFirma from "../components/molecules/modalContentAggiuntaFirma";
import { toast } from "react-toastify";
import { FiPlus } from "react-icons/fi";
import Select from "react-select";
import axios from "axios";

const ArchivioFirme = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [meseFiltro, setMeseFiltro] = useState(null);
    const [annoFiltro, setAnnoFiltro] = useState(null);
    const [firme, setFirme] = useState([]);

    const fetchFirme = async () => {
        try {
            const params = {};
            if (meseFiltro) params.mese = meseFiltro.value;
            if (annoFiltro) params.anno = annoFiltro.value;

            const res = await axios.get("/firme", { params });
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

    return (
        <Home>
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl text-gray-700 font-marcellusSC">ARCHIVIO FIRME</h1>
                        <p className="text-gray-500 text-sm">Storico firme pazienti</p>
                    </div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-pinkSecondary hover:bg-pinkPrimary text-white font-semibold py-3 px-6 rounded-[18px] flex items-center gap-2 "
                    >
                        <FiPlus />
                        Aggiungi Firma
                    </button>
                </div>

                <div className="flex gap-4 mb-4 items-center">
                    <div className="w-48">
                        <Select
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
                        />
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-[20px] p-4">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                        Firme Registrate
                    </h2>
                    <ArchivioFirmeTable dati={firme} onDelete={handleDelete} />
                </div>

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
            </div>
        </Home>
    );
};

export default ArchivioFirme;
