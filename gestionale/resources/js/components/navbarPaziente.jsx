import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { LogoItaca } from "./molecules/atoms/logo-ITACA.jsx";

// Icone navbar
import { IoMdHome } from "react-icons/io";
import { IconTextNavbar } from "./molecules/atoms/iconTextNavbar.jsx";
import { FaRegCreditCard } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";
import { FaNotesMedical } from "react-icons/fa";

export const NavbarPaziente = ({ menuOpen, setMenuOpen }) => {
    const { url } = usePage();

    const commonClass = "w-full flex justify-center items-center";

    const isActive = (route) =>
        url.startsWith(route)
            ? "bg-navbarActive shadow-md border-l-4 rounded-md border-bluSecondary"
            : "";

    console.log("NavbarPaziente props:", { menuOpen });

    return (
        <>
            {/* DESKTOP SIDEBAR */}
            <div className="bg-navbar w-[200px] h-[98%] m-2 rounded-[20px] opacity-[60%] drop-shadow hidden md:flex flex-col z-40">

                {/* LOGO */}
                <div className={`${commonClass} pr-2 pt-2`}>
                    <LogoItaca width="w-[180px]" height="h-[85px]" />
                </div>

                {/* CONTENUTO */}
                <div className="flex flex-col flex-grow justify-between mt-2">

                    {/* Home */}
                    <div className={commonClass}>
                        <Link href="/home" className={`${commonClass} mt-6 ${isActive("/home")}`}>
                            <IconTextNavbar icon={IoMdHome} text="HOME" iconSize={22} />
                        </Link>
                    </div>

                    {/* Sezioni centrali */}
                    <div className="flex flex-col gap-4 mt-6">
                        <Link href="/pagamenti" className={`${commonClass} ${isActive("/pagamenti")}`}>
                            <IconTextNavbar icon={FaRegCreditCard} text="PAGAMENTI" iconSize={18} />
                        </Link>

                        <Link href="/archivio-firme" className={`${commonClass} ${isActive("/archivio-firme")}`}>
                            <IconTextNavbar icon={FaPencilAlt} text="ARCHIVIO FIRME" iconSize={16} />
                        </Link>

                        <Link href="/appuntamenti" className={`${commonClass} ${isActive("/appuntamenti")}`}>
                            <IconTextNavbar icon={FaNotesMedical} text="PAZIENTE" iconSize={16} />
                        </Link>
                    </div>

                    {/* Staff */}
                    <div className="mt-6">
                        <Link href="/staff" className={`${commonClass} ${isActive("/staff")}`}>
                            <IconTextNavbar icon={FaUserDoctor} text="STAFF" iconSize={16} />
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col mt-8 mb-4">
                    <Link href="/chi-siamo" className={`${commonClass} ${isActive("/chi-siamo")}`}>
                        <IconTextNavbar icon={IoMdInformationCircleOutline} text="CHI SIAMO" iconSize={19} />
                    </Link>

                    <Link href="/logout" method="post" className={commonClass}>
                        <IconTextNavbar icon={MdOutlineLogout} text="LOGOUT" iconSize={19} />
                    </Link>
                </div>
            </div>

            {/* ⭐ MOBILE SIDEBAR / DRAWER ⭐ */}
            {/* Overlay scuro cliccabile */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setMenuOpen(false)}
                ></div>
            )}

            <div
                className={`
                    fixed top-0 left-0 h-full w-[240px] bg-navbar rounded-r-2xl
                    shadow-lg z-50 p-4 flex flex-col transform transition-transform duration-300 md:hidden
                    ${menuOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <button
                    className="text-white text-2xl mb-4 self-end"
                    onClick={() => setMenuOpen(false)}
                >
                    ✕
                </button>

                <div className="flex flex-col gap-4">

                    <Link href="/home" onClick={() => setMenuOpen(false)}>
                        <IconTextNavbar icon={IoMdHome} text="HOME" iconSize={22} />
                    </Link>

                    <Link href="/pagamenti" onClick={() => setMenuOpen(false)}>
                        <IconTextNavbar icon={FaRegCreditCard} text="PAGAMENTI" iconSize={18} />
                    </Link>

                    <Link href="/archivio-firme" onClick={() => setMenuOpen(false)}>
                        <IconTextNavbar icon={FaPencilAlt} text="ARCHIVIO FIRME" iconSize={16} />
                    </Link>

                    <Link href="/appuntamenti" onClick={() => setMenuOpen(false)}>
                        <IconTextNavbar icon={FaNotesMedical} text="PAZIENTE" iconSize={16} />
                    </Link>

                    <Link href="/staff" onClick={() => setMenuOpen(false)}>
                        <IconTextNavbar icon={FaUserDoctor} text="STAFF" iconSize={16} />
                    </Link>

                    <Link href="/chi-siamo" onClick={() => setMenuOpen(false)}>
                        <IconTextNavbar icon={IoMdInformationCircleOutline} text="CHI SIAMO" iconSize={19} />
                    </Link>

                    <Link href="/logout" onClick={() => setMenuOpen(false)}>
                        <IconTextNavbar icon={MdOutlineLogout} text="LOGOUT" iconSize={19} />
                    </Link>
                </div>
            </div>
        </>
    );
};
