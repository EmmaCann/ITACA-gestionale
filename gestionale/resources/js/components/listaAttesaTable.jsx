import React, { useEffect, useState } from "react";
import { ListaAttesaHeader } from "./molecules/listaAttesaHeader";
import { ListaAttesaRow } from "./molecules/listaAttesaRow";
import { getListaAttesa } from "@/data/api/listaAttesa";
import { toast } from "react-toastify";

export const ListaAttesaTable = ({ refreshTrigger, aggiornaLista, filters }) => {
    const [lista, setLista] = useState([]);

    useEffect(() => {
        const caricaLista = async () => {
            try {
                const response = await getListaAttesa();
                const listaRicevuta = Object.values(response?.data || []);
                setLista(filtraLista(listaRicevuta));
            } catch (error) {
                toast.error("Errore nel caricamento della lista d'attesa");
            }
        };

        caricaLista();
    }, [refreshTrigger, filters]);

    const filtraLista = (dati) => {
        return dati.filter((item) => {
            // tipo utente
            if (filters.tipoUtente === "registrato" && !item.utente_id) return false;
            if (filters.tipoUtente === "nuovo" && item.utente_id) return false;

            // terapia
            if (filters.terapia && item.terapia !== filters.terapia) return false;

            // richiesta terapista
            if (filters.richiestaTerapista && !item.terapista_id) return false;

            return true;
        });
    };

    return (
        <div className="flex flex-col gap-2 w-full overflow-y-auto h-full">
            <ListaAttesaHeader />
            {lista.length > 0 ? (
                lista.map((item, index) => (
                    <ListaAttesaRow
                        key={item.id}
                        data={item}
                        index={index}
                        aggiornaLista={aggiornaLista}
                    />
                ))
            ) : (
                <div className="flex flex-col items-center justify-center text-gray-500 mt-8 gap-2">
                    <div className="font-marcellus text-[18px] text-center">
                        Nessun utente in lista d'attesa al momento.
                    </div>
                </div>
            )}
        </div>
    );
};
