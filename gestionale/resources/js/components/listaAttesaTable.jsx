import React from "react";
import { ListaAttesaHeader } from "./molecules/listaAttesaHeader";
import { ListaAttesaRow } from "./molecules/listaAttesaRow";

export const ListaAttesaTable = ({ pazienti, filtriAttivi }) => {
    return (
        <div>
            <ListaAttesaHeader/>
            <ListaAttesaRow/>
        </div>
    );
};
