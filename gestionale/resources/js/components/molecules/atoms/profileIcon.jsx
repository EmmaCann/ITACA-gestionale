import React from "react";
import { usePage } from "@inertiajs/react";
import BrainIcon from "../../../../../public/icons/brain.png";

export const ProfileIcon = () => {
    const { props } = usePage();
    const ruolo = props?.ruolo || null;
    // Defensive fallbacks for where the backend may expose the user
    const logged = props?.logged_user || props?.auth?.user || props?.user || props?.loggedUser || {};
    const nome = logged?.nome || logged?.name || '';
    const cognome = logged?.cognome || '';

    // Debug: log page props in development to help diagnose missing user data
    try {
        if (typeof window !== 'undefined' && window && process && process.env && process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.debug('[ProfileIcon] page props:', props);
        }
    } catch (e) {
        // ignore
    }

    // Admin: keep the brain image
    if (ruolo === 'admin') {
        return (
            <div className="bg-pinkSecondary rounded-full w-[56px] h-[54px] justify-center items-center flex mx-2">
                <div className=" bg-white rounded-full w-[38px] h-[38px] justify-center items-center flex">
                    <img src={BrainIcon} alt="brain icon" className="w-[28px] h-[28px]"/>
                </div>
            </div>
        );
    }

    // Other roles: show initials from nome and cognome (fallbacks)
    const initialNome = nome ? nome.charAt(0).toUpperCase() : '';
    const initialCognome = cognome ? cognome.charAt(0).toUpperCase() : '';
    const initials = `${initialNome}${initialCognome}` || 'U';

    return (
        <div className="cursor-pointer bg-pinkSecondary rounded-full w-[56px] h-[54px] justify-center items-center flex mx-2">
            <div className="bg-white rounded-full w-[38px] h-[38px] justify-center items-center flex">
                <span className="text-sm font-semibold text-bluPrimary">{initials}</span>
            </div>
        </div>
    );
};