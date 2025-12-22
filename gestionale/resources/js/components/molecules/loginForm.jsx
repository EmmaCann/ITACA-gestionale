import React, { useState, useEffect } from "react";
import { loginUser } from "../../data/api/auth.js";
import { LoginInputAndLabel } from "./loginInputAndLabel";
import { LoginButton } from "./atoms/loginButton";
import { ErrorBox } from "./atoms/errorBox.jsx";
import axios from "axios";

export const LoginForm = () => {
    // const csrfToken =
    //     document
    //         .querySelector('meta[name="csrf-token"]')
    //         ?.getAttribute("content") || "";

    const [data, setData] = useState({
        username: "",
        password: "",
        // _token: csrfToken,
    });

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        setLoading(true);
        setShowError(false);

        try {
             await axios.get('/');
            const response = await loginUser(data);
            // if (response.redirect_url) {
            //     window.location.href = response.redirect_url;
            // }
            if (response.redirect_url) {
                if (response.onboarding) {
                    sessionStorage.setItem(
                        "onboarding",
                        JSON.stringify(response.onboarding)
                    );
                }

                window.location.href = response.redirect_url;
            }
        } catch (error) {
            setErrorMessage(error.message); // Usa il messaggio di errore dal backend
            setShowError(true);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => {
                setShowError(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[380px] h-fit ">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center w-full gap-4"
            >
                <LoginInputAndLabel
                    label="USERNAME"
                    type="text"
                    name="username"
                    iconLeft="icons/head.png"
                    value={data.username}
                    placeholder={"Inserisci username"}
                    onChange={handleChange}
                />
                <LoginInputAndLabel
                    label="PASSWORD"
                    type="password"
                    name="password"
                    iconLeft="icons/brain.png"
                    value={data.password}
                    placeholder={"Inserisci password"}
                    onChange={handleChange}
                />

                <LoginButton
                    text={loading ? "Loading..." : "LOGIN"}
                    disabled={loading}
                />
            </form>

            {showError && (
                <div className="fixed bottom-4 right-4">
                    <ErrorBox
                        text={errorMessage}
                        onClick={() => setShowError(false)}
                    />
                </div>
            )}
        </div>
    );
};
