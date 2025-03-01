import React from "react";
import { LogoItaca } from "../molecules/atoms/logoItaca.jsx";

export const Navbar = () => {

    return (
        <div className="bg-[#C8C8C8] w-[180px] h-[98%] flex flex-col m-2 rounded-[20px] opacity-[60%]">
            <div className="w-full h-auto">
                <LogoItaca/>
            </div>
        </div>
    );

}