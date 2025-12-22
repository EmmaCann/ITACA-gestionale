import React, { useState } from "react";
import { TogglePasswordIcon } from "./TogglePasswordIcon";

export const LoginInput = ({
    inputType,
    placeholder,
    iconLeft,
    onTextChanged,
    name,
    value,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const inputTypeFinal =
        inputType === "password" && isPasswordVisible ? "text" : inputType;

    const handleChange = (event) => {
        if (onTextChanged) {
            onTextChanged(event);
        }
    };

    return (
        <div className="bg-white drop-shadow-md text-[#50534C] rounded-[16px] flex items-center w-full h-[48px] px-4">
            {iconLeft && (
                <img
                    src={iconLeft}
                    alt="Icon Left"
                    className="w-[32px] h-[32px] mr-2 mt-2"
                />
            )}
            <input
                type={inputTypeFinal}
                placeholder={placeholder}
                value={value}
                name={name}
                onChange={handleChange}
                className="w-full text-[#50534C] text-[14px] text-start focus:outline-none px-4"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        e.target.form?.requestSubmit();
                    }
                }}
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
