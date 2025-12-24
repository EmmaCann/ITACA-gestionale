import React, { useRef } from "react";
import Home from "./Home";
import { LogoItaca } from "../components/molecules/atoms/logo-ITACA.jsx";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const BrandITACA = () => {
    const letters = ["I", "T", "A", "C", "A"];
    return (
        <span className="font-marcellusSC text-3xl tracking-wider">
            {letters.map((l, i) => (
                <span
                    key={i}
                    className={
                        i % 2 === 0 ? "text-pinkPrimary" : "text-bluPrimary"
                    }
                >
                    {l}
                </span>
            ))}
        </span>
    );
};

const ChiSiamo = () => {
    const images = [1, 2, 3, 4, 5, 6].map((n) => `/images/chi-siamo/${n}.jpg`);
    const stripRef = useRef(null);

    const scrollBy = (delta) => {
        if (!stripRef.current) return;
        stripRef.current.scrollBy({ left: delta, behavior: "smooth" });
    };

    return (
        <Home>
            <div className="w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* --- HEADER + TESTO --- */}
                <div className="p-8 md:flex md:gap-8 items-start">
                    <div className="md:w-1/3 flex flex-col items-center md:items-start">
                        <div className="mb-6">
                            <LogoItaca width="w-[220px]" height="h-[90px]" />
                        </div>
                    </div>

                    <div className="md:w-2/3 mt-6 md:mt-0">
                        <div className="p-6 rounded-lg bg-[#E8F7FF]">
                            <h2 className="text-2xl font-marcellusSC text-gray-800 mb-4">
                                Benvenuti!
                            </h2>

                            <p className="text-gray-700 leading-relaxed mb-4">
                                <span className="font-marcellusSC">
                                    <BrandITACA />
                                </span>{" "}
                                – Centro Multidisciplinare di Riabilitazione
                                nasce dal desiderio di offrire uno spazio di
                                cura, accoglienza e crescita dedicato all’età
                                evolutiva, con particolare attenzione ai
                                disturbi del neurosviluppo. Fondato dalla
                                Dottoressa <strong>Silvia Crisafulli</strong>,
                                Tecnico della Riabilitazione Psichiatrica e
                                Psicomotricista Funzionale, il centro prende
                                ispirazione dalla poesia “Itaca” di K. Kavafis,
                                che celebra il valore del viaggio come
                                esperienza fondamentale di trasformazione e
                                arricchimento.
                            </p>

                            <p className="text-gray-700 leading-relaxed mb-4">
                                Come nella poesia, anche <BrandITACA /> vuole
                                essere una meta simbolica, un luogo in cui ogni
                                bambino, insieme alla sua famiglia, possa essere
                                accompagnato nel proprio percorso di crescita
                                con cura, attenzione e competenza.
                            </p>

                            <p className="text-gray-700 leading-relaxed mb-4">
                                Il centro si avvale di un team multidisciplinare
                                altamente qualificato, impegnato in una
                                formazione continua, per garantire interventi a
                                forte valenza clinica, sempre personalizzati sui
                                bisogni del singolo.
                            </p>

                            <p className="text-gray-700 leading-relaxed mb-4">
                                <strong>
                                    <BrandITACA />
                                </strong>{" "}
                                è inoltre abilitato alla formazione dei
                                tirocinanti provenienti dall’Università degli
                                Studi di Catania e dall’Università degli Studi
                                di Ferrara, contribuendo alla crescita di futuri
                                professionisti della riabilitazione.
                            </p>

                            <p className="text-gray-700 leading-relaxed font-semibold mt-4">
                                <BrandITACA /> è più di un centro riabilitativo:
                                è un luogo che accoglie, sostiene e cammina
                                accanto a chi cresce.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- GALLERIA ORIZZONTALE --- */}
                <div className="w-full relative">
                    <style>{`
                            .no-scrollbar::-webkit-scrollbar { display: none; }
                            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                        `}</style>

                    <button
                        aria-label="scroll left"
                        onClick={() => {
                            const delta =
                                Math.round(stripRef.current.clientWidth * 0.8) *
                                -1;
                            scrollBy(delta);
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-bluPrimary hover:bg-bluSecondary text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                    >
                        <FiChevronLeft />
                    </button>

                    <div className="px-6">
                        <div
                            ref={stripRef}
                            className="no-scrollbar flex gap-4 py-4 overflow-x-auto"
                            onWheel={(e) => e.preventDefault()}
                            // onTouchMove={(e) => e.preventDefault()}
                        >
                            {images.map((src, idx) => (
                                <div
                                    key={idx}
                                    className="
  flex-shrink-0
  w-[85vw] sm:w-[240px] md:w-[280px]
  aspect-[4/3]
  rounded-lg
  overflow-hidden
"
                                >
                                    <img
                                        src={src}
                                        alt={`chi siamo ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        aria-label="scroll right"
                        onClick={() => {
                            const delta = Math.round(
                                stripRef.current.clientWidth * 0.8
                            );
                            scrollBy(delta);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-bluPrimary hover:bg-bluSecondary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                    >
                        <FiChevronRight />
                    </button>
                </div>

                {/* --- FOOTER --- */}
                <div className="border-t border-gray-100 bg-bgContainer p-6">
                    <div className="max-w-5xl mx-auto text-sm text-gray-600">
                        <em>
                            Per informazioni sui servizi, percorsi terapeutici e
                            opportunità formative, contatta il centro: la nostra
                            équipe è a disposizione per ascoltare e accompagnare
                            ogni famiglia.
                        </em>

                        <div className="mt-4">
                            <a
                                href="/staff"
                                className="inline-block mt-4 bg-bluPrimary hover:bg-bluSecondary text-white font-semibold py-2 px-4 rounded-lg shadow"
                            >
                                Il nostro staff
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Home>
    );
};

export default ChiSiamo;
