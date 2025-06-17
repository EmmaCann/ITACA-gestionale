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
            <div className="w-full h-full flex flex-col overflow-hidden">
                <div className="flex flex-row w-full items-center justify-center p-2">
                     <ListaAttesaFilters onFilterChange={handleFilterChange} />
                    <FABicon isFAB={false} onClick={openModal} />
                </div>

                <div className="flex flex-col w-full h-full mt-4">
                    <ListaAttesaTable refreshTrigger={refreshTrigger} aggiornaLista={aggiornaLista} filters={filters} />

                </div>
            </div>

            <CustomModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                title="Inserisci in lista d'attesa"
                className="w-[60%] max-h-[90%] overflow-hidden rounded-[20px] shadow-lg"
            >
                <ModalContentListaAttesa
                    onClose={closeModal}
                    onSubmit={() => {
                        aggiornaLista(); // forza refresh
                        closeModal();
                    }}
                />
            </CustomModal>
        </Home >
    );
};

export default ListaAttesa;
