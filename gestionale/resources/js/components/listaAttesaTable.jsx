import React, { useEffect, useState } from "react";
import { ListaAttesaHeader } from "./molecules/listaAttesaHeader";
import { ListaAttesaRow } from "./molecules/listaAttesaRow";
import { getListaAttesa } from "@/data/api/listaAttesa";
import { toast } from "react-toastify";

export const ListaAttesaTable = ({
    refreshTrigger,
    aggiornaLista,
    filters,
}) => {
    const [lista, setLista] = useState([]);

    useEffect(() => {
        console.log("Filters usati:", filters);
        const caricaLista = async () => {
            try {
                const response = await getListaAttesa(filters);
                const listaRicevuta = Object.values(response?.data || []);
                setLista(listaRicevuta);
            } catch (error) {
                toast.error("Errore nel caricamento della lista d'attesa");
            }
        };

        caricaLista();
    }, [refreshTrigger, filters]);

    const filtraLista = (dati) => {
        return dati.filter((item) => {
            // tipo utente
            if (filters.tipoUtente === "registrato" && !item.utente_id)
                return false;
            if (filters.tipoUtente === "nuovo" && item.utente_id) return false;

            // terapia
            if (filters.terapia && item.terapia !== filters.terapia)
                return false;

            // richiesta terapista
            if (filters.richiestaTerapista && !item.terapista_id) return false;

            return true;
        });
    };

    const contaFiltriAttivi = (filters) => {
        let count = 0;
        if (filters.tipoUtente) count++;
        if (filters.terapia) count++;
        if (filters.richiestaTerapista) count++;
        return count;
    };

    return (
        <div className="flex flex-col gap-2 w-full  h-full overflow-hidden">
            <div className="flex justify-between items-center px-8 min-h-[24px] ">
                <span
                    className={`text-sm font-marcellus text-gray-600 ${
                        contaFiltriAttivi(filters) === 0 ? "invisible" : ""
                    }`}
                >
                    Filtri attivi: {contaFiltriAttivi(filters)}
                </span>

                <span className="text-sm font-marcellus text-gray-600">
                    Totale in lista: {filtraLista(lista).length}
                </span>
            </div>

            
            <ListaAttesaHeader />

            <div className="overflow-y-auto flex flex-col max-h-[60%] mb-8 ">
                {lista.length > 0 ? (
                    filtraLista(lista).map((item, index) => (
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
        </div>
    );
};
