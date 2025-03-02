import React from "react";
import { TopNavBar } from "../components/molecules/topNavBar.jsx";
import { ProfileIcon } from "../components/molecules/atoms/profileIcon.jsx";

export const TopBar = () => {
    return (
        <div className=" flex w-full h-screen abolute top-0  py-2 ">
          <TopNavBar />
          <ProfileIcon/>
        </div>
    );
}