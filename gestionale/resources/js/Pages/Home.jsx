import React, { useState, useEffect } from "react";
import { Navbar } from "../components/navbar";
import { NavbarPaziente } from "../components/navbarPaziente";
import { NavbarStaff } from "../components/navbarStaff";
import { usePage } from "@inertiajs/react";
import { TopBar } from "../components/topBar";
import { FAB } from "../components/molecules/FAB.jsx";
import { ToastContainer } from "react-toastify";
import { CalendarBoard } from "../components/CalendarBoard";
import ModalOnboarding from "../components/molecules/ModalOnboarding.jsx";

const Home = ({ children, hideFAB = false }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [onboarding, setOnboarding] = useState(null);
    const { props } = usePage();
    const ruolo = props?.ruolo || null;

    // const NavbarToShow = ruolo === "paziente" ? NavbarPaziente : Navbar;
    let NavbarToShow = Navbar; // default: admin

    if (ruolo === "paziente") {
        NavbarToShow = NavbarPaziente;
    } else if (ruolo === "staff") {
        NavbarToShow = NavbarStaff;
    }

    // const effectiveHideFAB = hideFAB || ruolo === "paziente";
    const effectiveHideFAB =
        hideFAB || ruolo === "paziente" || ruolo === "staff";

    const hasChildren = React.Children.count(children) > 0;

    useEffect(() => {
        const stored = sessionStorage.getItem("onboarding");
        if (stored) {
            try {
                setOnboarding(JSON.parse(stored));
            } catch {
                sessionStorage.removeItem("onboarding");
            }
        }
        console.log(onboarding);
    }, []);
    const mustShowLegalModal = onboarding?.needs_privacy === true;

    return (
        <div className="bg-background flex w-screen h-screen overflow-hidden">
            <NavbarToShow menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <div
                className="
                flex flex-col flex-1 h-full relative
                w-full
                md:max-w-[calc(100vw-200px)]
            "
            >
                <div className="w-full">
                    <TopBar onHamburgerClick={() => setMenuOpen(true)} />
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 md:px-4 mt-[10px] md:mt-[20px] pb-24">
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
            <ModalOnboarding
                isOpen={!!mustShowLegalModal}
                onboarding={onboarding}
                onAccepted={(updated) => setOnboarding(updated)}
            />
        </div>
    );
};

export default Home;
