import React from "react";
import { LoginInputAndLabel } from "./loginInputAndLabel";
import { LoginButton } from "./atoms/loginButton";


export const LoginForm = () => {
    return (
        <div className="flex flex-col items-center justify-center w-[400px] h-fit"> 
            <LoginInputAndLabel label="USERNAME" type="text" iconLeft="icons/head.png" />
            <LoginInputAndLabel label="PASSWORD" type="password"  iconLeft="icons/brain.png"/>
            <LoginButton text="LOGIN" />
        </div>
    );
}