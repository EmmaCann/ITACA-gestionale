import React from "react";
import { LoginForm } from "../components/molecules/loginForm";
import { LogoItaca } from "../components/molecules/atoms/logo-ITACA";

export default function Login({ errors }) {
    return (
        <div className="relative h-screen w-screen bg-background flex flex-col md:flex-row overflow-hidden">

            {/* LINEE DI SFONDO */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-30">
                <div className="absolute top-[180px] -left-[300px] w-[1200px] h-[3px] bg-[#484946] rotate-[-45deg]"></div>
                <div className="absolute top-[120px] -left-[300px] w-[1200px] h-[3px] bg-bluPrimary rotate-[-45deg]"></div>
                <div className="absolute top-[40px] -left-[300px] w-[1200px] h-[3px] bg-pinkPrimary rotate-[-45deg]"></div>
            </div>

            {/* LOGO DESKTOP */}
            <div className="hidden md:flex relative w-[650px] justify-center items-center z-10">
                <div className="absolute bottom-8 left-[120px]">
                    <LogoItaca width="w-[260px]" height="h-[120px]" />
                </div>
            </div>

            {/* CONTENUTO MOBILE/DESKTOP */}
            <div className="relative flex-1 flex flex-col justify-center items-center md:items-start px-6 md:px-12 z-10">

                {/* LOGO MOBILE */}
                <div className="md:hidden mb-6">
                    <LogoItaca width="w-[200px]" height="h-[90px]" />
                </div>

                {/* CITAZIONE SUPERIORE */}
                <p className="text-gray-600 italic font-marcellusSC text-sm md:text-base 
                    leading-relaxed text-center md:text-left mb-6 md:mb-10 w-full">
                    “Quando ti metterai in viaggio per Itaca<br className='hidden md:block' />
                    devi augurarti che la strada sia lunga,<br className='hidden md:block' />
                    fertile in avventure e in esperienze...”
                </p>

                {/* --- FORM CENTRATO DAVVERO IN MOBILE --- */}
                <div className="w-full flex justify-center">
                    <div className="w-full max-w-[380px] mx-auto">
                        <LoginForm errors={errors} />
                    </div>
                </div>

                {/* CITAZIONE INFERIORE */}
                <p className="text-gray-600 italic font-marcellusSC text-sm md:text-base 
                    leading-relaxed mt-10 text-center md:text-right w-full md:pr-12">
                    “Itaca ti ha dato il bel viaggio,<br className='hidden md:block' />
                    senza di lei mai ti saresti messo<br className='hidden md:block' />
                    sulla strada: che cos’altro ti aspetti?”
                </p>
            </div>
        </div>
    );
}
