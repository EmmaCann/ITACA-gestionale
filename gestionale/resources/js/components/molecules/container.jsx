import React from "react";
import { LabelContainer } from "./atoms/labelContainer";
import { ListContainer } from "./atoms/listContainer";

export const Container = ({text,small}) =>{
    return(
        <div className="mt-8 ml-4 flex flex-col relative  drop-shadow ">
            <LabelContainer text={text}/>
            <ListContainer small={small}/>
        </div>
    )
}