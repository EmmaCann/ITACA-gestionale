import { baseCall } from "./baseCall.js";

/** Chiamata API per il login */
export const loginUser = async (data) => {
    try {
        const response = await baseCall({
            endpoint: "/login",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data,
        });

        return response.data;
    } catch (error) {
       
        if (error.response && error.response.data && error.response.data.errore) {
            throw new Error(error.response.data.errore);
        }
        throw new Error("Si è verificato un errore. Riprova.");
    }
};

/** Chiamata API per accettare privacy e termini */
export const acceptLegal = async () => {
    try {
        const response = await baseCall({
            endpoint: "/onboarding/accept-legal",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.errore) {
            throw new Error(error.response.data.errore);
        }
        throw new Error("Errore durante l'accettazione dei termini.");
    }
};