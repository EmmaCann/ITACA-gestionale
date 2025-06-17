// import React from "react";
// import { Navbar } from "../components/navbar";
// import { TopBar } from "../components/topBar";
// import { FAB } from "../components/molecules/FAB.jsx";

// const Home = ({children}) => {
//     return (
//         <div className="bg-background flex w-screen h-screen flex-row overflow-x-hidden">
//             {/* Navbar a sinistra */}
//             <div>
//                 <Navbar />
//             </div>

//             <div className="flex-1 flex flex-col relative">
//                 <TopBar />

//                 <div className="content-container flex-1 overflow-y-auto border-2 ">
//                     {children}
//                     <FAB />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Home;

import React from "react";
import { Navbar } from "../components/navbar";
import { TopBar } from "../components/topBar";
import { FAB } from "../components/molecules/FAB.jsx";
import { ToastContainer } from "react-toastify";

const Home = ({ children,hideFAB=false }) => {
    return (
        <div className="bg-background flex w-screen h-screen overflow-hidden">
            {/* Navbar a sinistra */}
            <div>
                <Navbar />
            </div>

            {/* Contenitore principale con TopBar sopra e Content sotto */}
            <div className="flex flex-col flex-1 h-full relative">
                {/* TopBar fissa con altezza specifica */}
                <div className="h-[70px] w-full">
                    <TopBar />
                </div>

                {/* Content-container che occupa tutto lo spazio sotto la TopBar */}
                <div className="flex-1 overflow-y-auto p-4 mr-1 ">
                    {children}
                    {!hideFAB && <FAB />}
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
     
    );
};

export default Home;
