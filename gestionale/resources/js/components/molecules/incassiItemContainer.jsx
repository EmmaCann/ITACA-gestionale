// import React from "react";
// import { ItemIncassi } from "./atoms/itemIncasi";

// export const IncassiItemContainer=({})=>{
//     return(
//         <div className="bg-[#D9D9D9] opacity-[50%] rounded-[20px] w-[200px] h-[300px] justify-center items-center flex flex-col gap-4" >
//             <ItemIncassi param1="LUN " param2="1.02.25:" money="500€" />
//             <ItemIncassi param1="MAR" param2="2.02.25:" money="500€" />
//             <ItemIncassi param1="MER" param2="3.02.25:" money="500€" />
//             <ItemIncassi param1="GIOV" param2="4.02.25:" money="500€" />
//             <ItemIncassi param1="VEN" param2="5.02.25:" money="500€" />
//             <ItemIncassi param1="SAB" param2="6.02.25:" money="/" />
//         </div>
//     );
// }

import React from "react";
import { ItemIncassi } from "./atoms/itemIncassi.jsx";

export const IncassiItemContainer = ({ bgColor, params }) => {
    const param1Array = Array.isArray(params.param1) ? params.param1 : [];
    const param2Array = params.param2List && Array.isArray(params.param2List) ? params.param2List : [];
    const moneyArray = params.moneyList && Array.isArray(params.moneyList) ? params.moneyList : [];

    return (
        <div
            className="opacity-80 rounded-[20px] w-[200px] h-[300px] flex flex-col gap-4 p-2 py-4 overflow-y-auto custom-scrollbar"
            style={{ backgroundColor: bgColor }}
        >
            {param1Array.map((item, index) => (
                <ItemIncassi
                    key={index}
                    param1={item}
                    param2={param2Array[index] || "-"}
                    money={moneyArray[index] || "-"}
                />
            ))}
        </div>
    );
};
  