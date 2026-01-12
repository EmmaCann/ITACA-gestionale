import { baseCall } from "./baseCall";

// Recupera tutta la lista d’attesa
export const getListaAttesa = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.tipoUtente) params.append('tipo_utente', filters.tipoUtente);
    if (filters.terapia) params.append('terapia', filters.terapia);
    if (filters.richiestaTerapista) params.append('richiesta_terapista', '1');

    return baseCall({
        endpoint: `/get-lista-attesa?${params.toString()}`,
        method: "GET",
    });
};

// Aggiunge una voce alla lista d’attesa
export const creaVoceListaAttesa = async (data) => {
    return baseCall({
        endpoint: "/aggiungi-lista-attesa",
        method: "POST",
        data,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });
};

// Segna come chiamato
export const segnaChiamato = async (id,valore) => {
       return baseCall({
        endpoint: `/lista-attesa/${id}/chiamato`,
        method: "PATCH",
        data: { chiamato: valore },
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const aggiornaTerapia = async (id, terapia) => {
    return baseCall({
        endpoint: `/lista-attesa/${id}/aggiorna-terapia`,
        method: "PATCH",
        data: { terapia },
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
};

export const aggiornaTerapista = async (id, terapista_id) => {
    return baseCall({
        endpoint: `/lista-attesa/${id}/aggiorna-terapista`,
        method: "PATCH",
        data: { terapista_id },
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
};

export const aggiornaVoceListaAttesa = (id, payload) =>
    baseCall({
        endpoint: `/lista-attesa/${id}`,
        method: "PUT",
        data: payload,
    });

export const eliminaVoceListaAttesa = (id) =>
    baseCall({
        endpoint: `/lista-attesa/${id}`,
        method: "DELETE",
    });


