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
        const caricaLista = async () => {
            try {
                const response = await getListaAttesa(filters);
                setLista(Object.values(response?.data || []));
            } catch {
                toast.error("Errore nel caricamento della lista d'attesa");
            }
        };

        caricaLista();
    }, [refreshTrigger, filters]);

    const filtraLista = (dati) =>
        dati.filter((item) => {
            if (filters.tipoUtente === "registrato" && !item.utente_id)
                return false;
            if (filters.tipoUtente === "nuovo" && item.utente_id) return false;
            if (filters.terapia && item.terapia !== filters.terapia)
                return false;
            if (filters.richiestaTerapista && !item.terapista_id)
                return false;
            return true;
        });

    const contaFiltriAttivi = () =>
        ["tipoUtente", "terapia", "richiestaTerapista"].filter(
            (k) => filters[k]
        ).length;

    const listaFiltrata = filtraLista(lista);

    return (
        <div className="flex flex-col gap-2 w-full h-full">
            {/* INFO BAR */}
            <div className="flex justify-between items-center px-6 min-h-[24px]">
                <span
                    className={`text-sm font-marcellus text-gray-600 ${
                        contaFiltriAttivi() === 0 ? "invisible" : ""
                    }`}
                >
                    Filtri attivi: {contaFiltriAttivi()}
                </span>

                <span className="text-sm font-marcellus text-gray-600">
                    Totale in lista: {listaFiltrata.length}
                </span>
            </div>

            {/* HEADER (desktop / tablet) */}
            <ListaAttesaHeader />

            {/* RIGHE */}
            <div className="flex flex-col gap-3 mb-8 md:overflow-y-auto md:max-h-[60%]">
                {listaFiltrata.length > 0 ? (
                    listaFiltrata.map((item, index) => (
                        <ListaAttesaRow
                            key={item.id}
                            data={item}
                            index={index}
                            aggiornaLista={aggiornaLista}
                        />
                    ))
                ) : (
                    <div className="flex justify-center text-gray-500 mt-8">
                        Nessun utente in lista d'attesa.
                    </div>
                )}
            </div>
        </div>
    );
};
