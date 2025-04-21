import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { LogoItaca } from "./molecules/atoms/logo-itaca.jsx";

// Icone navbar
import BrainIcon from "../../../public/icons/brain.png";
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
    const { url } = usePage(); // Otteniamo l'URL corrente per evidenziare l'elemento attivo

    const commonClass = "w-full flex justify-center items-center";

    // Funzione per verificare se un link è attivo
    const isActive = (route) =>
        url.startsWith(route)
            ? "bg-navbarActive shadow-md border-l-4 rounded-md border-bluSecondary"
            : "";

    return (
        <div className="bg-navbar w-[200px] h-[98%] flex flex-col m-2 rounded-[20px] opacity-[60%] drop-shadow">
            
            {/* Logo */}
            <div className={`${commonClass} pr-2 pt-1`}>
                <LogoItaca width="w-[180px]" height="h-[95px]" />
            </div>

            {/* Sezioni Navbar */}
            <div className="flex flex-col flex-grow justify-between mt-2">
                
                {/* Home */}
                <div className={commonClass}>
                    <Link href="/home" className={`${commonClass} ${isActive("/home")}`}>
                        <IconTextNavbar icon={IoMdHome} text="HOME" iconSize={22} />
                    </Link>
                </div>

                {/* Sezioni Centrali */}
                <div className="flex flex-col gap-4 mt-6">
                    <Link href="/incassi" className={`${commonClass} ${isActive("/incassi")}`}>
                        <IconTextNavbar icon={FaRegCreditCard} text="INCASSI" iconSize={18} />
                    </Link>
                    <Link href="/pazienti" className={`${commonClass} ${isActive("/pazienti")}`}>
                        <IconTextNavbar image={BrainIcon} text="PAZIENTI" />
                    </Link>
                    <Link href="/archivio-firme" className={`${commonClass} ${isActive("/archivio-firme")}`}>
                        <IconTextNavbar icon={FaPencilAlt} text="ARCHIVIO FIRME" iconSize={16} />
                    </Link>
                    <Link href="/lista-attesa" className={`${commonClass} ${isActive("/lista-attesa")}`}>
                        <IconTextNavbar icon={FaList} text="LISTA D'ATTESA" iconSize={16} />
                    </Link>
                </div>

                {/* Tariffario */}
                <div className="mt-10">
                    <Link href="/tariffario" className={`${commonClass} ${isActive("/tariffario")}`}>
                        <IconTextNavbar icon={FaEuroSign} text="TARIFFARIO" iconSize={18} />
                    </Link>
                </div>
            </div>

            {/* Footer della Navbar */}
            <div className="flex flex-col mt-8 mb-2">
                <Link href="/chi-siamo" className={`${commonClass} ${isActive("/chi-siamo")}`}>
                    <IconTextNavbar icon={IoMdInformationCircleOutline} text="CHI SIAMO?" iconSize={19} />
                </Link>
                <Link href="/logout" className={`${commonClass} `}>
                    <IconTextNavbar icon={MdOutlineLogout} text="LOGOUT" iconSize={19} />
                </Link>
            </div>
        </div>
    );
};
