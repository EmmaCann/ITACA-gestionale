import React from "react";
import { usePage } from "@inertiajs/react";

export const WelcomeMessage = () => {
    const { props } = usePage();

    // Defensive: the shared user object may be available under different keys
    const ruolo = props?.ruolo || null;
    const logged = props?.logged_user || props?.auth?.user || props?.user || props?.loggedUser || {};

    // Debug: log page props once to help trace where the user data lives (dev only)
    try {
        if (typeof window !== 'undefined' && window && process && process.env && process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.debug('[WelcomeMessage] page props:', props);
        }
    } catch (e) {
        // ignore in environments without process
    }

    const nome = logged?.nome || logged?.name || '';

    // If admin, keep the original ALL-CAPS ADMIN greeting
    if (ruolo === 'admin') {
        return (
            <div>
                <span className="block font-marcellusSC text-black text-[14px] drop-shadow-2xl">CIAO, ADMIN!</span>
            </div>
        );
    }

    // For other roles show "Ciao, Nome!" with capitalized name
    const displayName = nome
        ? nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase()
        : 'utente';

    return (
        <div>
            <span className="block font-marcellusSC text-black text-[18px] drop-shadow-2xl">Ciao, {displayName}!</span>
        </div>
    );
};