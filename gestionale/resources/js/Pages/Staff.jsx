import React from "react";
import Home from "./Home";
import { LogoItaca } from "../components/molecules/atoms/logo-ITACA.jsx";

const Staff = () => {
    return (
        <Home>
            <div className="p-8">
                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center gap-6 mb-6">
                        <LogoItaca width="w-[160px]" height="h-[70px]" />
                        <div>
                            <h1 className="text-2xl font-marcellusSC text-gray-800">Il nostro staff</h1>
                            <p className="text-gray-600 text-sm mt-1">Professionisti qualificati al servizio della crescita</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Placeholder: cards per i membri dello staff. L'utente potrà sostituire con dati reali */}
                        <div className="p-4 bg-bgContainer rounded-lg">
                            <h3 className="font-semibold">Dott.ssa Silvia Crisafulli</h3>
                            <p className="text-sm text-gray-600">Fondatrice – Tecnico della riabilitazione psichiatrica, Psicommotricista funzionale</p>
                        </div>
                        <div className="p-4 bg-bgContainer rounded-lg">
                            <h3 className="font-semibold">Dott. Mario Rossi</h3>
                            <p className="text-sm text-gray-600">Logopedista</p>
                        </div>
                        <div className="p-4 bg-bgContainer rounded-lg">
                            <h3 className="font-semibold">Dott.ssa Anna Bianchi</h3>
                            <p className="text-sm text-gray-600">Neuropsicomotricista</p>
                        </div>
                        <div className="p-4 bg-bgContainer rounded-lg">
                            <h3 className="font-semibold">Dott. Luca Verdi</h3>
                            <p className="text-sm text-gray-600">Psicologo Clinico</p>
                        </div>
                    </div>

                    <div className="mt-8 text-sm text-gray-600">
                        <p>Questa pagina è un punto di partenza: sostituisci le card con i profili reali del tuo staff, includendo foto, curricula e contatti.</p>
                    </div>
                </div>
            </div>
        </Home>
    );
};

export default Staff;
