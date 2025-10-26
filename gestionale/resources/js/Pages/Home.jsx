

// import React from "react";
// import { Navbar } from "../components/navbar";
// import { TopBar } from "../components/topBar";
// import { FAB } from "../components/molecules/FAB.jsx";
// import { ToastContainer } from "react-toastify";

// const Home = ({ children,hideFAB=false }) => {
//     return (
//         <div className="bg-background flex w-screen h-screen overflow-hidden">
//             {/* Navbar a sinistra */}
//             <div>
//                 <Navbar />
//             </div>

//             {/* Contenitore principale con TopBar sopra e Content sotto */}
//             <div className="flex flex-col flex-1 h-full relative">
//                 {/* TopBar fissa con altezza specifica */}
//                 <div className="h-[70px] w-full">
//                     <TopBar />
//                 </div>

//                 {/* Content-container che occupa tutto lo spazio sotto la TopBar */}
//                 <div className="flex-1 overflow-y-auto p-4 mr-1 ">
//                     {children}
//                     {!hideFAB && <FAB />}
//                 </div>
//             </div>
//             <ToastContainer position="top-right" autoClose={2000} />

//         </div>
     
//     );

// }
// export default Home;


import React from "react";
import { Navbar } from "../components/navbar";
import { NavbarPaziente } from "../components/navbarPaziente";
import { usePage } from "@inertiajs/react";
import { TopBar } from "../components/topBar";
import { FAB } from "../components/molecules/FAB.jsx";
import { ToastContainer } from "react-toastify";
import { CalendarBoard } from "../components/CalendarBoard";

const Home = ({ children, hideFAB=false }) => {
  const hasChildren = React.Children.count(children) > 0;
  const { props } = usePage();
  const ruolo = props?.ruolo || null;
  const NavbarToShow = ruolo === "paziente" ? NavbarPaziente : Navbar;
  // Nascondi FAB per i pazienti anche se hideFAB non è passato
  const effectiveHideFAB = hideFAB || ruolo === "paziente";

  return (
    <div className="bg-background flex w-screen h-screen overflow-hidden">
      <div>
        <NavbarToShow />
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

          {!effectiveHideFAB && <FAB />}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Home;
