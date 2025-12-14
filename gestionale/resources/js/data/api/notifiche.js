import { baseCall } from "./baseCall";

/**
 * Invia una notifica dal pannello admin
 */
export const inviaNotifica = async (payload) => {
    return baseCall({
        endpoint: "/admin/notifiche",
        method: "POST",
        data: payload,
    });
};


export const getUtentiPerNotifica = async () => {
    return baseCall({
        endpoint: "/admin/utenti-per-notifica",
        method: "GET",
    });
};
