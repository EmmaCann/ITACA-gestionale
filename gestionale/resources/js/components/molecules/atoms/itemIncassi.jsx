import React from "react";

export const ItemIncassi=({param1,param2,money})=>{

    const textClass="text-black font-marcellusSC text-[15px] px-1";
    const moneyClass="text-[#D91515] font-marcellusSC text-[15px] px-1";

    return(
        <div className="bg-white opacity-60 rounded-[20px] w-[100%] flex flex-row items-center  justify-start p-1 gap-1">
            <span className={textClass}>{param1}</span>
            <span className={textClass}>{param2}</span>
            <span className={moneyClass} >{money}</span>
        </div>
    );
}