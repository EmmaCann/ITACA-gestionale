import {axiosInstance} from "../axiosConfig.js";

export const baseCall = async ({endpoint, method, headers, params, data}) => {
    const response = await axiosInstance({
        method: method,
        url: endpoint,
        headers,
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
