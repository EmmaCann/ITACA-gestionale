import React from "react";

export const LabelContainer = ({text}) =>{
    return(
        <div className="bg-[#6BB2DF] rounded-[10px] w-[260px] h-[40px] flex text-center items-center justify-center absolute top-[-8px] left-[3%]">
            <p className="font-marcellusSC text-white text-[14px] ">{text}</p>
        </div>
    )
}