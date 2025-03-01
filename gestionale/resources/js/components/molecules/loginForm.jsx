import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { LoginInputAndLabel } from "./loginInputAndLabel";
import { LoginButton } from "./atoms/loginButton";
// import { ErrorBox } from "../atom/errorBox";   TODO da creare

export const LoginForm = ({ errors }) => {
    // Recupero il CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

    // Stato del form con Inertia.js
    const { data, setData, post, processing } = useForm({
        username: "",
        password: "",
        _token: csrfToken,
    });

    // Stato per gli errori
    const [showError, setShowError] = useState(!!errors?.errore);

    // Funzione di submit del form
    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login", {
            onError: () => setShowError(true),
        });
    };

    // Timer per nascondere errori dopo 3 secondi
    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => {
                setShowError(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    return (
        <div className="flex flex-col items-center justify-center w-[400px] h-fit mr-[62px] ml-[62px]">
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full gap-4">
                <LoginInputAndLabel
                    label="USERNAME"
                    type="text"
                    iconLeft="icons/head.png"
                    onTextChanged={(value) => setData("username", value)}
                />
                <LoginInputAndLabel
                    label="PASSWORD"
                    type="password"
                    iconLeft="icons/brain.png"
                    onTextChanged={(value) => setData("password", value)}
                />
                <LoginButton text="LOGIN" disabled={processing} />
            </form>

            {showError && errors?.errore && (
                <div className="fixed bottom-4 right-4">
                    <ErrorBox text={errors.errore} onClick={() => setShowError(false)} />
                </div>
            )}
        </div>
    );
};
