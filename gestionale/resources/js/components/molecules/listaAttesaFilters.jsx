import React, { useEffect, useState } from "react";
import Select from "react-select";
import { FilterItem } from "../molecules/atoms/fiterItem.jsx";
import { baseCall } from "@/data/api/baseCall";
import { toast } from "react-toastify";

export const ListaAttesaFilters = ({onFilterChange}) => {
    const [professioniOptions, setProfessioniOptions] = useState([]);
    const [professioneSelezionata, setProfessioneSelezionata] = useState(null);
    const [richiestaTerapistaSpecifico, setRichiestaTerapistaSpecifico] = useState(false);
    const [tipoUtente, setTipoUtente] = useState(null); 

    useEffect(() => {
        fetchProfessioni();
    }, []);

    useEffect(() => {
    onFilterChange({
        tipoUtente: tipoUtente, // registrato / nuovo / null
        terapia: professioneSelezionata?.value || null,
        richiestaTerapista: richiestaTerapistaSpecifico,
    });
}, [professioneSelezionata, richiestaTerapistaSpecifico, tipoUtente]);


    const fetchProfessioni = async () => {

        try {
            const response = await baseCall({
                endpoint: "/professioni/terapisti",
                method: "GET",
            });
    
            const options = Object.values(response.data).map((professione) => ({
                value: professione,
                label: professione,
            }));
            
            setProfessioniOptions(options);
        } catch (error) {
            console.error("Errore nel recupero professioni:", error);
            toast.error("Errore nel recupero delle professioni");
        }
    };
    

      return (
        <div className="flex flex-row w-full gap-4 items-center flex-wrap">
            <FilterItem
                text="PAZIENTI REGISTRATI"
                bgColor="blu"
                isActive={tipoUtente === "registrato"}
                onClick={() =>
                    setTipoUtente((prev) => (prev === "registrato" ? null : "registrato"))
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

            <div className="w-40 min-w-[200px]">
                <Select
                    options={professioniOptions}
                    value={professioneSelezionata}
                    onChange={setProfessioneSelezionata}
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

            <label className="flex items-center gap-2 text-sm font-marcellus">
                <input
                    type="checkbox"
                    checked={richiestaTerapistaSpecifico}
                    onChange={(e) => setRichiestaTerapistaSpecifico(e.target.checked)}
                />
                Richiesta terapista specifico
            </label>
        </div>
    );
};