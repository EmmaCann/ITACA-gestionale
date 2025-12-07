import React, { useEffect, useState } from "react";
import Select from "react-select";
import { FilterItem } from "../molecules/atoms/fiterItem.jsx";
import { baseCall } from "@/data/api/baseCall";
import { toast } from "react-toastify";

export const IncassiFilters = ({ onFilterChange, ruolo }) => {
    const [professioniOptions, setProfessioniOptions] = useState([]);
    const [professioneSelezionata, setProfessioneSelezionata] = useState(null);
    const [tipoUtente, setTipoUtente] = useState(null);

    const [terapistiOptions, setTerapistiOptions] = useState([]);
    const [terapistaSelezionato, setTerapistaSelezionato] = useState(null);

    useEffect(() => {
        fetchProfessioni();
        fetchTerapisti();
    }, []);

    useEffect(() => {
        const payload = {
            tipoUtente: tipoUtente,
            terapia: professioneSelezionata?.value || null,
            terapista: terapistaSelezionato?.value || null,
        };
        console.log("[FILTER CHANGE] Payload inviato:", payload);
        onFilterChange(payload);
    }, [professioneSelezionata, tipoUtente, terapistaSelezionato]);

    const fetchProfessioni = async () => {
        try {
            const response = await baseCall({
                endpoint: "/professioni/terapisti",
                method: "GET",
            });
            const options = Object.values(response.data).map((item) => ({
                value: item,
                label: item,
            }));
            setProfessioniOptions(options);
        } catch (error) {
            console.error("Errore nel recupero professioni:", error);
            toast.error("Errore nel recupero delle professioni");
        }
    };

    const fetchTerapisti = async () => {
        try {
            const response = await baseCall({
                endpoint: "/terapisti",
                method: "GET",
            });

            console.log("[API] Terapisti ricevuti:", response.data);

            setTerapistiOptions(Object.values(response.data));
        } catch (error) {
            console.error("Errore nel recupero terapisti:", error);
            toast.error("Errore nel recupero dei terapisti");
        }
    };

    return (
        <div className="flex flex-row w-full gap-4 items-center justify-center flex-wrap">
            <FilterItem
                text="PAZIENTI REGISTRATI"
                bgColor="blu"
                isActive={tipoUtente === "registrato"}
                onClick={() =>
                    setTipoUtente((prev) =>
                        prev === "registrato" ? null : "registrato"
                    )
                }
            />
            <FilterItem
                text="NUOVI PAZIENTI"
                bgColor="rosa"
                isActive={tipoUtente === "nuovo"}
                onClick={() =>
                    setTipoUtente((prev) => (prev === "nuovo" ? null : "nuovo"))
                }
            />
            {ruolo === "admin" && (
                <div className="w-40 min-w-[200px]">
                    <Select
                        options={professioniOptions}
                        value={professioneSelezionata}
                        onChange={(val) => {
                            console.log("[SELECT] Terapia selezionata:", val);
                            setProfessioneSelezionata(val);
                        }}
                        placeholder="Seleziona tipologia terapia"
                        className="text-[12px]"
                        isSearchable
                        isClearable
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                borderRadius: "12px",
                            }),
                        }}
                    />
                </div>
            )}
            {ruolo === "admin" && (
                <div className="w-40 min-w-[200px]">
                    <Select
                        options={terapistiOptions}
                        value={terapistaSelezionato}
                        onChange={(val) => {
                            console.log("[SELECT] Terapista selezionato:", val);
                            setTerapistaSelezionato(val);
                        }}
                        placeholder="Seleziona un terapista"
                        className="text-[12px]"
                        isSearchable
                        isClearable
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                borderRadius: "12px",
                            }),
                        }}
                    />
                </div>
            )}
        </div>
    );
};
export default IncassiFilters;
