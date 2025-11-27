import React, { useEffect, useState } from "react";
import Home from "./Home";
import { usePage, Link } from "@inertiajs/react";
import { IncassiFilters } from "../components/molecules/incassiFilters";
import { BarChartWidget } from "../components/BarChartWidget";
import { DoughnutChartWidget } from "../components/DoughnutChartWidget";
import { getPagamentiFiltrati } from "../data/api/pagamenti";
import { format } from "date-fns";
import { it } from "date-fns/locale";

const DettaglioIncasso = () => {
    const { tipo } = usePage().props;
    const [filters, setFilters] = useState({});
    const [pagamenti, setPagamenti] = useState([]);
    const [barData, setBarData] = useState([]);
    const [pieData, setPieData] = useState({});
    const [statistiche, setStatistiche] = useState({
        totale: 0,
        numero: 0,
        conFattura: 0,
        senzaFattura: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPagamentiFiltrati({ tipo, ...filters });

                console.log("[API FETCH] Risposta pagamenti:", res);

                const pagamentiArray = res.pagamenti ?? [];
                setPagamenti(pagamentiArray);

                // Statistiche
                const totale = pagamentiArray.reduce(
                    (acc, p) => acc + parseFloat(p.importo),
                    0
                );

                const terapistiSet = new Set(
                    pagamentiArray.map((p) => p.terapista_id)
                );
                setStatistiche({
                    totale: res.totali.totale,
                    numero: res.totali.numero,
                    conFattura: res.totali.conFattura,
                    senzaFattura: res.totali.senzaFattura,
                });

                // Line Chart: importi per terapista
                const grouped = {};
                pagamentiArray.forEach((p) => {
                    const nome = `${p.terapista?.nome ?? ""} ${
                        p.terapista?.cognome ?? ""
                    }`.trim();
                    if (!grouped[nome]) grouped[nome] = 0;
                    grouped[nome] += parseFloat(p.importo);
                });

                const line = Object.entries(grouped).map(([nome, valore]) => ({
                    label: nome,
                    data: [valore],
                }));
                setBarData(line);

                // Pie Chart: tipo paziente
                const counts = { registrati: 0, non_registrati: 0 };
                pagamentiArray.forEach((p) => {
                    if (p.paziente_id) counts.registrati++;
                    else counts.non_registrati++;
                });

                setPieData({
                    labels: ["Registrati", "Non Registrati"],
                    values: [counts.registrati, counts.non_registrati],
                    colors: ["#4CAF50", "#B2EBF2"],
                });
            } catch (err) {
                console.error("Errore caricando i pagamenti:", err);
            }
        };

        fetchData();
    }, [tipo, filters]);

    return (
        <Home hideFAB={true}>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-marcellusSC">
                        RIEPILOGO INCASSI — {tipo?.toUpperCase()}
                    </h1>
                    <Link
                        href="/incassi"
                        className="bg-gradient-to-br from-[#3DA4DD] to-[#6BB2DF] text-white px-5 py-2 rounded-lg shadow-md hover:brightness-110 transition-all duration-200"
                    >
                        Torna a Incassi
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Totale Incassi */}
                    <div className="bg-gradient-to-br from-white to-[#E0F7FA] p-5 rounded-xl shadow-md text-center">

                        <h2 className="text-sm text-gray-600 font-medium">
                            Totale Incassi
                        </h2>
                        <p className="text-3xl font-bold text-[#3DA4DD] mt-1">
                            €{statistiche.totale.toFixed(2)}
                        </p>
                    </div>

                    {/* Totale (numero) */}
                    <div className="bg-gradient-to-br from-white to-[#DDEBFF] p-5 rounded-xl shadow-md text-center">
                        <h2 className="text-sm text-gray-600 font-medium">
                            Totale
                        </h2>
                        <p className="text-3xl font-bold text-blue-600 mt-1">
                            {statistiche.numero}
                        </p>
                    </div>

                    {/* Con fattura */}
                    <div className="bg-gradient-to-br from-white to-[#D6F2DD] p-5 rounded-xl shadow-md text-center">
                        <h2 className="text-sm text-gray-600 font-medium">
                            Con Fattura
                        </h2>
                        <p className="text-3xl font-bold text-green-600 mt-1">
                            €{statistiche.conFattura.toFixed(2)}
                        </p>
                    </div>

                    {/* Senza fattura */}
                    <div className="bg-gradient-to-br from-white to-[#FFF4C2] p-5 rounded-xl shadow-md text-center">
                        <h2 className="text-sm text-gray-600 font-medium">
                            Senza Fattura
                        </h2>
                        <p className="text-3xl font-bold text-yellow-600 mt-1">
                            €{statistiche.senzaFattura.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Filtri */}
                <div className="bg-white p-4 rounded shadow gap-8">
                    <IncassiFilters
                        onFilterChange={(filters) => {
                            console.log(
                                "[FILTER CHANGE - DettaglioIncasso] Ricevuto:",
                                filters
                            );
                            setFilters(filters);
                        }}
                    />
                </div>

                {/* Grafici */}
                <div className="flex flex-wrap gap-6 mt-4">
                    <div className="bg-white rounded shadow p-4 flex-1 min-w-[300px] h-[350px]">
                        <BarChartWidget
                            data={{
                                labels: barData.map((d) => d.label),
                                values: barData.map((d) => d.data[0]),
                            }}
                            title="Incassi per Terapista"
                            height={280}
                        />
                    </div>

                    <div className="bg-white rounded shadow p-4 flex-1 min-w-[300px] h-[350px]">
                        <h2 className="font-semibold text-lg mb-2">
                            Tipologia Pazienti
                        </h2>
                        <div className="relative h-[280px] w-full">
                            <DoughnutChartWidget
                                labels={pieData.labels}
                                values={pieData.values}
                                colors={pieData.colors}
                            />
                        </div>
                    </div>
                </div>

                {/* Lista Pagamenti */}
                <div className="bg-white p-4 rounded shadow mt-8">
                    <h2 className="text-lg font-semibold mb-4">
                        Ultimi Incassi
                    </h2>
                    <ul className="space-y-4">
                        {Array.isArray(pagamenti) &&
                            pagamenti.map((p, idx) => (
                                <li
                                    key={idx}
                                    className="flex justify-between items-center p-3 rounded border border-gray-200"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {p.paziente
                                                ? `${p.paziente.nome} ${p.paziente.cognome}`
                                                : `${p.nome} ${p.cognome}`}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {p.data
                                                ? format(
                                                      new Date(p.data),
                                                      "dd MMM yyyy",
                                                      { locale: it }
                                                  )
                                                : "Data non valida"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium text-gray-700">
                                            {p.terapista?.cognome ||
                                            p.terapista?.nome
                                                ? `Dr. ${
                                                      p.terapista?.nome ?? ""
                                                  } ${
                                                      p.terapista?.cognome ?? ""
                                                  }`.trim()
                                                : "—"}
                                        </span>

                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${
                                                p.paziente_id
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-green-100 text-green-700"
                                            }`}
                                        >
                                            {p.paziente_id
                                                ? "Registrato"
                                                : "Non Registrato"}
                                        </span>
                                        <span
                                            className={`font-semibold ${
                                                p.fattura == 1
                                                    ? "text-green-600" // fattura = sì
                                                    : "text-yellow-500" // fattura = no
                                            }`}
                                        >
                                            €{parseFloat(p.importo).toFixed(2)}
                                        </span>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </Home>
    );
};

export default DettaglioIncasso;
