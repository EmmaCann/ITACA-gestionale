import React from "react";
import { usePage, Link } from "@inertiajs/react";
import BrainIcon from "../../../../../public/icons/brain.png";

export const ProfileIcon = () => {
    const { props } = usePage();
    const ruolo = props?.ruolo || null;

    // dati presi dalla sessione passati da Inertia
    const logged =
        props?.logged_user ||
        props?.auth?.user ||
        props?.user ||
        props?.loggedUser ||
        {};

    const nome = logged?.nome || logged?.name || "";
    const cognome = logged?.cognome || "";

    // Debug solo in dev
    try {
        if (
            typeof window !== "undefined" &&
            window &&
            process &&
            process.env &&
            process.env.NODE_ENV !== "production"
        ) {
            console.debug("[ProfileIcon] page props:", props);
        }
    } catch (e) {}

    // ADMIN mantiene il brain icon, ma cliccabile per andare al profilo
    if (ruolo === "admin") {
        return (
            <Link href="/profilo">
                <div className="cursor-pointer bg-pinkSecondary rounded-full w-[56px] h-[54px] justify-center items-center flex mx-2">
                    <div className=" bg-white rounded-full w-[38px] h-[38px] justify-center items-center flex">
                        <img
                            src={BrainIcon}
                            alt="brain icon"
                            className="w-[28px] h-[28px]"
                        />
                    </div>
                </div>
            </Link>
        );
    }

    // Altri ruoli → iniziali
    const initialNome = nome ? nome.charAt(0).toUpperCase() : "";
    const initialCognome = cognome ? cognome.charAt(0).toUpperCase() : "";
    const initials = `${initialNome}${initialCognome}` || "U";

    return (
        <Link href="/profilo">
            <div className="cursor-pointer bg-pinkSecondary rounded-full w-[56px] h-[54px] justify-center items-center flex mx-2">
                <div className="bg-white rounded-full w-[38px] h-[38px] justify-center items-center flex">
                    <span className="text-sm font-semibold text-bluPrimary">
                        {initials}
                    </span>
                </div>
            </div>
        </Link>
    );
};
