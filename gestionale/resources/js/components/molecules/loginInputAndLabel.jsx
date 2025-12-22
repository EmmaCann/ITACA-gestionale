import React from "react";
import { LoginInput } from "./atoms/loginInput";

export const LoginInputAndLabel = ({ label, type, iconLeft, placeholder, value, onChange, name }) => {
    return (
        <div className="flex flex-col items-start w-full">
            <span className="text-[#50534C] font-marcellusSC text-[14px] ml-1 mb-2 mt-10">{label}</span>
            <LoginInput
                inputType={type}
                placeholder={placeholder}
                iconLeft={iconLeft}
                value={value}
                name={name} 
                onTextChanged={onChange} 
            />
        </div>
    );
};
