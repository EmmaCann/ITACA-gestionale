import React from "react";
import { LogoItaca } from "./molecules/atoms/logo-itaca.jsx";

//icone navbar
import { IoMdHome } from "react-icons/io";
import { IconTextNavbar } from "./molecules/atoms/iconTextNavbar.jsx";
import { FaRegCreditCard } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";
import { FaEuroSign } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";

export const Navbar = () => {
    const commonClass = "w-full h-auto flex justify-center items-center ";
    return (
        <div className="bg-navbar w-[200px] h-[98%] relative flex flex-col m-2 rounded-[20px] opacity-[60%] drop-shadow">
            <div className={`${commonClass} pr-2 pt-1 `}>
                <LogoItaca width="w-[180px]" height="h-[95px]" />
            </div>
            <div
                className={`${commonClass} gap-8 mt-6   flex-col justify-between`}
            >
                 <div className={`${commonClass} absolute top-[130px]`}>
                 <IconTextNavbar icon={IoMdHome} text="HOME" iconSize={22} />
                 </div>
                
            
                <div
                    className={`  middle-container  ${commonClass} gap-8 mb-2 flex-col  absolute top-[220px] `}
                >
                    <IconTextNavbar
                        icon={FaRegCreditCard}
                        text="INCASSI"
                        iconSize={18}
                    />
                    <IconTextNavbar
                        icon={FaUserDoctor}
                        text="PAZIENTI"
                        iconSize={17}
                    />
                    {/* //TODO da cambiare icona pazienti*/}
                    <IconTextNavbar
                        icon={FaPencilAlt}
                        text="ARCHIVIO FIRME"
                        iconSize={16}
                    />
                    <IconTextNavbar
                        icon={FaList}
                        text="LISTA D'ATTESA"
                        iconSize={16}
                    />
                </div>
                <div className={`${commonClass} absolute bottom-[140px]`}>
                    <IconTextNavbar
                        icon={FaEuroSign}
                        text="TARIFFARIO"
                        iconSize={18}
                    />
                </div>
            </div>
            <div className={`${commonClass} gap-4  flex-col absolute bottom-4`}>
                <IconTextNavbar
                    icon={IoMdInformationCircleOutline}
                    text="CHI SIAMO?"
                    iconSize={19}
                />
                <IconTextNavbar
                    icon={MdOutlineLogout}
                    text="LOGOUT"
                    iconSize={19}
                />
            </div>
        </div>
    );
};
