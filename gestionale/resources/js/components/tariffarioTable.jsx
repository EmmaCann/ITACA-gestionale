import React from "react";
import TariffarioRow from "./molecules/tariffarioRow";

const TariffarioTable = ({ dati,onUpdated }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                    <tr>
                        <th className="px-6 py-3">Dottore</th>
                        <th className="px-6 py-3">Terapia</th>
                        <th className="px-6 py-3">Prezzo</th>
                        <th className="px-6 py-3">Durata</th>
                        <th className="px-6 py-3">Ultimo Aggiornamento</th>
                        <th className="px-6 py-3 text-center">Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(dati) && dati.length > 0 ? (
                        dati.map((item, index) => (
                            <TariffarioRow
                                key={index}
                                dati={item}
                                onUpdated={onUpdated}
                            />
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={6}
                                className="text-center py-4 text-gray-400"
                            >
                                Nessuna tariffa disponibile
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TariffarioTable;
