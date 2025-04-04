import React, { useState } from "react";
import Home from "./Home";
import CustomModal from "../components/customModal.jsx"; 

const ChiSiamo = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <Home>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Chi Siamo</h1>
                <p className="mb-6">Questa è la pagina delle informazioni su chi siamo.</p>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    Apri il Modal
                </button>

                {/* Modal */}
                <CustomModal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    title="Info extra"
                >
                    <div>
                        <p className="text-gray-700">Questo è un contenuto del modal!</p>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                        >
                            Chiudi
                        </button>
                    </div>
                </CustomModal>
            </div>
        </Home>
    );
};

export default ChiSiamo;
