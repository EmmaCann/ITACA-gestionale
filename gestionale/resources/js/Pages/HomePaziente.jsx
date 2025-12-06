import React, { useState } from "react";
import { NavbarPaziente } from "../components/navbarPaziente";
import { TopBar } from "../components/topBar";
import { FAB } from "../components/molecules/FAB.jsx";
import { ToastContainer } from "react-toastify";
import { CalendarBoard } from "../components/CalendarBoard";

const HomePaziente = ({ children, hideFAB = true }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const hasChildren = React.Children.count(children) > 0;

    return (
        <div className="flex w-full h-screen overflow-hidden bg-background">
            {/* SIDEBAR – resta sempre alta 100% */}
            <div className="h-full">
                <NavbarPaziente menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            </div>

            {/* COLONNA DESTRA */}
            <div className="flex flex-col flex-1 h-full">
                {/* TOPBAR */}
                <div className="h-[70px] w-full flex-shrink-0">
                    <TopBar onHamburgerClick={() => setMenuOpen(true)} />
                </div>

                {/* CONTENUTO SCROLLABILE */}
               <div className="flex-1 overflow-y-auto px-3 pb-3 pt-1">

                    {hasChildren ? (
                        children
                    ) : (
                        <div className="w-full mx-auto max-w-[1600px]">
                            <CalendarBoard />
                        </div>
                    )}

                    {!hideFAB && <FAB />}
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default HomePaziente;
