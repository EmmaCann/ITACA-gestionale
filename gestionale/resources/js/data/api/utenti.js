import { baseCall } from "./baseCall";

/**
 * Crea un nuovo utente (staff o paziente).
 *
 * @async
 * @function creaUtente
 * @param {object} utente - Dati dell'utente da creare.
 * @param {"staff"|"paziente"} utente.tipoUtente - Il tipo di utente.
 * @returns {Promise<object>} I dati dell'utente appena creato.
 *
 * @example
 * const nuovoUtente = await creaUtente({ tipoUtente: "staff", nome: "Mario", ... });
 */
export const creaUtente = async (utente) => {
    try {
        const response = await baseCall({
            endpoint: "/utenti",
            method: "POST",
            data: utente,
        });

        return response.data;
    } catch (error) {
        console.error("Errore durante la creazione dell'utente:", error.message);
        throw error;
    }
};


/**
 * Cambia la password dell'utente loggato.
 *
 * @param {object} dati - contiene password_attuale, nuova_password, conferma_password
 * @returns {Promise<object>}
 */
export const cambiaPassword = async (dati) => {
    return baseCall({
        endpoint: "/profilo/cambio-password",
        method: "POST",
        data: dati,
    });
};