import React, { useState } from "react";
import { TogglePasswordIcon } from "./TogglePasswordIcon";

export const LoginInput = ({ inputType, iconLeft }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    

    const inputTypeFinal = inputType === "password" && isPasswordVisible ? "text" : inputType;

    return (
        <div className="bg-white drop-shadow-md text-[#50534C] rounded-[16px] flex items-center w-[450px] h-[52px] px-4">
           
            {iconLeft && (
                <img
                    src={iconLeft}
                    alt="Icon Left"
                    className="w-[32px] h-[32px] mr-2 mt-2"
                />
            )}

            
            <input
                type={inputTypeFinal}
                className="w-full text-[#50534C] text-[14px] text-start focus:outline-none px-4"
            />

        
            {inputType === "password" && (
                <TogglePasswordIcon
                    toggle={() => setIsPasswordVisible(!isPasswordVisible)}
                    isVisible={isPasswordVisible}
                />
            )}
        </div>
    );
};
