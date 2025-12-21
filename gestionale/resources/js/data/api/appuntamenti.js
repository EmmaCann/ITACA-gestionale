import { baseCall } from "./baseCall";

export const creaAppuntamento = async (datiAppuntamento) => {
    return baseCall({
        endpoint: "/appuntamenti",
        method: "POST",
        data: datiAppuntamento,
        headers: {
            'Content-Type': 'application/json',
             "Accept": "application/json"
        }
    });
};

/**
 * Recupera gli appuntamenti del giorno (solo admin)
 * @param {string} data YYYY-MM-DD
 */
export const getAppuntamentiGiorno = async (data) => {
    return baseCall({
        endpoint: "/appuntamenti/giorno",
        method: "GET",
        params: { data },
        headers: {
            "Accept": "application/json",
        },
    });
};