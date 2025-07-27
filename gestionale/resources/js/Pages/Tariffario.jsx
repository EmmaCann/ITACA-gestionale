import React, { useEffect, useState } from "react";
import Home from "./Home";
import TariffarioTable from "../components/tariffarioTable";
import AddButtonTariffario from "../components/molecules/atoms/addButtonTariffario";
import CustomModal from "../components/customModal";
import ModalContentTariffaInserimento from "../components/molecules/ModalContentTariffaInserimento";
import { baseCall } from "@/data/api/baseCall";
import { toast } from "react-toastify";

const Tariffario = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [tariffe, setTariffe] = useState([]);

    const fetchTariffe = async () => {
        try {
            const response = await baseCall({
                endpoint: "/tariffe",
                method: "GET",
            });

            console.log("TARIFFE API RESPONSE:", response.data);

            const tariffe = Object.values(response.data);
            setTariffe(tariffe);
        } catch (error) {
            toast.error("Errore nel recupero delle tariffe");
        }
    };

    useEffect(() => {
        fetchTariffe();
    }, []);

    return (
        <Home>
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-700 font-marcellusSC">
                            Gestione Tariffe
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Gestisci i prezzi per dottori e terapie
                        </p>
                    </div>
                    <AddButtonTariffario onClick={() => setModalOpen(true)} />
                </div>

                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                        Tariffe Correnti
                    </h2>
                    <TariffarioTable dati={tariffe} onUpdated={fetchTariffe} />
                </div>

                <CustomModal
                    isOpen={modalOpen}
                    onRequestClose={() => setModalOpen(false)}
                    title="Nuova Tariffa"
                    className="max-w-xl"
                >
                    <ModalContentTariffaInserimento
                        onClose={() => setModalOpen(false)}
                        onSubmit={fetchTariffe}
                    />
                </CustomModal>
            </div>
        </Home>
    );
};

export default Tariffario;
