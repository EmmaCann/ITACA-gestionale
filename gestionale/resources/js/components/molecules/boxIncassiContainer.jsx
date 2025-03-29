import React from "react";
import { BoxIncassi } from "./atoms/boxIncassi.jsx";
export const BoxIncassiContainer =()=>{

    return(
            <div className="h-full flex flex-col w-fit gap-4  justify-center drop-shadow ">
                <BoxIncassi text="INCASSI DEL GIORNO" money="200€" bgColor={"#D8A4C9"}/>
                <BoxIncassi text="INCASSI DELLA SETTIMANA" money="1000€" bgColor={"#9BCEEB"}/>
                <BoxIncassi text="INCASSI DEL MESE" money="4000€" bgColor={"#474849"}/>
                <BoxIncassi text="INCASSI DELL'ANNO" money="20.000€" bgColor={"#A0A1A1"}/>
            </div>
    );
}