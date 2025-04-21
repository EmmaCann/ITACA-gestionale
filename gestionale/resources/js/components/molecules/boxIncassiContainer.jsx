import React, { useEffect, useState } from "react";
import { BoxIncassi } from "./atoms/boxIncassi.jsx";
import { getStatsIncassi } from "../../data/api/pagamenti";

export const BoxIncassiContainer = ({ reloadTrigger }) => {
    const [incassi, setIncassi] = useState({
        giorno: 0,
        settimana: 0,
        mese: 0,
        anno: 0,
    });

    const fetchStats = async () => {
        try {
            const dati = await getStatsIncassi();
            setIncassi(dati);
        } catch (err) {
            console.error("Errore nel caricamento delle statistiche", err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [reloadTrigger]); 

    return (
        <div className="h-full flex flex-col w-fit gap-4 justify-center drop-shadow">
            <BoxIncassi text="INCASSI DEL GIORNO" money={`${incassi.giorno}€`} bgColor="#D8A4C9" />
            <BoxIncassi text="INCASSI DELLA SETTIMANA" money={`${incassi.settimana}€`} bgColor="#9BCEEB" />
            <BoxIncassi text="INCASSI DEL MESE" money={`${incassi.mese}€`} bgColor="#474849" />
            <BoxIncassi text="INCASSI DELL'ANNO" money={`${incassi.anno}€`} bgColor="#A0A1A1" />
        </div>
    );
};
