import React from "react";
import Home from "./Home";
import { BoxIncassiContainer } from "../components/molecules/boxIncassiContainer";
import { AggiungiPagamentoButton } from "../components/molecules/atoms/aggiungiPagementoButton";

const Incassi = () => {
    return (
        <Home>
            {/* Contenitore principale diviso in due colonne */}
            <div className="flex w-full h-full">
                
                {/* Colonna Sinistra: Box Incassi */}
                <div className="w-fit h-full  p-4">
                    <BoxIncassiContainer />
                </div>

                {/* Colonna Destra: Contenuto Variabile */}
                <div className="flex flex-col flex-grow h-full items-end ">
                    
                    {/* Riga superiore con il bottone "Aggiungi Pagamento" */}
                    <div className="flex flex-row justify-end w-full mb-4">
                        <AggiungiPagamentoButton />
                    </div>

                    {/* Div Bianco - 400px di altezza, tutto lo spazio disponibile in larghezza */}
                    <div className="w-[90%] h-[65%] bg-white shadow-md rounded-lg flex ">
                        {/* Qui puoi aggiungere il contenuto */}
                    </div>

                </div>
            </div>
        </Home>
    );
};

export default Incassi;
