// import axios from "axios";

// export const axiosInstance = axios.create({
//     baseURL: import.meta.env.VITE_API_URL
// });



// import axios from "axios";

// export const axiosInstance = axios.create({
//     baseURL: import.meta.env.VITE_API_URL,
//     withCredentials: true,
// });


import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://www.itacariabilitazione.it", // HARDCODATO
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    }
});