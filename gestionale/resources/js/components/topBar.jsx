import React from "react";
import { TopNavBar } from "../components/molecules/topNavBar.jsx";
import { ProfileIcon } from "../components/molecules/atoms/profileIcon.jsx";
import { FiMenu } from "react-icons/fi";

export const TopBar = ({ onHamburgerClick }) => {
    return (
        <div
            className="
                w-full px-2 py-2 shadow md:shadow-none z-10
                flex items-center gap-2
            "
        >
            {/* HAMBURGER */}
            <button
                onClick={onHamburgerClick}
                className="md:hidden text-3xl text-gray-700 shrink-0"
            >
                <FiMenu />
            </button>

            {/* BLOCCO CENTRALE — ora NON scrolla, perché si adatta */}
            <div className="flex-1 flex items-center justify-center">
                <TopNavBar />
            </div>

            {/* PROFILE ICON */}
            <div className="shrink-0 ml-2">
                <ProfileIcon />
            </div>
        </div>
    );
};
