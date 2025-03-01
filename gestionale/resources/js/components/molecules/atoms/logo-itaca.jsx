import React from "react";
import logoItaca from "../../../../../public/images/logo-itaca.png";


export const LogoItaca = ({width,height}) => {
    //w-[260px] h-[120px] per login
    return(
        <div className="box-logo">
         <img src={logoItaca} alt="Logo Itaca" className={`${width} ${height}`} />


        </div>
    );

    
}
