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
