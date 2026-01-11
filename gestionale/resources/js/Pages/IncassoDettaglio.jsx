import React, { useEffect, useState } from "react";
import Home from "./Home";
import { usePage, Link } from "@inertiajs/react";
import { IncassiFilters } from "../components/molecules/incassiFilters";
import { BarChartWidget } from "../components/BarChartWidget";
import { DoughnutChartWidget } from "../components/DoughnutChartWidget";
import { getPagamentiFiltrati } from "../data/api/pagamenti";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import ModalContentModificaPagamento from "../components/molecules/atoms/modalContentModificaPagamento";
import CustomModal from "../components/customModal";
import { toast } from "react-toastify";
import axios from "axios";


const DettaglioIncasso = () => {
    const { props } = usePage();
    const ruolo = props.ruolo;
    const terapistaIdLoggato = props?.logged_user?.id_utente;

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

    const [modalEditOpen, setModalEditOpen] = useState(false);
    const [pagamentoInEdit, setPagamentoInEdit] = useState(null);

    useEffect(() => {
        // console.log("terapista loggato ", terapistaIdLoggato);
        const fetchData = async () => {
            try {
                const res = await getPagamentiFiltrati({
                    tipo,
                    ...filters,
                    terapista:
                        ruolo === "staff"
                            ? terapistaIdLoggato
                            : filters.terapista ?? null,
                });

                // console.log("[API FETCH] Risposta pagamenti:", res);

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

                // Pie Chart: fattura / non fattura
                const counts = { fattura: 0, noFattura: 0 };

                pagamentiArray.forEach((p) => {
                    if (p.fattura) counts.fattura++;
                    else counts.noFattura++;
                });

                setPieData({
                    labels: ["Con Fattura", "Senza Fattura"],
                    values: [counts.fattura, counts.noFattura],
                    colors: ["#4CAF50", "#FFC107"], // verde / giallo
                });
            } catch (err) {
                console.error("Errore caricando i pagamenti:", err);
            }
        };

        fetchData();
    }, [tipo, filters]);

    const handleEditPagamento = (pagamento) => {
        setPagamentoInEdit(pagamento);
        setModalEditOpen(true);
    };

    const handleDeletePagamento = async (pagamentoId) => {
        if (!confirm("Sei sicuro di voler eliminare questo incasso?")) return;

        try {
            await axios.delete(`/pagamenti/${pagamentoId}`);
            toast.success("Incasso eliminato con successo");

            // refresh lista
            const res = await getPagamentiFiltrati({
                tipo,
                ...filters,
                terapista:
                    ruolo === "staff"
                        ? terapistaIdLoggato
                        : filters.terapista ?? null,
            });
            setPagamenti(res.pagamenti ?? []);
            setStatistiche(res.totali);
        } catch (e) {
            toast.error("Errore durante l'eliminazione");
            console.error(e);
        }
    };

    return (
        <Home hideFAB={true}>
            <div className="p-6 space-y-6">
                {/* MOBILE: TORNA A INCASSI IN ALTO */}
                <div className="md:hidden">
                    <Link
                        href="/incassi"
                        className="
                w-full
                flex items-center justify-center
                bg-gradient-to-br from-[#3DA4DD] to-[#6BB2DF]
                text-white px-5 py-3
                rounded-lg shadow-md
                hover:brightness-110
                transition-all duration-200
            "
                    >
                        ← Torna a Incassi
                    </Link>
                </div>

                {/* DESKTOP: TITOLO + BOTTONE */}
                <div className="hidden md:flex justify-between items-center">
                    <h1 className="text-2xl font-marcellusSC">
                        RIEPILOGO INCASSI — {tipo?.toUpperCase()}
                    </h1>

                    <Link
                        href="/incassi"
                        className="
                bg-gradient-to-br from-[#3DA4DD] to-[#6BB2DF]
                text-white px-5 py-2
                rounded-lg shadow-md
                hover:brightness-110
                transition-all duration-200
            "
                    >
                        Torna a Incassi
                    </Link>
                </div>

                {/* STATISTICHE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-[#F5F5F5] p-3 rounded-md shadow text-center">
                        <h2 className="text-xs text-gray-700 font-medium">
                            Totale Incassi
                        </h2>
                        <p className="text-xl font-bold text-[#3DA4DD] mt-1">
                            €{statistiche.totale.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-[#F5F5F5] p-3 rounded-md shadow text-center">
                        <h2 className="text-xs text-gray-700 font-medium">
                            Totale
                        </h2>
                        <p className="text-xl font-bold text-blue-600 mt-1">
                            {statistiche.numero}
                        </p>
                    </div>

                    <div className="bg-[#F5F5F5] p-3 rounded-md shadow text-center">
                        <h2 className="text-xs text-gray-700 font-medium">
                            Con Fattura
                        </h2>
                        <p className="text-xl font-bold text-green-600 mt-1">
                            €{statistiche.conFattura.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-[#F5F5F5] p-3 rounded-md shadow text-center">
                        <h2 className="text-xs text-gray-700 font-medium">
                            Senza Fattura
                        </h2>
                        <p className="text-xl font-bold text-yellow-600 mt-1">
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
                        ruolo={ruolo}
                    />
                </div>

                {/* Grafici */}
                <div className="flex flex-wrap gap-6 mt-4">
                    {ruolo === "admin" && (
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
                    )}

                    <div className="bg-white rounded shadow p-4 flex-1 min-w-[300px] h-[350px]">
                        <h2 className="font-semibold text-lg mb-2">
                            Fatturazione
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
                                    className="
        bg-white
        rounded-lg
        border border-gray-200
        p-4
        shadow-sm
        flex flex-col gap-3
        md:flex-row md:items-center md:justify-between
    "
                                >
                                    {/* SINISTRA: PAZIENTE + DATA */}
                                    <div className="flex flex-col">
                                        <p className="font-semibold text-gray-900">
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
                                        {p.note && (
                                            <p className="text-sm text-gray-600 italic mt-1">
                                                Note: {p.note}
                                            </p>
                                        )}
                                    </div>

                                    {/* CENTRO: TERAPISTA + STATO */}
                                    <div className="flex flex-wrap items-center gap-2 text-sm">
                                        <span className="text-gray-700">
                                            {p.terapista?.nome ||
                                            p.terapista?.cognome
                                                ? `Dr. ${
                                                      p.terapista?.nome ?? ""
                                                  } ${
                                                      p.terapista?.cognome ?? ""
                                                  }`.trim()
                                                : "—"}
                                        </span>

                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                p.paziente_id
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-green-100 text-green-700"
                                            }`}
                                        >
                                            {p.paziente_id
                                                ? "Registrato"
                                                : "Non registrato"}
                                        </span>
                                    </div>

                                    {/* DESTRA: IMPORTO + AZIONI */}
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <span
                                            className={`text-lg font-bold ${
                                                p.fattura == 1
                                                    ? "text-green-600"
                                                    : "text-yellow-500"
                                            }`}
                                        >
                                            €{parseFloat(p.importo).toFixed(2)}
                                        </span>

                                        {ruolo == "admin" && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEditPagamento(p)
                                                    }
                                                    className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-700"
                                                    title="Modifica"
                                                >
                                                    <FaEdit size={14} />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDeletePagamento(
                                                            p.id
                                                        )
                                                    }
                                                    className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-700"
                                                    title="Elimina"
                                                >
                                                    <FaTrashAlt size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
            {modalEditOpen && pagamentoInEdit && (
                <CustomModal
                    isOpen={modalEditOpen}
                    onRequestClose={() => setModalEditOpen(false)}
                    title="Modifica Pagamento"
                    className="max-w-xl"
                >
                    <ModalContentModificaPagamento
                        pagamento={pagamentoInEdit}
                        onClose={() => setModalEditOpen(false)}
                        onSubmit={async () => {
                            setModalEditOpen(false);

                            // refresh lista dopo modifica
                            const res = await getPagamentiFiltrati({
                                tipo,
                                ...filters,
                                terapista:
                                    ruolo === "staff"
                                        ? terapistaIdLoggato
                                        : filters.terapista ?? null,
                            });
                            setPagamenti(res.pagamenti ?? []);
                            setStatistiche(res.totali);
                        }}
                    />
                </CustomModal>
            )}
        </Home>
    );
};

export default DettaglioIncasso;
