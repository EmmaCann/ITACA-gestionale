import React from "react";
import { LoginInput } from "./atoms/loginInput";

export const LoginInputAndLabel = ({ label,type,iconLeft }) => {

    return (
        <div className="flex flex-col items-start w-full">
            {/* TODO cambiare il font con marcellus SC */}
            <span className="text-[#50534C] text-[14px] ml-1 mb-2 mt-10">{label}</span>
            <LoginInput inputType={type} iconLeft={iconLeft} />
        </div>
       
        
    );
}