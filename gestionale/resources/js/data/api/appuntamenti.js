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
