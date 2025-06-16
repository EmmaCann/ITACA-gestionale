import React from "react";
import { CheckboxRotondo } from "./atoms/checkboxRotondo";
import { ColonnaTabella } from "./atoms/ColonnaTabella";

export const ListaAttesaHeader = () => {
    const pTagStyle = "font-inter text-white text-[14px] text-center";

    return (
        <div className="bg-bluPrimary flex flex-row w-[95%] h-[48px] mx-4 items-center gap-4 opacity-80 rounded-[12px] mb-6 pl-2">
            <CheckboxRotondo checked={false} isStatic={true} base="white" />
            <div className="flex-1 flex flex-row justify-between">
                <ColonnaTabella width="w-[60px]">
                    <p className={pTagStyle}>#</p>
                </ColonnaTabella>
                <ColonnaTabella>
                    <p className={pTagStyle}>Nome</p>
                </ColonnaTabella>
                <ColonnaTabella>
                    <p className={pTagStyle}>Cognome</p>
                </ColonnaTabella>
                <ColonnaTabella>
                    <p className={pTagStyle}>In lista dal:</p>
                </ColonnaTabella>
                <ColonnaTabella width="w-[160px]">
                    <p className={pTagStyle}>Terapia</p>
                </ColonnaTabella>
                <ColonnaTabella width="w-[180px]">
                    <p className={pTagStyle}>Richiesta Terapista</p>
                </ColonnaTabella>
                <ColonnaTabella>
                    <p className={pTagStyle}>Contatti</p>
                </ColonnaTabella>
            </div>
        </div>
    );
};
