import React from "react";

import Home from "./Home";
import {ListaAttesaFilters} from "../components/molecules/listaAttesaFilters.jsx";
import { FABicon } from "../components/molecules/atoms/FABicon.jsx";
import {ListaAttesaTable} from "../components/listaAttesaTable.jsx";
const ListaAttesa = () => {
    return (
        <Home>
            <div className="w-full h-full flex flex-col">
                <div className="flex flex-row w-full  items-center justify-center p-2">
                    <ListaAttesaFilters/>
                    <FABicon isFAB={false} />
                </div>
                <div className="flex flex-col w-full h-full mt-4">
                    <ListaAttesaTable/>
                </div>
                
            </div>
            
        </Home>
    );
};

export default ListaAttesa;
