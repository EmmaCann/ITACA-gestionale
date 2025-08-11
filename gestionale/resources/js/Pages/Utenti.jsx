import React from "react";
import Home from "./Home.jsx";

import { SearchBar } from "../components/molecules/atoms/searchBar.jsx";
import { Filters } from "../components/molecules/filters.jsx";
import { Container } from "../components/molecules/container.jsx";
const Utenti = () => {
    return (
        <Home>
            <div className=" overflow-y-auto">
                <div className="flex flex-col w-full items-center gap-4 ">
                    <SearchBar isTopBar={false}/>
                    <Filters/>
                </div>
                <div className=" flex-1 flex flex-row gap-16 justify-center">
                    <Container text="REGISTRO STORICO PAZIENTI"/>
                    <Container text="REGISTRO PAZIENTI ATTIVI"/>
                    <Container text="REGISTRO PAZIENTI INDEBITO" small={true}/>
                </div>
            </div>
        </Home>
    );
};

export default Utenti;
