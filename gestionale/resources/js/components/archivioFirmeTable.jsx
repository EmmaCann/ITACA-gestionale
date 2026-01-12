import React from "react";
import ArchivioFirmeRow from "./molecules/archivioFirmeRow";

const ArchivioFirmeTable = ({ dati, onDelete, canEdit = true }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                    <tr>
                        <th className="px-6 py-3">Nome</th>
                        <th className="px-6 py-3">Cognome</th>
                        <th className="px-6 py-3">Data</th>
                        <th className="px-6 py-3">Terapia</th>
                        <th className="px-6 py-3">Terapista</th>
                        <th className="px-6 py-3">Note</th>
                        {canEdit && <th className="px-6 py-3 text-center">Azioni</th>}
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(dati) && dati.length > 0 ? (
                        dati.map((firma) => (
                            <ArchivioFirmeRow key={firma.id} dati={firma} onDelete={onDelete} canEdit={canEdit} />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={canEdit ? 7 : 6} className="text-center py-4 text-gray-400">
                                Nessuna firma registrata
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ArchivioFirmeTable;
