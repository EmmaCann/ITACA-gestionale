import React, { useState, useEffect } from "react";
import { baseCall } from "../../data/api/baseCall.js";
import { LoginInputAndLabel } from "./loginInputAndLabel";
import { LoginButton } from "./atoms/loginButton";

export const LoginForm = () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";

    // Stato del form
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        _token: csrfToken,
    });

    // Stato per gli errori
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Debug: Mostra il valore aggiornato del formData ogni volta che cambia
    useEffect(() => {
        console.log("📌 Stato attuale del formData:", formData);
    }, [formData]);

    // Funzione per aggiornare i dati del form
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`📝 Campo aggiornato: ${name} = ${value}`); // Debug input

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Funzione di submit del form con baseCall
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        console.log("🔍 Dati inviati al backend:", formData); // Debug

        try {
            const response = await baseCall({
                endpoint: "/login",
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    "Content-Type": "application/json",
                },
                data: formData,
            });

            console.log("✅ Risposta dal backend:", response.data); // Debug

            if (response.data.redirect_url) {
                console.log("🔄 Redirect a:", response.data.redirect_url);
                window.location.href = response.data.redirect_url; // Redirect dopo il login
            }
        } catch (error) {
            console.error("❌ Errore dal backend:", error.message);
            setErrorMessage(error.message || "Credenziali non valide");
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center w-[400px] h-fit mr-[62px] ml-[62px]">
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full gap-4">
                <LoginInputAndLabel
                    label="USERNAME"
                    type="text"
                    name="username"
                    iconLeft="icons/head.png"
                    value={formData.username}
                    onChange={handleChange} // ✅ Usa onChange direttamente
                />
                <LoginInputAndLabel
                    label="PASSWORD"
                    type="password"
                    name="password"
                    iconLeft="icons/brain.png"
                    value={formData.password}
                    onChange={handleChange} // ✅ Usa onChange direttamente
                />

                <LoginButton text={loading ? "Loading..." : "LOGIN"} disabled={loading} />
            </form>

            {errorMessage && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};
