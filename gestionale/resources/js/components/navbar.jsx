import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { LogoItaca } from "./molecules/atoms/logo-ITACA.jsx";

// Icone
import BrainIcon from "../../../public/icons/brain.png";
import { IoMdHome } from "react-icons/io";
import { IconTextNavbar } from "./molecules/atoms/iconTextNavbar.jsx";
import { FaRegCreditCard } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { FaEuroSign } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";

export const Navbar = ({ menuOpen, setMenuOpen }) => {
    const { url } = usePage();

    const commonClass = "w-full flex justify-center items-center";

    const isActive = (route) =>
        url.startsWith(route)
            ? "bg-navbarActive shadow-md border-l-4 rounded-md border-bluSecondary"
            : "";

    return (
        <>
            {/* ================= DESKTOP SIDEBAR ================= */}
            <div className="bg-navbar w-[200px] h-[98%] m-2 rounded-[20px] opacity-[60%] drop-shadow hidden md:flex flex-col z-40">
                
                {/* LOGO */}
                <div className={`${commonClass} pr-2 pt-2`}>
                    <LogoItaca width="w-[180px]" height="h-[85px]" />
                </div>

                {/* CONTENUTO */}
                <div className="flex flex-col flex-grow justify-between mt-2">
                    
                    {/* HOME */}
                    <div className={commonClass}>
                        <Link
                            href="/home"
                            className={`${commonClass} mt-6 ${isActive("/home")}`}
                        >
                            <IconTextNavbar icon={IoMdHome} text="HOME" iconSize={22} />
                        </Link>
                    </div>

                    {/* SEZIONI CENTRALI */}
                    <div className="flex flex-col gap-4 mt-6">
                        <Link href="/incassi" className={`${commonClass} ${isActive("/incassi")}`}>
                            <IconTextNavbar icon={FaRegCreditCard} text="INCASSI" iconSize={18} />
                        </Link>

                        <Link href="/utenti" className={`${commonClass} ${isActive("/utenti")}`}>
                            <IconTextNavbar image={BrainIcon} text="UTENTI" />
                        </Link>

                        <Link href="/archivio-firme" className={`${commonClass} ${isActive("/archivio-firme")}`}>
                            <IconTextNavbar icon={FaPencilAlt} text="ARCHIVIO FIRME" iconSize={16} />
                        </Link>

                        <Link href="/lista-attesa" className={`${commonClass} ${isActive("/lista-attesa")}`}>
                            <IconTextNavbar icon={FaList} text="LISTA D'ATTESA" iconSize={16} />
                        </Link>
                    </div>

                    {/* TARIFFARIO */}
                    <div className="mt-6">
                        <Link href="/tariffario" className={`${commonClass} ${isActive("/tariffario")}`}>
                            <IconTextNavbar icon={FaEuroSign} text="TARIFFARIO" iconSize={18} />
                        </Link>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex flex-col mt-8 mb-4">
                    <Link href="/utilita" className={`${commonClass} ${isActive("/utilita")}`}>
                        <IconTextNavbar icon={IoSettingsSharp} text="UTILITA'" iconSize={19} />
                    </Link>

                    <Link href="/logout" method="post" className={commonClass}  onClick={() => sessionStorage.removeItem('onboarding')}>
                        <IconTextNavbar icon={MdOutlineLogout} text="LOGOUT" iconSize={19} />
                    </Link>
                </div>
            </div>

            {/* ================= OVERLAY MOBILE ================= */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* ================= MOBILE DRAWER ================= */}
            <div
                className={`
                    fixed top-0 left-0 h-full w-[230px] bg-navbar
                    rounded-r-[20px] drop-shadow
                    z-50 p-4 flex flex-col
                    transform transition-transform duration-300 md:hidden
                    ${menuOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* CLOSE */}
                <button
                    className="text-gray-800 text-3xl mb-3 self-end"
                    onClick={() => setMenuOpen(false)}
                >
                    ✕
                </button>

                {/* LOGO */}
                <div className="flex justify-center mb-4">
                    <LogoItaca width="w-[180px]" height="h-[85px]" />
                </div>

                {/* CONTENUTO */}
                <div className="flex flex-col flex-grow justify-between mt-2">
                    
                    {/* HOME */}
                    <Link
                        href="/home"
                        className={`w-full flex justify-center mt-4 ${isActive("/home")}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        <IconTextNavbar icon={IoMdHome} text="HOME" iconSize={22} />
                    </Link>

                    {/* SEZIONI CENTRALI */}
                    <div className="flex flex-col gap-4 mt-6">
                        <Link
                            href="/incassi"
                            className={`w-full flex justify-center ${isActive("/incassi")}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            <IconTextNavbar icon={FaRegCreditCard} text="INCASSI" iconSize={18} />
                        </Link>

                        <Link
                            href="/utenti"
                            className={`w-full flex justify-center ${isActive("/utenti")}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            <IconTextNavbar image={BrainIcon} text="UTENTI" />
                        </Link>

                        <Link
                            href="/archivio-firme"
                            className={`w-full flex justify-center ${isActive("/archivio-firme")}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            <IconTextNavbar icon={FaPencilAlt} text="ARCHIVIO FIRME" iconSize={16} />
                        </Link>

                        <Link
                            href="/lista-attesa"
                            className={`w-full flex justify-center ${isActive("/lista-attesa")}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            <IconTextNavbar icon={FaList} text="LISTA D'ATTESA" iconSize={16} />
                        </Link>
                    </div>

                    {/* TARIFFARIO */}
                    <div className="mt-6">
                        <Link
                            href="/tariffario"
                            className={`w-full flex justify-center ${isActive("/tariffario")}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            <IconTextNavbar icon={FaEuroSign} text="TARIFFARIO" iconSize={18} />
                        </Link>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex flex-col mt-8 mb-4">
                    <Link
                        href="/utilita"
                        className={`w-full flex justify-center ${isActive("/utilita")}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        <IconTextNavbar icon={IoSettingsSharp} text="UTILITA'" iconSize={19} />
                    </Link>

                    <Link
                        href="/logout"
                        method="post"
                        className="w-full flex justify-center mt-4"
                        onClick={() => {
                            sessionStorage.removeItem("onboarding");
                            setMenuOpen(false);
                        }}
                    >
                        <IconTextNavbar icon={MdOutlineLogout} text="LOGOUT" iconSize={19} />
                    </Link>
                </div>
            </div>
        </>
    );
};
