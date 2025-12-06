import React, { useState } from "react";
import { Navbar } from "../components/navbar";
import { NavbarPaziente } from "../components/navbarPaziente";
import { usePage } from "@inertiajs/react";
import { TopBar } from "../components/topBar";
import { FAB } from "../components/molecules/FAB.jsx";
import { ToastContainer } from "react-toastify";
import { CalendarBoard } from "../components/CalendarBoard";

const Home = ({ children, hideFAB = false }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const { props } = usePage();
    const ruolo = props?.ruolo || null;

    const NavbarToShow = ruolo === "paziente" ? NavbarPaziente : Navbar;

    const effectiveHideFAB = hideFAB || ruolo === "paziente";

    const hasChildren = React.Children.count(children) > 0;

    return (
        <div className="bg-background flex w-screen h-screen overflow-hidden overflow-x-hidden">

            <NavbarToShow menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            {/* QUI È IL FIX */}
            <div className="
                flex flex-col flex-1 h-full relative
                w-full
                md:max-w-[calc(100vw-200px)]
            ">
                <div className="w-full">
                    <TopBar onHamburgerClick={() => setMenuOpen(true)} />
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 md:px-4 mt-[10px] md:mt-[20px]">
                    {hasChildren ? (
                        children
                    ) : (
                        <div className="h-[calc(100vh-70px-2rem)]">
                            <CalendarBoard />
                        </div>
                    )}

                    {!effectiveHideFAB && <FAB />}
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default Home;
