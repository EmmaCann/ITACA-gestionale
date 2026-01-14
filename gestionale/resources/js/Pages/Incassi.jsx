import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Home from "./Home";
import { BoxIncassiContainer } from "../components/molecules/boxIncassiContainer";
import { AggiungiPagamentoButton } from "../components/molecules/atoms/aggiungiPagementoButton";
import { BarChartWidget } from "../components/BarChartWidget";
import { getIncassiAnnui } from "../data/api/pagamenti";
import { FaFileExcel } from "react-icons/fa";

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
            <div
                className="
        flex flex-col md:flex-row
        flex-wrap
        w-full min-h-full
        p-4
        gap-6 md:gap-12
        items-center
        justify-center
    "
            >
                {/* WRAPPER INTERNO PER LIMITARE LA LARGHEZZA E MIGLIORARE IL LAYOUT */}
                <div className="w-full max-w-[1500px] flex flex-col md:flex-row flex-wrap gap-6 md:gap-12 justify-center">
                    {/* MOBILE: AGGIUNGI PAGAMENTO IN ALTO */}
                    {isAdmin && (
                        <div className="w-full flex justify-center md:hidden mb-8">
                            <AggiungiPagamentoButton
                                onPagamentoAggiunto={handleNuovoPagamento}
                            />
                        </div>
                    )}

                    {/* COLONNA SINISTRA */}
                    <div className="w-full md:w-auto flex justify-center md:justify-start">
                        <BoxIncassiContainer
                            reloadTrigger={reloadTrigger}
                            ruolo={ruolo}
                            terapistaId={terapistaId}
                        />
                    </div>

                    {/* COLONNA DESTRA */}
                    <div className="flex-1 w-full flex flex-col items-center gap-6">
                        {isAdmin && (
                            <div className="w-full justify-end hidden md:flex">
                                <AggiungiPagamentoButton
                                    onPagamentoAggiunto={handleNuovoPagamento}
                                />
                            </div>
                        )}

                        <div
                            className="
                    w-full 
                    bg-white shadow-md rounded-lg 
                    p-4 md:p-6
                    max-w-full md:max-w-[750px]
                "
                        >
                            <BarChartWidget
                                data={chartData}
                                title="Totale Incassi per Anno"
                                description="Visualizzazione degli incassi annuali"
                                height={300}
                            />
                        </div>

                        {ruolo === "staff" && (
                            <div className="mt-6 flex justify-center">
                                <button
                                    onClick={() => {
                                        window.location.href =
                                            "/incassi/export-mensili";
                                    }}
                                    className="
                flex items-center gap-2
                bg-gray-200 hover:bg-gray-300
                text-gray-700
                text-sm
                px-4 py-2
                rounded-md
            "
                                >
                                    <FaFileExcel className="text-green-600" />
                                    Esporta incassi 
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Home>
    );
};

export default Incassi;
