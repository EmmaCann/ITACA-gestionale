// import React from "react";
// import { TopNavBar } from "../components/molecules/topNavBar.jsx";
// import { ProfileIcon } from "../components/molecules/atoms/profileIcon.jsx";

// export const TopBar = () => {
//     return (
//         <div className=" flex w-full h-screen abolute top-0  py-2 ">
//           <TopNavBar />
//           <ProfileIcon/>
//         </div>
//     );
// }

import React from "react";
import { TopNavBar } from "../components/molecules/topNavBar.jsx";
import { ProfileIcon } from "../components/molecules/atoms/profileIcon.jsx";

import { FiMenu } from "react-icons/fi";

export const TopBar = ({ onHamburgerClick }) => {
    return (
        <div className="flex w-full absolute top-0 py-2 px-4 items-center justify-between  shadow md:shadow-none z-10">
            {/* HAMBURGER SOLO MOBILE */}
            <button
                onClick={() => {
                    console.log("CLICK FROM TOPBAR");
                    onHamburgerClick();
                }}
                className="md:hidden text-3xl text-gray-700 z-50"
            >
                <FiMenu />
            </button>

            {/* RESTO DELLA TOPBAR */}
            <TopNavBar />
            <ProfileIcon />
        </div>
    );
};
