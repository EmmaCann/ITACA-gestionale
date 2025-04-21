
import { baseCall } from "./baseCall";


const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");


export const creaPagamento = async (data) => {
    return await fetch("/pagamenti", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-CSRF-TOKEN": csrfToken, 
        },
        body: JSON.stringify(data)
    }).then(res => res.json());
};




export const getStatsIncassi = async () => {
    try {
        const response = await baseCall({
            endpoint: "/pagamenti/stats",
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.error("Errore durante il recupero delle statistiche degli incassi:", error.message);
        throw error;
    }
};
