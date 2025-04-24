import React, { useState, useEffect } from "react";
import { CheckboxRotondo } from "./atoms/checkboxRotondo";
import { IconInfoButtons } from "./atoms/iconInfoButtons";
import { ColonnaTabella } from "./atoms/ColonnaTabella";
import Select from "react-select";
import { baseCall } from "@/data/api/baseCall";
import { toast } from "react-toastify";

export const ListaAttesaRow = ({ index = 0, data = {} }) => {
    const [selezionato, setSelezionato] = useState(false);
    const [richiestaTerapista, setRichiestaTerapista] = useState(false);
    const [terapiaSelezionata, setTerapiaSelezionata] = useState(null);
    const [terapistaSelezionato, setTerapistaSelezionato] = useState(null);
    const [professioniOptions, setProfessioniOptions] = useState([]);
    const [terapistiOptions, setTerapistiOptions] = useState([]);

    useEffect(() => {
        fetchProfessioni();
        fetchTerapisti();
    }, []);

    const fetchProfessioni = async () => {
        try {
            const response = await baseCall({ endpoint: "/professioni/terapisti", method: "GET" });
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

    const fetchTerapisti = async () => {
        try {
            const response = await baseCall({ endpoint: "/terapisti", method: "GET" });
            setTerapistiOptions(Object.values(response.data));
        } catch (error) {
            toast.error("Errore nel recupero dei terapisti");
            console.error("Errore terapisti:", error);
        }
    };

    const pTagStyle = "font-inter text-black text-[14px]";
    const dateStyle = "font-inter text-[#3DA4DD] text-[14px]";

    return (
        <div className="bg-white flex flex-row w-[95%] h-auto py-2 mx-4 items-center gap-4 rounded-[8px] pl-2">
            <CheckboxRotondo
                checked={selezionato}
                onChange={(e) => setSelezionato(e.target.checked)}
            />

<div className="flex-1 flex flex-row items-center justify-between text-black text-[14px]">
<ColonnaTabella width="w-[60px]"><p className={pTagStyle}>{index + 1}°</p></ColonnaTabella>
<ColonnaTabella><p className={pTagStyle}>{data.nome || "Giulio"}</p></ColonnaTabella>
<ColonnaTabella><p className={pTagStyle}>{data.cognome || "Rossi"}</p></ColonnaTabella>
<ColonnaTabella><p className={dateStyle}>{data.dataAppuntamento || "14/05/2025"}</p></ColonnaTabella>

<ColonnaTabella width="w-[160px]">
        <Select
            options={professioniOptions}
            value={terapiaSelezionata}
            onChange={setTerapiaSelezionata}
            placeholder="Tipo terapia"
            className="text-[12px]"
            isSearchable={false}
        />
 </ColonnaTabella>
 <ColonnaTabella width="w-[180px]">
        <label className="flex items-center gap-2 text-sm">
            <input
                type="checkbox"
                checked={richiestaTerapista}
                onChange={(e) => setRichiestaTerapista(e.target.checked)}
            />
            Richiesta terapista
        </label>
        {richiestaTerapista && (
            <Select
                options={terapistiOptions}
                value={terapistaSelezionato}
                onChange={setTerapistaSelezionato}
                placeholder="Seleziona terapista"
                className="text-[12px] w-full"
                isSearchable
            />
        )}
</ColonnaTabella>

<ColonnaTabella>
    <IconInfoButtons />
</ColonnaTabella>
</div>

        </div>
    );
};
