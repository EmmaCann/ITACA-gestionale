import {axiosInstance} from "../axiosConfig.js";

export const baseCall = async ({endpoint, method,headers = {}, params, data}) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const response = await axiosInstance({
        method: method,
        url: endpoint,
        headers: {
            ...headers,
            'X-CSRF-TOKEN': csrfToken, 
            
        },
        params,
        data
    });

    const {data: dataResponse} = response || {};
    const {error, ...other} = dataResponse || {};

    if (error) {
        throw new Error(error || "Si è verificato un errore");
    }

    return {
        data: other
    }
}
