import React from "react";

import {FilterItem} from "./atoms/fiterItem.jsx";


export const Filters=()=>{
    return(
        <div className="flex flex-row gap-4 mb-4">
            <FilterItem text="ETA'" bgColor="rosa"/>
            <FilterItem text="SESSO" bgColor="blu"/>
            <FilterItem text="GRUPPI" bgColor="rosa"/>
            <FilterItem text="DIAGNOSI" bgColor="blu"/>
            <FilterItem text="COLLABORAZIONE TERAPISTI" bgColor="rosa"/>
        </div>
    )
}