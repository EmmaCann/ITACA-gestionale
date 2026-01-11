import React from "react";
import { CheckboxRotondo } from "./atoms/checkboxRotondo";
import { ColonnaTabella } from "./atoms/ColonnaTabella";

export const ListaAttesaHeader = () => {
    return (
        <div
            className="
            hidden md:grid
            bg-bluPrimary text-white
            mx-4 mb-3 rounded-[12px] px-3 h-[46px]
            grid-cols-[40px_50px_1.1fr_1.1fr_0.4fr_0.9fr_1.2fr_1.6fr_0.8fr_0.6fr]
            items-center text-[13px]"
        >
            <CheckboxRotondo checked={false} isStatic base="white" />
            <div>#</div>
            <div>Nome</div>
            <div>Cognome</div>
            <div className="text-center">📝</div>
            <div>Data</div>
            <div>Terapia</div>
            <div>Richiesta terapista</div>
            <div className="text-center">Contatti</div>
            <div className="text-center">Azioni</div>
        </div>
    );
};
