

import React from "react";
import { NavbarPaziente } from "../components/navbarPaziente";
import { TopBar } from "../components/topBar";
import { FAB } from "../components/molecules/FAB.jsx";
import { ToastContainer } from "react-toastify";
import { CalendarBoard } from "../components/CalendarBoard";

// Per i pazienti nascondiamo il FAB di default
const Home = ({ children, hideFAB=true }) => {
  const hasChildren = React.Children.count(children) > 0;

  return (
    <div className="bg-background flex w-screen h-screen overflow-hidden">
      <div>
        <NavbarPaziente />
      </div>

      <div className="flex flex-col flex-1 h-full relative">
        <div className="h-[70px] w-full">
          <TopBar />
        </div>

        <div className="flex-1 overflow-y-auto p-4 mr-1">
          {hasChildren ? (
            children
          ) : (
            // Fallback: calendario a piena altezza sotto la TopBar
            <div className="h-[calc(100vh-70px-2rem)]">
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

export default Home;
