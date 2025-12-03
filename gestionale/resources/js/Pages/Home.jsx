import React, { useState } from "react";
import { Navbar } from "../components/navbar";
import { NavbarPaziente } from "../components/navbarPaziente";
import { usePage } from "@inertiajs/react";
import { TopBar } from "../components/topBar";
import { FAB } from "../components/molecules/FAB.jsx";
import { ToastContainer } from "react-toastify";
import { CalendarBoard } from "../components/CalendarBoard";

const Home = ({ children, hideFAB = false }) => {
  // stato menu mobile (vale per TUTTI i ruoli)
  const [menuOpen, setMenuOpen] = useState(false);

  console.log("HOME.jsx menuOpen:", menuOpen);

  const { props } = usePage();
  const ruolo = props?.ruolo || null;

  const hasChildren = React.Children.count(children) > 0;

  // scegli la navbar
  const NavbarToShow = ruolo === "paziente" ? NavbarPaziente : Navbar;

  // i pazienti non vedono il fab
  const effectiveHideFAB = hideFAB || ruolo === "paziente";

  return (
    <div className="bg-background flex w-screen h-screen overflow-hidden">

      {/* Passiamo menuOpen e setMenuOpen SEMPRE */}
      <NavbarToShow menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="flex flex-col flex-1 h-full relative">
        
        <div className="h-[70px] w-full">
          <TopBar
            onHamburgerClick={() => {
              console.log("CLICK → OPEN DRAWER");
              setMenuOpen(true);
            }}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 mr-1">
          
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
