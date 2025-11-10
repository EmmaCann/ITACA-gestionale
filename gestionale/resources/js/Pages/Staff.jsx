import React from 'react';
import Home from './Home';
import { LogoItaca } from '../components/molecules/atoms/logo-ITACA.jsx';

const staff = [
    {
        key: 'silvia-crisafulli',
        name: 'Dott.ssa Silvia Crisafulli',
        role: 'Fondatrice del Centro Multidisciplinare di Riabilitazione ITACA',
        gender: 'F',
        img: '/images/staff/silvia-crisafulli.jpg',
        bio: (
            <>
                <p>Professione e competenze:</p>
                <ul className="list-disc pl-6">
                    <li>Terapista della Riabilitazione Psichiatrica</li>
                    <li>Psicomotricista funzionale</li>
                    <li>Esperta in diagnosi e trattamento dei disturbi alimentari</li>
                </ul>
                <p className="mt-2">Opera con impegno nel settore dell’infanzia e adolescenza, collaborando con scuole e istituti di formazione sulla salute mentale.</p>
            </>
        )
    },
    {
        key: 'giorgio-la-manna',
        name: 'Dott. Giorgio La Manna',
        role: 'Logopedista',
        gender: 'M',
        img: '/images/staff/giorgio-la-manna.jpg',
        bio: (
            <>
                <p>Il Dott. Giorgio La Manna è logopedista presso il Centro Itaca. Ha conseguito la laurea triennale e magistrale in Logopedia, abilitato come terapista PROMPT e OMT.</p>
                <p className="font-semibold mt-2">Aree di intervento:</p>
                <ul className="list-disc pl-6">
                    <li>Disturbi del Neurosviluppo, come difficoltà, ritardi e disturbi del linguaggio</li>
                    <li>Disturbi Specifici dell’Apprendimento (DSA)</li>
                    <li>Disturbo di Iperattività e Disattenzione (ADHD)</li>
                    <li>Disturbo dello Spettro Autistico (Autismo)</li>
                    <li>Disfonia</li>
                    <li>Balbuzie</li>
                    <li>Interventi precoci</li>
                </ul>
            </>
        )
    },
    {
        key: 'francesca-fichera',
        name: 'Dott.ssa Francesca Fichera',
        role: 'Terapista della riabilitazione psichiatrica',
        gender: 'F',
        img: '/images/staff/francesca-fichera.jpg',
        bio: (
            <>
                <p>Ha conseguito la laurea magistrale in Scienze riabilitative delle professioni sanitarie.</p>
                <p className="font-semibold mt-2">Ha conseguito:</p>
                <ul className="list-disc pl-6">
                    <li>Master in “Diagnosi e trattamento dei Disturbi Alimentari e dell’Obesità”</li>
                    <li>Formazione come Psicomotricista</li>
                </ul>
                <p className="font-semibold mt-2">Specializzata in:</p>
                <ul className="list-disc pl-6">
                    <li>Disturbi del comportamento e del neurosviluppo</li>
                    <li>Disturbi del comportamento alimentare</li>
                    <li>Potenziamento delle abilità sociali</li>
                    <li>Progettazione di interventi di educazione alla salute</li>
                </ul>
                <p className="mt-2">Lavora con passione da anni nel settore dell'infanzia e dell'adolescenza.</p>
            </>
        )
    },
    {
        key: 'irene-trombetta',
        name: 'Dott.ssa Irene Trombetta',
        role: 'Psicomotricista / Assistente Analista del Comportamento',
        gender: 'F',
        img: '/images/staff/irene-trombetta.jpg',
        bio: (
            <>
                <ul className="list-disc pl-6">
                    <li>Terapista della Riabilitazione Psichiatrica</li>
                    <li>Assistente Analista del Comportamento</li>
                    <li>Laureata all’Università di Catania</li>
                    <li>Specializzata con Master in ABA (Applied Behavior Analysis)</li>
                    <li>Formata nel trattamento dei disturbi dell’età evolutiva</li>
                </ul>
                <p className="font-semibold mt-2">Aree di intervento:</p>
                <ul className="list-disc pl-6">
                    <li>Disturbo dello Spettro Autistico (ASD)</li>
                    <li>Disturbi da Deficit di Attenzione/Iperattività (ADHD)</li>
                    <li>Disturbi della condotta e comportamenti disadattivi</li>
                    <li>Potenziamento delle abilità comunicative e sociali</li>
                    <li>Supporto all’autonomia personale e scolastica</li>
                    <li>Interventi psicoeducativi individualizzati</li>
                    <li>Parent training e supporto alla famiglia</li>
                </ul>
            </>
        )
    },
    {
        key: 'salvatore-di-paola',
        name: 'Dott. Salvatore Di Paola',
        role: 'Tecnico della riabilitazione psichiatrica / Psicomotricista',
        gender: 'M',
        img: '/images/staff/salvatore-di-paola.jpg',
        bio: (
            <>
                <p>Tecnico della riabilitazione psichiatrica e Psicomotricista funzionale, con laurea magistrale in Scienze riabilitative delle professioni sanitarie.</p>
                <p className="font-semibold mt-2">Aree di intervento:</p>
                <ul className="list-disc pl-6">
                    <li>Strategia migliore incentrata sulla persona</li>
                    <li>Stimolazione delle funzioni di veglia e di relazione</li>
                    <li>Sviluppo delle tappe psicomotorie</li>
                    <li>Educazione e controllo del comportamento</li>
                    <li>Esperienze di gruppo</li>
                </ul>
            </>
        )
    },
    
];

const Staff = () => {
    return (
        <Home>
            <div className="p-6 sm:p-8">
                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-6">
                            <LogoItaca width="w-[160px]" height="h-[64px]" />
                            <div>
                                <h1 className="text-3xl font-marcellusSC text-gray-800">Il nostro staff</h1>
                                <p className="text-gray-600 text-sm">Professionisti qualificati al servizio della crescita dei bambini e delle famiglie.</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {staff.map((s) => (
                                <div key={s.key} className={`rounded-xl ${s.gender === 'M' ? 'bg-[#E6F7FF]' : 'bg-[#FFE8F5]'} p-4` }>
                                    <div className="flex flex-col md:flex-row items-start gap-6">
                                        <div className="flex-shrink-0">
                                            <div className="w-48 h-56 sm:w-52 sm:h-60 md:w-56 md:h-72 rounded-lg overflow-hidden">
                                                <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-800">{s.name}</h3>
                                            <div className="text-sm text-gray-500 mb-2">{s.role}</div>
                                            <div className="text-gray-700 leading-relaxed">{s.bio}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 bg-bgContainer p-6">
                        <div className="max-w-6xl mx-auto text-sm text-gray-600">
                            <em>Di seguito lo staff al completo:</em>
                            <div className="mt-4 rounded-lg overflow-hidden flex justify-center">
                                <img src="/images/staff/staff-completo.jpg" alt="staff completo" className="w-full max-w-[480px] h-auto object-cover rounded-lg shadow" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Home>
    );
};

export default Staff;
