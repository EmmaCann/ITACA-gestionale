import React, { useState } from "react";
import Home from "./Home";
import { ListaAttesaFilters } from "../components/molecules/listaAttesaFilters.jsx";
import { FABicon } from "../components/molecules/atoms/FABicon.jsx";
import { ListaAttesaTable } from "../components/listaAttesaTable.jsx";
import CustomModal from "../components/customModal.jsx";
import ModalContentListaAttesa from "../components/molecules/modalContentListaAttesa.jsx";

const ListaAttesa = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [filters, setFilters] = useState({});
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const aggiornaLista = () => setRefreshTrigger((prev) => prev + 1);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <Home hideFAB={true}>
            <div className="w-full flex flex-col gap-4 px-3">
                {/* FILTRI + AZIONE */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-8">
                    {/* BOTTONE AGGIUNGI */}
                    <div className="flex justify-end order-1 md:order-2">
                        <FABicon isFAB={false} onClick={openModal} />
                    </div>

                    {/* FILTRI */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm w-full order-2 md:order-1">
                        <ListaAttesaFilters
                            onFilterChange={handleFilterChange}
                        />
                    </div>
                </div>

                {/* TABELLA */}
                <div className="flex flex-col w-full flex-1">
                    <ListaAttesaTable
                        refreshTrigger={refreshTrigger}
                        aggiornaLista={aggiornaLista}
                        filters={filters}
                    />
                </div>
            </div>

            <CustomModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                title="Inserisci in lista d'attesa"
               className="w-[95vw] md:w-[60%] max-h-[90vh] overflow-hidden rounded-[20px] shadow-lg"

            >
                <ModalContentListaAttesa
                    onClose={closeModal}
                    onSubmit={() => {
                        aggiornaLista(); // forza refresh
                        closeModal();
                    }}
                />
            </CustomModal>
        </Home>
    );
};

export default ListaAttesa;
