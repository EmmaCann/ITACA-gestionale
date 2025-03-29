import React from "react";
import { MdEuro } from "react-icons/md";

export const AggiungiPagamentoButton=()=>{
    return(
            <div className="bg-black flex flex-col rounded-full  w-[220px] h-[60px]  opacity-[80%] text-center items-center justify-center cursor-pointer
            transition-all duration-300 hover:bg-gray-800 hover:scale-105">
                <p className="font-marcellusSC text-[16px] text-white">AGGIUNGI PAGAMENTO</p>
                <MdEuro className="w-[18px] h-[16px] text-white"/>
            </div>
    );
}