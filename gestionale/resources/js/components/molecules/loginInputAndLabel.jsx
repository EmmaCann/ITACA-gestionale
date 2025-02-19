import React from "react";
import { LoginInput } from "./atoms/loginInput";

/** LoginInput component + label on top for login-form
 * params required: label, params of LoginInput (type,iconLeft)
 */

export const LoginInputAndLabel = ({ label,type,iconLeft }) => {

    return (
        <div className="flex flex-col items-start w-full">
            
            <span className="text-[#50534C] font-marcellusSC text-[14px] ml-1 mb-2 mt-10">{label}</span>
            <LoginInput inputType={type} iconLeft={iconLeft} />
        </div>
       
        
    );
}