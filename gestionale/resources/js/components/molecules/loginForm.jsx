import React from "react";
import { LoginInputAndLabel } from "./loginInputAndLabel";
import { LoginButton } from "./atoms/loginButton";

/** login form component made of :  LoginButton,2x LoginInputAndLabel */
export const LoginForm = () => {
    return (
        <div className="flex flex-col items-center justify-center w-[400px] h-fit mr-[62px] ml-[62px]"> 
            <LoginInputAndLabel label="USERNAME" type="text" iconLeft="icons/head.png" />
            <LoginInputAndLabel label="PASSWORD" type="password"  iconLeft="icons/brain.png"/>
            <LoginButton text="LOGIN" />
        </div>
    );
}