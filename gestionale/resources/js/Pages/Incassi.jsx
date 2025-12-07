import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Home from "./Home";
import { BoxIncassiContainer } from "../components/molecules/boxIncassiContainer";
import { AggiungiPagamentoButton } from "../components/molecules/atoms/aggiungiPagementoButton";
import { BarChartWidget } from "../components/BarChartWidget";
import { getIncassiAnnui } from "../data/api/pagamenti";

const Incassi = () => {
    const { props } = usePage();
    const ruolo = props.ruolo;
    const isAdmin = ruolo === "admin";
    const terapistaId = props?.logged_user?.id_utente;

    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [chartData, setChartData] = useState({ labels: [], values: [] });

    const handleNuovoPagamento = () => {
        setReloadTrigger((prev) => !prev);
    };

    useEffect(() => {
        const loadStats = async () => {
            try {
                const rawData = await getIncassiAnnui(
                    ruolo === "staff" ? terapistaId : null
                );
                const data = Object.values(rawData);
                const labels = data.map((item) => item.anno);
                const values = data.map((item) => parseFloat(item.totale));
                setChartData({ labels, values });
            } catch (error) {
                console.error(
                    "Errore caricando i dati del grafico:",
                    error.message
                );
            }
        };

        loadStats();
    }, [reloadTrigger]);

    return (
        <Home>
            <div className="flex w-full h-full overflow-y-auto p-4">
                <div className="w-fit h-full p-4">
                    <BoxIncassiContainer
                        reloadTrigger={reloadTrigger}
                        ruolo={ruolo}
                        terapistaId={terapistaId}
                    />
                </div>

                <div className="flex flex-col flex-grow h-full items-end ">
                    {props.ruolo === "admin" && (
                        <div className="flex flex-row justify-end w-full mb-8">
                            <AggiungiPagamentoButton
                                onPagamentoAggiunto={handleNuovoPagamento}
                            />
                        </div>
                    )}

                    <div className="w-[90%] bg-white shadow-md rounded-lg p-4 ">
                        <BarChartWidget
                            data={chartData}
                            title="Totale Incassi per Anno"
                            description="Visualizzazione degli incassi annuali"
                            height={400}
                        />
                    </div>
                </div>
            </div>
        </Home>
    );
};

export default Incassi;
