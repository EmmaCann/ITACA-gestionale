import React from "react";
import { TopNavBar } from "../components/molecules/topNavBar.jsx";
import { ProfileIcon } from "../components/molecules/atoms/profileIcon.jsx";
import { FiMenu } from "react-icons/fi";

export const TopBar = ({ onHamburgerClick }) => {
    return (
        <div className="w-full px-2 py-2 shadow md:shadow-none flex flex-col gap-2 bg-background">
            {/* DESKTOP */}
            <div className="hidden md:flex items-center w-full gap-2">
                <div className="flex-1">
                    <TopNavBar />
                </div>
                <ProfileIcon />
            </div>

            {/* MOBILE */}
            <div className="md:hidden flex flex-col gap-2 w-full">
                {/* RIGA 1 */}
                <div className="flex items-center justify-between w-full">
                    <button
                        onClick={onHamburgerClick}
                        className="text-3xl text-gray-700"
                    >
                        <FiMenu />
                    </button>

                    <div className="flex-1 flex justify-center">
                        <TopNavBar mode="date" />
                    </div>

                    <ProfileIcon />
                </div>

                {/* RIGA 2 */}
                <div className="flex items-center justify-between w-full px-1 mb-1">
                    <TopNavBar mode="welcome" />
                </div>
            </div>
        </div>
    );
};
